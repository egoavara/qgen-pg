import chokidar from "chokidar"
import fsp from "fs/promises"
import path from "path"
import pg from "pg"
import ts from "typescript"
import vm from "vm"
import { ExtensionDefine } from "./extension.js"
import { loadPgtableAllPgtypeOids, loadPgtypeAllOids, loadPgtypeByOid, PgType, PgTypeClass } from "./load-pgtype.js"
import { defaultDefines, PgToTsConfig } from "./pg-to-ts.js"
import { eachQuery } from "./source-eachquery.js"
import { createEntrypointSource } from "./source-entrypoint.js"
import { QueryHeader } from "./source.js"
import { StorageQuery } from "./storage-query.js"
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
    config?: Partial<Omit<PgToTsConfig, "mapping" | "define">>
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

export interface BeginOption {

}
export class Program {
    readonly option: Readonly<Required<ProgramOption>>
    readonly pool: pg.Pool
    readonly watcher: chokidar.FSWatcher
    readonly tsconfig: any
    readonly printer: ts.Printer
    #program: ts.Program
    #dbTypes?: Promise<RunPgTypeOutput>
    #dbTables?: Promise<RunPgTableOutput>
    constructor(option: ProgramOption) {
        this.option = {
            cwd: (option.cwd ?? process.cwd()).split(path.win32.sep).join(path.posix.sep),
            input: option.input ?? ["./**/*.qg.ts", "./**/*.qg.js"],
            output: option.output ?? ".",
            base: option.base ?? ".",
            entrypoint: option.entrypoint ?? "./qgen.ep.ts",
            tsconfig: option.tsconfig ?? "./tsconfig.json",
            pgHost: option.pgHost ?? "localhost",
            pgPort: option.pgPort ?? 5432,
            pgUsername: option.pgUsername ?? "postgres",
            pgPassword: option.pgPassword ?? null,
            pgDatabase: option.pgDatabase ?? "postgres",
            config: option.config ?? {}
        }
        this.watcher = chokidar.watch(this.option.input, {
            persistent: true,
            followSymlinks: true,
            // 
            cwd: this.option.cwd,
        })
        this.pool = new pg.Pool({
            host: this.option.pgHost,
            port: this.option.pgPort,
            user: this.option.pgUsername,
            password: this.option.pgPassword ?? undefined,
            database: this.option.pgDatabase,
        })
        this.printer = ts.createPrinter()
        //  
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
        this.tsconfig = config
        // // ====== source from config ======
        const { options, fileNames, errors } = ts.parseJsonConfigFileContent(this.tsconfig, ts.sys, this.option.cwd)
        if (errors.length > 0) {
            throw errors
        }
        this.#program = ts.createProgram(fileNames, options)

    }
    async runSource(filename?: string): Promise<RunSourceOutput> {
        let sources: ts.SourceFile[] = [...this.#program.getSourceFiles().filter(v => v.fileName.endsWith(".qg.ts") || v.fileName.endsWith(".qg.js"))]

        if (filename !== undefined) {
            const oneFile = this.#program.getSourceFile(filename)
            if (oneFile === undefined) {
                throw Error(`no file name ${filename}`)
            }
            sources = [oneFile]
        }
        const output: RunSourceOutput = {}
        for (const tssrc of sources) {
            const jssrc = await new Promise<string>((resolve, reject) => {
                const result = this.#program.emit(
                    tssrc,
                    (filename, jssrc) => {
                        if (filename.endsWith(".js")) {
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
    async runBuild(queryResult: RunQueryOutput): Promise<Record<string, string>> {
        const abscwd = path.posix.normalize(path.posix.join(this.option.cwd, this.option.base))
        const entrypoint = path.posix.join(path.posix.normalize(path.posix.join(this.option.cwd, this.option.output)), this.option.entrypoint)
        const entrypointjs = path.posix.relative(this.option.cwd, entrypoint.replace(".ep.ts", ".ep.js"))
        const sources = Object.fromEntries(await Promise.all(Object.entries(queryResult).map<Promise<[string, string]>>(async ([filename, output]) => {
            let outputFileName = path.posix.join(this.option.output, path.posix.relative(abscwd, path.posix.normalize(filename)),).replace(".qg.ts", ".qgout.ts")
            const originSrc = this.#program.getSourceFile(filename)
            if (originSrc === undefined) {
                throw Error(`${filename} not exist`)
            }
            const tempep = path.posix.relative(path.posix.dirname(outputFileName), entrypointjs)
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
                this.printer.printFile(tsrc),
            ]
        })))
        // 
        return sources
    }
    async runEntrypoint(typesOutput: RunPgTypeOutput): Promise<Record<string, string>> {
        const entrypoint = path.posix.join(path.posix.normalize(path.posix.join(this.option.cwd, this.option.output)), this.option.entrypoint)
        const option: PgToTsConfig = {
            tsNullType: this.option.config.tsNullType ?? "null",
            arrayElem: this.option.config.arrayElem ?? "null",
            extension: this.option.config.extension ?? [],
            mapping: typesOutput,
            define: Object.create(defaultDefines),
        }
        Object.assign(option.define, ...option.extension.map(ext => ExtensionDefine[ext]))
        return {
            [path.posix.relative(this.option.cwd, entrypoint)]: this.printer.printFile(createEntrypointSource(this.option.entrypoint, typesOutput, option))
        }
    }
    //
    begin(option?: BeginOption): void;
    begin(option: { once: true } & BeginOption): Promise<void>;
    begin(option?: { once?: boolean }): any {
        if (option?.once === true) {
            return this.step().then(() => {
                return this.exit()
            })
        }
        this.step().then(() => {
            this.watcher.on("add", (filepath) => {
                console.log(`\n# file signature : + ${filepath}`);
                const { options, fileNames, errors } = ts.parseJsonConfigFileContent(this.tsconfig, ts.sys, this.option.cwd)
                if (errors.length > 0) {
                    throw errors
                }
                this.#program = ts.createProgram(fileNames, options)
                this.step(path.posix.join(this.option.cwd, filepath).split(path.sep).join(path.posix.sep))
            })
            this.watcher.on("change", (filepath) => {
                console.log(`\n# file signature : ~ ${filepath}`);
                const { options, fileNames, errors } = ts.parseJsonConfigFileContent(this.tsconfig, ts.sys, this.option.cwd)
                if (errors.length > 0) {
                    throw errors
                }
                this.#program = ts.createProgram(fileNames, options)
                this.step(path.posix.join(this.option.cwd, filepath).split(path.sep).join(path.posix.sep))
            })
            this.watcher.on("unlink", (filepath) => {
                console.log(`\n# file signature : - ${filepath}`);
            })
        })
        return
    }
    async step(filename?: string) {
        console.log("# begin")
        if (this.#dbTypes === undefined) { this.#dbTypes = this.runPgType() }
        if (this.#dbTables === undefined) { this.#dbTables = this.runPgTable() }
        const [dbTypes, dbTables, sources] = await Promise.all([
            this.#dbTypes,
            this.#dbTables,
            this.runSource(filename),
        ])

        const [ep, build] = await Promise.all([
            this.runEntrypoint(dbTypes),
            this.runQuery(dbTypes, dbTables, sources).then((queries) => {
                return this.runBuild(queries)
            })
        ])
        const filepaths = await Promise.all(Object.entries(Object.assign({}, build, ep)).map(async ([filepath, filetext]) => {
            await fsp.mkdir(path.posix.dirname(filepath), { recursive: true })
            await fsp.writeFile(filepath, filetext)
            return filepath
        }))
        console.log(`# extension = ${this.option.config.extension}`)
        console.log(`# files`)
        for (const eachfile of filepaths.slice(0, 10)) {
            console.log(` ^ ${eachfile}`)
        }
        if (filepaths.length > 10) {
            console.log(` ^ ... and more ${filepaths.length - 10}`)
        }
    }
    exit(): Promise<void> {
        return new Promise<void>((resolve) => {
            Promise.all([
                this.watcher.close(),
                this.pool.end(),
            ]).then(() => {
                resolve()
            })
        })
    }
}

