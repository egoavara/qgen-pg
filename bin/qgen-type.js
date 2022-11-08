#!/usr/bin/env node
import { program } from 'commander'
import fs from 'fs/promises'
import path from 'path'
import pg from 'pg'
import { loadPgtypeAllOids, loadPgtypeByOid, ClassParser, ArrayParser, HeaderStart, HeaderEnd, DefaultUserBlockHint, LineSep } from '../lib/index.js'
// ============================================================================
// 패러미터 등록 및 초기 작업
const qgen = program
    .option('-o, --output <filepath>', 'output file path, default : ./query/_parser.qg.ts', './query/_parser.qg.ts')
    .option('--filter-namespace <...namespaces>', 'output file path, default : [pg_catalog information_schema]', ['pg_catalog', 'information_schema'])
    .option('--filter-relkind <...namespaces>', 'postgres pg_class relkind filter, see https://www.postgresql.org/docs/current/catalog-pg-class.html, default : [c]', ['c'])
    .option('--pg-host <host>', 'postgres database host, default : localhost', 'localhost')
    .option('--pg-port <port>', 'postgres database port, default : 5432', '5432')
    .option('--pg-username <username>', 'postgres database username, default : postgres', 'postgres')
    .option('--pg-password <password>', 'postgres database password, default : ', '')
    .option('--pg-database <database>', 'postgres database password, default : postgres', 'postgres')
    .parse()
const opts = qgen.opts()
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
const oids = await loadPgtypeAllOids(pool)
const totalOids = oids.length
console.log(`대상 oid 개수 총 ${totalOids}개`)
let pgTypes = await Promise.all(oids.map(async (oid) => {
    const typ = await loadPgtypeByOid(pool, oid)
    return typ
}))
// ============================================================================
console.log(`제외할 네임스페이스 : `, opts.filterNamespace)
// 제외할 네임스페이스를 제외한 타입 파서를 설정
pgTypes = pgTypes.filter(v => !opts.filterNamespace.includes(v.namespace))
console.log(`제외 후 타입 개수 ${pgTypes.length}개`)
// ============================================================================
console.log(`제외할 relKind : ${opts.filterRelkind} 를 제외한 전체`)
pgTypes = pgTypes.filter(v => {
    if (v.type === 'class') {
        return opts.filterRelkind.includes(v.relkind)
    }
    if (v.type === 'array' && v.name.startsWith('_') && v.elem.type === 'class') {
        return opts.filterRelkind.includes(v.elem.relkind)
    }
    return true

})
console.log(`제외 후 타입 개수 ${pgTypes.length}개`)
// ============================================================================
// 대상 디렉터리 생성
await fs.mkdir(path.dirname(opts.output), { recursive: true })
// ============================================================================
// 만약 이미 존재하는 파일이 있는지 확인
let preUserInput = undefined
try {
    const preExistFile = (await fs.readFile(opts.output)).toString('utf-8');
    const data = preExistFile.split('\n' + LineSep + '\n')
    if (data.length === 3) {
        preUserInput = data[1]
    }
} catch { }

// ============================================================================
const typedefs = pgTypes.map(typ => {
    switch (typ.type) {
        case "primitive":
            return `
// oid : ${typ.oid}, type : ${typ.type}, namespace : ${typ.namespace}, name : ${typ.name}
if (builtinOids.findIndex(v=>v === ${typ.oid}) === -1) { 
    pg.types.setTypeParser(${typ.oid}, 'text', (value)=>{}); // TODO
}`
        case "alias":
            return `
// oid : ${typ.oid}, type : ${typ.type}, namespace : ${typ.namespace}, name : ${typ.name}
if (builtinOids.findIndex(v=>v === ${typ.oid}) === -1) { 
    const basetype = pg.types.getTypeParser(${typ.basetype.oid}, 'text');
    pg.types.setTypeParser(${typ.oid}, 'text', basetype); 
}`
        case "array":
            return `
// oid : ${typ.oid}, type : ${typ.type}, namespace : ${typ.namespace}, name : ${typ.name}
if (builtinOids.findIndex(v=>v === ${typ.oid}) === -1) { 
    const elem = pg.types.getTypeParser(${typ.elem.oid}, 'text');
    pg.types.setTypeParser(${typ.oid}, 'text', (value)=>new ArrayParser(value, elem).parse()); 
}`

        case "class":
            return `
// oid : ${typ.oid}, type : ${typ.type}, namespace : ${typ.namespace}, name : ${typ.name}
if (builtinOids.findIndex(v=>v === ${typ.oid}) === -1) { 
    const fields:[string, number][] = ${JSON.stringify(typ.orders.map(v => [v, typ.fields[v].oid]))}
    const transform = fields.map(([key, oid]): [string, (value:string, format?:any)=>any] => [key, pg.types.getTypeParser(oid, 'text')])
    pg.types.setTypeParser(${typ.oid}, 'text', (value)=>new ClassParser(value, transform).parse());
}`
    }
}).join("\n")
let targetFile = [
    HeaderStart,
    LineSep,
    preUserInput ?? DefaultUserBlockHint,
    LineSep,
    HeaderEnd,
    ArrayParser,
    ClassParser,
    typedefs,
].join('\n')
console.log(`타입 파서 파일 생성 완료`)

// ============================================================================
// 대상 파일 생성
await fs.writeFile(opts.output, targetFile)
// ============================================================================
// 데이터베이스 정리
await pool.end()