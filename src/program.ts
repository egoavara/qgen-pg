import path from "path"
import pg from "pg"
import ts from "typescript"
import vm from "vm"
import { loadPgtableAllPgtypeOids, loadPgtypeAllOids, loadPgtypeByOid, PgType, PgTypeClass } from "./load-pgtype.js"
import { eachQuery } from "./source-eachquery.js"
import { QueryHeader } from "./source.js"
import { StorageQuery } from "./storage-query.js"
import { StorageType } from "./storage-type.js"
import { snakeToCamel } from "./utils.js"
export interface ProgramOption {
    cwd?: string
    input?: string[]
    output?: string
    entrypoint?: string
    base?: string
    tsconfig?: string
    pgHost?: string
    pgPort?: number
    pgUsername?: string
    pgPassword?: string | null
    pgDatabase?: string
}

export type RunPgTypeOutput = Record<number, PgType>
export type RunPgTableOutput = Record<number, PgTypeClass>

export type RunSourceOutput = Record<string, {
    query: StorageQuery[],
}>
export type RunQueryOutput = Record<string, { query: RunEachQueryOutput[] }>
export interface RunEachQueryField {
    pgFieldDef: pg.FieldDef
    type: PgType
    name: string
    notNull: boolean | undefined
    index: number
}
export interface RunEachQueryOutput extends StorageQuery {
    name: string
    fields: RunEachQueryField[]
}
export interface RunEachTypeOutput extends StorageType {
    name: string
}
export class Program {
    option: Required<ProgramOption>
    program: ts.Program
    pool: pg.Pool
    constructor(option: ProgramOption) {
        this.option = {
            cwd: (option.cwd ?? process.cwd()).split(path.win32.sep).join(path.posix.sep),
            input: option.input ?? ["./**/*.qg.ts", "./**/*.qg.js"],
            output: option.output ?? "./query",
            base: option.base ?? ".",
            entrypoint: option.entrypoint ?? "./qgen.ep.ts",
            tsconfig: option.tsconfig ?? "./tsconfig.json",
            pgHost: option.pgHost ?? "localhost",
            pgPort: option.pgPort ?? 5432,
            pgUsername: option.pgUsername ?? "postgres",
            pgPassword: option.pgPassword ?? null,
            pgDatabase: option.pgDatabase ?? "postgres",
        }

        const configPath = ts.findConfigFile(this.option.cwd, ts.sys.fileExists, this.option.tsconfig)
        if (!configPath) throw Error(`'${this.option.tsconfig}' not found on ${this.option.cwd}`)

        const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile)
        if (error !== undefined) {
            throw error
        }

        config.include = ['./**/*.qg.ts', './**/*.qg.js', this.option.entrypoint]
        config.compilerOptions = {
            ...(config.compilerOptions ?? {}),
            allowJs: true,
            declaration: false,
            sourceMap: false,
            module: "commonjs",
        }

