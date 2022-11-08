#!/usr/bin/env node
import { program } from 'commander'
import glob from 'glob'
import path from 'path'
import pg from 'pg'
import fs from 'fs/promises'
import { clearDefine, getDefine, getTypedef, isExistTypedef, loadPgtypeAllOids, loadPgtypeByOid, QueryHeader, setTypedef, snakeToCamel, totalTypedef } from '../lib/index.js'

// ============================================================================
const qgen = program
    .option('-o, --output <dir>', 'output base directory, default : ./query', './query')
    .option('-b, --base <dir>', 'base path for input, default : .', '.')
    .option('-t, --typedef <filepath>', 'output typedef file, default : ./_typedef.qg.ts', './_typedef.qg.ts')
    .option('--pg-host <host>', 'postgres database host, default : localhost', 'localhost')
    .option('--pg-port <port>', 'postgres database port, default : 5432', '5432')
    .option('--pg-username <username>', 'postgres database username, default : postgres', 'postgres')
    .option('--pg-password <password>', 'postgres database password, default : ', '')
    .option('--pg-database <database>', 'postgres database password, default : postgres', 'postgres')
    .argument('[patterns...]', 'mode and input file pattern, default : [./**/*.qg.js]')
    .parse()
const patterns = qgen.args.length === 0 ? ['./**/*.qg.js'] : qgen.args
const opts = qgen.opts()
// ============================================================================
const inputs = (await Promise.all(patterns.map((pattern) => {
    return new Promise((resolve, reject) => {
        glob.glob(pattern, (err, matches) => {
            if (err === null || err === undefined) {
                return resolve(matches)
            }
            return reject(err)
        })
    })
}))).flat()
// ============================================================================
// 데이터베이스 접속
const dboption = {
    host: opts.pgHost,
    port: opts.pgPort,
    user: opts.pgUsername,
    password: opts.pgPassword,
    database: opts.pgDatabase,
}
const pool = new pg.Pool(dboption)
console.log('데이터베이스 값', { ...dboption, password: '***' })
try {
    console.log('데이터베이스 접속 시도중...')
    // 데이터베이스 접속 가능여부 검증
    const conn = await pool.connect()
    conn.release()
    console.log('데이터베이스 접속 성공')
} catch (err) {
    console.error("데이터베이스 접속 실패\n", err)
    process.exit(1)
}
// ============================================================================
// postgres pg_catalog 참조해 타입 정보를 불러 옴
console.log(`타입 정보 불러오는 중...`)
const oids = await loadPgtypeAllOids(pool)
const totalOids = oids.length
console.log(`대상 oid 개수 총 ${totalOids}개`)
const pgType = Object.fromEntries(await Promise.all(oids.map(async (oid) => {
    const typ = await loadPgtypeByOid(pool, oid)
    return [typ.oid, typ]
})))
// ============================================================================
console.log(`입력 파일 인식`)
const srcs = []
console.log(`base : ${opts.base}`)
for (const qgjsfile of inputs) {
    const relPath = path.posix.relative(opts.base, qgjsfile)
    const srcPath = path.posix.join(opts.base, relPath)
    let dstPath = path.posix.join(opts.output, relPath)
    dstPath = path.posix.join(
        path.posix.dirname(dstPath),
        `${path.posix.basename(dstPath).split(/\.(.*)/s, 2)[0]}.qg.ts`
    )
    const importTarget = `file:///${path.posix.join(path.posix.join(...process.cwd().split(path.sep), qgjsfile))}`
    await import(importTarget)
    console.log(`쿼리 변환 : ${srcPath} => ${dstPath}`)
    srcs.push({
        rel: relPath,
        src: srcPath,
        dst: dstPath,
        importUrl: importTarget,
        defines: getDefine(),
    })
    clearDefine()
}
// ============================================================================
console.log(`쿼리 테스트중...`)
const testResult = await Promise.all(srcs.map(async ({ src, rel, dst, defines }) => {
    return {
        queries: await Promise.all(defines.map(async ({ query, name, testValues, inputs }) => {
            const check = (await pool.query({
                rowMode: 'array',
                name: name,
                text: query,
                values: testValues,
            }))
            console.log(`${rel.padEnd(20)} > name : ${name.padEnd(16)}, ${query}`)
            return {
                fields: check.fields,
                name,
                query,
                inputs,
            }
        })),
        dst,
        src,
        rel,
    }
}));
// ============================================================================
function importmapToTsscript(im) {
    return Object.keys(im)
        .map(pkg => `import { ${Array.from(im[pkg]).join(', ')} } from ${JSON.stringify(pkg)}`)
        .join("\n")
}

// ============================================================================
const typedefs = testResult.map(v => v.queries.map(v => v.fields).flat()).flat()
    .map(v => v.dataTypeID)
    .map(v => pgType[v])
