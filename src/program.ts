import chokidar from "chokidar"
import fsp from "fs/promises"
import path from "path"
import pg from "pg"
import ts from "typescript"
import vm from "vm"
import { QueryError } from "./errors.js"
import { ExtensionDefine } from "./extension.js"
import { loadPgtableAllPgtypeOids, loadPgtypeAllOids, loadPgtypeByOid, PgType, PgTypeClass } from "./load-pgtype.js"
import { defaultDefines, PgToTsConfig } from "./pg-to-ts.js"
import { eachQuery } from "./source-eachquery.js"
import { createEntrypointSource } from "./source-entrypoint.js"
import { QueryHeader } from "./source-query.js"
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
export interface WatchArg {
    event: "add" | "unlink" | "change"
    filepath: string
}
export class Program {
    readonly option: Readonly<Required<ProgramOption>>
    readonly pool: pg.Pool
    readonly watcher: chokidar.FSWatcher
    readonly tsconfig: any
    readonly printer: ts.Printer
    #abort: AbortController
    #abortBuffer: WatchArg[]
    #program: ts.Program
    #dbTypes?: Promise<RunPgTypeOutput>
    #dbTables?: Promise<RunPgTableOutput>
    constructor(option: ProgramOption) {
        this.option = {
            cwd: (option.cwd ?? process.cwd()).split(path.win32.sep).join(path.posix.sep),
            input: option.input ?? ["./**/*.qg.ts", "./**/*.qg.js"],
            output: option.output ?? ".",
            base: option.base ?? ".",
            entrypoint: option.entrypoint ?? "./sqlfn.ep.ts",
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
        this.#abort = new AbortController()
        this.#abortBuffer = []

    }
    async runSource(filenames?: string[]): Promise<RunSourceOutput> {
        let sources: ts.SourceFile[] = [...this.#program.getSourceFiles().filter(v => v.fileName.endsWith(".qg.ts") || v.fileName.endsWith(".qg.js"))]

        if (filenames !== undefined) {
            sources = sources.filter(v => filenames.includes(v.fileName))
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
            vm.runInContext(jssrc, sandbox, { filename: 'sqlfn.mjs' })
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
                    } catch (err) {
                        if (err instanceof pg.DatabaseError) {
                            throw new QueryError(err, path.posix.relative(this.option.cwd, k), query.name, query.text, query.inputs.map(v => v.value))
                        }
                        throw err
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
                                    }).flat()
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
                const { options, fileNames, errors } = ts.parseJsonConfigFileContent(this.tsconfig, ts.sys, this.option.cwd)
                if (errors.length > 0) {
                    throw errors
                }
                this.#program = ts.createProgram(fileNames, options)
                this.#abortBuffer.push({ event: "add", filepath: path.posix.join(this.option.cwd, filepath).split(path.sep).join(path.posix.sep) })
                this.step(this.#abortBuffer)
            })
            this.watcher.on("change", (filepath) => {
                const { options, fileNames, errors } = ts.parseJsonConfigFileContent(this.tsconfig, ts.sys, this.option.cwd)
                if (errors.length > 0) {
                    throw errors
                }
                this.#program = ts.createProgram(fileNames, options)
                this.#abortBuffer.push({ event: "change", filepath: path.posix.join(this.option.cwd, filepath).split(path.sep).join(path.posix.sep) })
                this.step(this.#abortBuffer)
            })
            this.watcher.on("unlink", (filepath) => {
                const { options, fileNames, errors } = ts.parseJsonConfigFileContent(this.tsconfig, ts.sys, this.option.cwd)
                if (errors.length > 0) {
                    throw errors
                }
                this.#program = ts.createProgram(fileNames, options)
                this.#abortBuffer.push({ event: "unlink", filepath: path.posix.join(this.option.cwd, filepath).split(path.sep).join(path.posix.sep) })
                this.step(this.#abortBuffer)
            })
        })
        return
    }
    async step(events?: WatchArg[]) {
        this.#abort.abort()
        console.clear()
        // 
        const ac = new AbortController()
        const signal = new Promise<void>(resolve => ac.signal.addEventListener("abort", () => resolve()))
        this.#abort = ac
        // 
        let groupedEvents: undefined | { 'add': string[], 'unlink': string[], 'change': string[] } = undefined
        if (events !== undefined) {
            groupedEvents = { add: [], unlink: [], change: [] }
            for (const e of events) {
                groupedEvents[e.event].push(e.filepath)
            }
        }
        const addWatch = events?.filter((v) => v.event === 'add')?.map(v => v.filepath)
        const modWatch = events?.filter((v) => v.event === 'change')?.map(v => v.filepath)
        const delWatch = events?.filter((v) => v.event === 'unlink')?.map(v => v.filepath)
        // 
        await Promise.race([
            signal,
            (async () => {
                // ====================================================================
                if (this.#dbTypes === undefined) { this.#dbTypes = this.runPgType() }
                if (this.#dbTables === undefined) { this.#dbTables = this.runPgTable() }
                // ====================================================================
                let runTargets: undefined | string[] = undefined
                if (!(modWatch === undefined && addWatch === undefined)) {
                    runTargets = []
                    if (addWatch !== undefined) {
                        runTargets.push(...addWatch)
                    }
                    if (modWatch !== undefined) {
                        runTargets.push(...modWatch)
                    }
                }
                const [dbTypes, dbTables, sources] = await Promise.all([
                    this.#dbTypes,
                    this.#dbTables,
                    this.runSource(groupedEvents !== undefined ? [...groupedEvents.add, ...groupedEvents.change] : undefined),
                ])
                // 중간취소
                if (ac.signal.aborted) {
                    return
                }
                console.log("[#] sync database, run sources")
                // ====================================================================
                const [ep, build] = await Promise.all([
                    this.runEntrypoint(dbTypes).then(v => { console.log("[#] build entrypoint"); return v; }),
                    this.runQuery(dbTypes, dbTables, sources).then((queries) => {
                        return this.runBuild(queries).then(v => { console.log("[#] build sources"); return v; })
                    }).catch((err) => {
                        if(err instanceof QueryError){
                            console.log("[#] run query failed detail information follow");
                            console.log(err.message)
                            ac.abort()
                            return {}
                        }
                        console.log("[#] unexpected error");
                        console.error(err)
                        throw err
                    })
                ])
                // 중간취소
                if (ac.signal.aborted) {
                    return
                }

                // ====================================================================
                this.#abortBuffer = []
                const filepaths = await Promise.all(Object.entries(Object.assign({}, build, ep)).map(async ([filepath, filetext]) => {
                    await fsp.mkdir(path.posix.dirname(filepath), { recursive: true })
                    await fsp.writeFile(filepath, filetext)
                    return filepath
                }))
                // ====================================================================
                console.log(`# extension = ${this.option.config.extension?.join(", ")}`)
                console.log(`# files`)
                if (groupedEvents === undefined) {
                    for (const eachfile of filepaths.slice(0, 10)) {
                        console.log(`  + ${eachfile}`)
                    }
                    if (filepaths.length > 10) {
                        console.log(`  <... and more ${filepaths.length - 10}>`)
                    }
                } else {
                    const printer = [
                        ...groupedEvents.add.map(v => ['add', v] as const),
                        ...groupedEvents.change.map(v => ['change', v] as const),
                        ...groupedEvents.unlink.map(v => ['unlink', v] as const),
                    ].sort(([_0, fp0], [_1, fp1]) => {
                        return fp0.localeCompare(fp1)
                    })
                    for (const [ev, fp] of printer.slice(0, 10)) {
                        switch (ev) {
                            case "add":
                                console.log(`  + ${path.posix.relative(this.option.cwd, fp)}`)
                                break
                            case "change":
                                console.log(`  ~ ${path.posix.relative(this.option.cwd, fp)}`)
                                break
                            case "unlink":
                                console.log(`  - ${path.posix.relative(this.option.cwd, fp)}`)
                                break
                        }
                        if (filepaths.length > 10) {
                            console.log(`  <... and more ${printer.length - 10}>`)
                        }
                    }
                }
            })(),
        ])
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