        const { options, fileNames, errors } = ts.parseJsonConfigFileContent(config, ts.sys, this.option.cwd)
        if (errors.length > 0) {
            throw errors
        }
        this.program = ts.createProgram(fileNames, options)
        this.pool = new pg.Pool({
            host: this.option.pgHost,
            port: this.option.pgPort,
            user: this.option.pgUsername,
            password: this.option.pgPassword ?? undefined,
            database: this.option.pgDatabase,
        })
    }
    sources(): string[] {
        return this.program.getSourceFiles().map(v => v.fileName).filter(v => v.endsWith(".qg.ts") || v.endsWith(".qg.js"));
    }
    entrypoint(): string {
        return this.program.getSourceFiles().map(v => v.fileName).filter(v => v.endsWith(".ep.ts"))[0];
    }
    async runSource(types: RunPgTypeOutput, sources?: string[]): Promise<RunSourceOutput> {
        const qgenNameToOid: Record<string, Record<string, number>> = {}
        for (const pgtyp of Object.values(types)) {
            if (!(pgtyp.namespace in qgenNameToOid)) qgenNameToOid[pgtyp.namespace] = {}
            qgenNameToOid[pgtyp.namespace][pgtyp.name] = pgtyp.oid
        }
        //
        const availables = this.sources()
        if (sources !== undefined) {
            const temp = sources.find(v => !availables.includes(v))
            if (temp !== undefined) {
                throw new Error(`unknown source '${temp}'`)
            }
        }
        const targets = sources ?? availables
        const srcmap = Object.fromEntries(this.program.getSourceFiles().map(v => {
            return [v.fileName, v]
        }))
        //
        const tssources = targets.map(v => srcmap[v])
        const output: RunSourceOutput = {}
        for (const tssrc of tssources) {
            const jssrc = await new Promise<string>((resolve, reject) => {
                const result = this.program.emit(
                    tssrc,
                    (filename, jssrc) => {
                        if (filename.endsWith(".js")) {
                            // console.log('=========')
                            // console.log(filename)
                            // console.log(jssrc)
                            resolve(jssrc)
                        }
                    },
                    undefined,
                    undefined,
                    {
                    }
                )
                if (result.diagnostics.length > 0) {
                    reject(result.diagnostics)
                }
            })
            const sandbox = vm.createContext({
                exports: {},
                require,
            })
            StorageQuery.clear()
            vm.runInContext(jssrc, sandbox, { filename: 'qgen.mjs' })
            output[tssrc.fileName] = {
                query: StorageQuery.copy(),
            }
        }
        return output
    }
    async runPgType(): Promise<RunPgTypeOutput> {
        const oids = await loadPgtypeAllOids(this.pool)
        return Object.fromEntries(await Promise.all(oids.map(async (oid) => {
            const typ = await loadPgtypeByOid(this.pool, oid)
            if (typ === undefined) {
                throw Error(`unknown oid : ${oid}`)
            }
            return [typ.oid, typ]
        })))
    }
    async runPgTable(): Promise<RunPgTableOutput> {
        const oids = await loadPgtableAllPgtypeOids(this.pool)
        return Object.fromEntries(await Promise.all(oids.map(async ({ pgTableOid, pgTypeOid }) => {
            const typ = await loadPgtypeByOid(this.pool, pgTypeOid)
            if (typ === undefined) {
                throw Error(`unknown oid : ${pgTypeOid}`)
            }
            return [pgTableOid, typ]
        })))
    }
    async runQuery(pgType: RunPgTypeOutput, pgTable: RunPgTableOutput, sourceResult: RunSourceOutput): Promise<RunQueryOutput> {
        const temp = await Promise.all(Object.entries(sourceResult).map(async ([k, v]): Promise<[string, { query: RunEachQueryOutput[] }]> => {

            return [k, {
                query: await Promise.all(v.query.map(async (query): Promise<RunEachQueryOutput> => {
                    const conn = await this.pool.connect()
                    try {
                        const check = (await conn.query({
                            rowMode: 'array',
                            name: query.name,
                            text: query.text,
                            values: query.inputs.map(v => v.value),
                        }))
                        return {
                            ...query,
                            fields: check.fields.map((v, i) => {
                                let notNull = undefined
                                if (v.tableID !== 0 && v.columnID !== 0) {
                                    const table = pgTable[v.tableID]
                                    const columnName = table.orders[v.columnID - 1]
                                    notNull = table.fields[columnName].notNull
                                }
                                return {
                                    pgFieldDef: v,
                                    type: pgType[v.dataTypeID],
                                    name: snakeToCamel(v.name),
                                    notNull,
                                    index: i
                                }
                            })
                        }
                    } finally {
                        conn.release()
                    }
                }))
            }]
        }))
        return Object.fromEntries(temp)
    }
    async runBuild(queryResult: RunQueryOutput, sourceResult: RunSourceOutput): Promise<Record<string, string>> {
        const printer = ts.createPrinter()
        const abscwd = path.posix.normalize(path.posix.join(this.option.cwd, this.option.base))
        const ep = path.posix.relative(path.posix.normalize(this.option.cwd), this.entrypoint()).replace(".ep.ts", ".ep.js")
        // 
        const sources = Object.fromEntries(await Promise.all(Object.entries(queryResult).map<Promise<[string, string]>>(async ([filename, output]) => {
            let outputFileName = path.posix.join(this.option.output, path.posix.relative(abscwd, path.posix.normalize(filename)),).replace(".qg.ts", ".qgout.ts")
            const originSrc = this.program.getSourceFile(filename)
            if (originSrc === undefined) {
                throw Error(`${filename} not exist`)
            }
            const tempep = path.posix.relative(path.posix.dirname(outputFileName), ep)
            const relep = tempep.startsWith(".") ? tempep : "./" + tempep
            // output
            const tsrc = ts.transform(
                ts.createSourceFile(outputFileName, QueryHeader(relep), ts.ScriptTarget.ESNext),
                [
                    (ctx) => {
                        return (node) => {

                            return ctx.factory.updateSourceFile(
                                node,
                                [
                                    ...node.statements,
                                    ...output.query.map((val) => {
                                        return eachQuery(ctx, val, relep)
                                    })
                                ]
                            )
                        }
                    }
                ]
            ).transformed[0]

            return [
                outputFileName,
                printer.printFile(tsrc),
            ]
        })))
        // 
        return sources
    }
    exit() {
        this.pool.end().then(() => {
            process.exit()
        })
    }
}