const typedefImportmap = {}
const typedefNs = {}
function setup(typedef) {
    if (isExistTypedef(typedef.oid, { name: typedef.name, namespace: typedef.namespace })) {
        return
    }
    switch (typedef.type) {
        case 'array':
            setup(typedef.elem)
            const elemdef = getTypedef(typedef.elem.oid)
            let elemexpr = 'any'
            switch (elemdef.type) {
                case 'expression':
                    elemexpr = typedef.expr
                    break
                case 'module':
                    elemexpr = `${typedef.namespace}.${typedef.name}`
                    break
                case 'internal':
                    elemexpr = typedef.symbol
                    break
                case 'external':
                    if (!(typedef.pkg in typedefImportmap)) {
                        typedefImportmap[typedef.pkg] = new Set()
                    }
                    typedefImportmap[typedef.pkg].add(typedef.symbol)
                    elemexpr = typedef.symbol
                    break
            }
            setTypedef(typedef.oid, {
                type: "module",
                namespace: typedef.namespace,
                name: typedef.name,
                expr: `${elemexpr}[]`
            })
        case 'class':
            for (const fieldTypedef of Object.values(typedef.fields)) {
                setup(fieldTypedef)
            }
            setTypedef(typedef.oid, {
                type: "module",
                namespace: typedef.namespace,
                name: typedef.name,
                expr: `{
${Object.entries(typedef.fields).map(([k, td]) => {
                    const fielddef = getTypedef(td.oid)
                    switch (fielddef.type) {
                        case 'expression':
                            return `        ${k}: ${fielddef.expr}`
                        case 'module':
                            return `        ${k}: ${fielddef.namespace}.${fielddef.name}`
                        case 'internal':
                            return `        ${k}: ${fielddef.symbol}`
                        case 'external':
                            if (!(fielddef.pkg in typedefImportmap)) {
                                typedefImportmap[fielddef.pkg] = new Set()
                            }
                            typedefImportmap[fielddef.pkg].add(fielddef.symbol)
                            return `        ${k}: ${fielddef.symbol}`
                    }
                }).join("\n")}
    }`
            })
    }
}
for (const elem of typedefs) {
    setup(elem)
}
for (const td of totalTypedef()) {
    if (td.type === 'module') {
        if (!(td.namespace in typedefNs)) {
            typedefNs[td.namespace] = {}
        }
        typedefNs[td.namespace][td.name] = td.expr
    }
}
function nsToTsscript(ns) {
    return Object.keys(ns)
        .map(k => {
            return `export namespace ${k}{
${Object.entries(ns[k]).map(([sym, expr]) => `    export type ${sym} = ${expr}`).join('\n')}
}`
        }).join('\n')
}
await fs.writeFile(path.join(opts.output, opts.typedef), `// qgen query\n` + importmapToTsscript(typedefImportmap) + `\n` + nsToTsscript(typedefNs))
// ============================================================================
await Promise.all(testResult.map(async ({ src, rel, dst, queries }) => {
    let importTypedefPath = path.posix.relative('./', opts.typedef)
    if (!importTypedefPath.startsWith("./")) {
        importTypedefPath = `./${importTypedefPath}`
    }
    if (importTypedefPath.endsWith(".ts")) {
        importTypedefPath = importTypedefPath.slice(0, importTypedefPath.length - ".ts".length) + ".js"
    }
    const importmap = {}
    const codes =
        QueryHeader
        + `import { ${Object.keys(typedefNs).join(', ')} } from ${JSON.stringify(importTypedefPath)}\n`
        + queries.map(({ fields, inputs, name, query }) => {
            const inputsOrder = Object.values(inputs).sort((a, b) => a.index - b.index)
            const modFields = fields
                // $시작 행은 무시한다.
                .filter(v => !v.name.startsWith("$"))
                .map(v => {
                    if (!(v.dataTypeID in pgType)) {
                        throw new Error(`${rel} > name : ${name} ${v.name} => ${v.dataTypeID}, is not found`)
                    }
                    const typedef = getTypedef(pgType[v.dataTypeID].oid, { name: pgType[v.dataTypeID].name, namespace: pgType[v.dataTypeID].namespace })
                    switch (typedef.type) {
                        case 'expression':
                            return {
                                fieldname: snakeToCamel(v.name),
                                fieldtype: typedef.expr,
                                index: v.columnID,
                            }
                        case 'module':
                            return {
                                fieldname: snakeToCamel(v.name),
                                fieldtype: `${typedef.namespace}.${typedef.name}`,
                                index: v.columnID,
                            }
                        case 'internal':
                            return {
                                fieldname: snakeToCamel(v.name),
                                fieldtype: typedef.symbol,
                                index: v.columnID,
                            }
                        case 'external':
                            if (!(typedef.pkg in importmap)) {
                                importmap[typedef.pkg] = new Set()
                            }
                            importmap[typedef.pkg].add(typedef.symbol)
                            return {
                                fieldname: snakeToCamel(v.name),
                                fieldtype: typedef.symbol,
                                index: v.columnID,
                            }
                        default:
                            throw new Error(`${rel} > name : ${name} ${v.name} => ${v.dataTypeID}, typedef.typeunreachable type`)
                    }
                })
            return `export async function ${name}(conn : Pick<pg.ClientBase, 'query'>, input: ${name}.Input): Promise<${name}.Output[]> {
    const inputValues = [${inputsOrder.map(({ name }) => "input[" + JSON.stringify(name) + "]").join(', ')}]
    const queryResult = await conn.query({
        rowMode: 'array',
        name: ${JSON.stringify(name)},
        text: ${name}.SQL,
        values: inputValues,
    })
    return queryResult.rows.map((tuple)=>{
        return {
${modFields.map(({ fieldname, index }) => `            ${fieldname}: tuple[${index}]`).join(',\n')}
        }
    })
}
export namespace ${name}{
    export interface Input{ 
${inputsOrder.map(({ name, index }) => `        ${name}: any // index = ${index}`).join('\n')}
    }
    export interface Output{
${modFields.map(({ fieldname, fieldtype, index }) => `        ${fieldname}: ${fieldtype} // index = ${index}`).join('\n')}
    }
    export const SQL = ${JSON.stringify(query)}
}`
        }).join("\n")
    await fs.mkdir(path.dirname(dst), { recursive: true })
    await fs.writeFile(dst, codes)
}));
// ============================================================================
await pool.end()