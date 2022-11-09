import path from "path"
import pg from "pg"
import ts from "typescript"
import vm from "vm"
import { loadPgtableAllPgtypeOids, loadPgtypeAllOids, loadPgtypeByOid, PgType, PgTypeClass } from "./load-pgtype.js"
import { pgToTs } from "./pg-to-ts.js"
import { QueryHeader } from "./source.js"
import { StorageQuery } from "./storage-query.js"
import { CopiedStorageType, StorageType } from "./storage-type.js"
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

export interface RunSourceOutput {
    queries: { source: string, query: StorageQuery }[]
    types: CopiedStorageType
}

export type RunQueryOutput = Record<string, Record<string, RunEachQueryOutput>>
export interface RunEachQueryOutput extends StorageQuery {
    fields: { pgFieldDef: pg.FieldDef, type: PgType, name: string, notNull: boolean | undefined }[]
}
export class Program {
    option: Required<ProgramOption>
    program: ts.Program
    pool: pg.Pool
    constructor(option: ProgramOption) {
        this.option = {
            cwd: (option.cwd ?? process.cwd()).split(path.win32.sep).join(path.posix.sep),
            input: option.input ?? ["./**/*.qg.ts", "./**/*.qg.js"],
            output: option.output ?? "./qgen",
            base: option.base ?? ".",
            entrypoint: "./qgen.ts",
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

        config.include = ['./**/*.qg.ts', './**/*.qg.js']
        config.compilerOptions = {
            ...(config.compilerOptions ?? {}),
            allowJs: true,
            declaration: false,
            sourceMap: false,
            module: "commonjs"

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
    async runSource(sources?: string[]): Promise<RunSourceOutput> {
        const queries: { source: string, query: StorageQuery }[] = []
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
        for (const tssrc of tssources) {
            const jssrc = await new Promise<string>((resolve, reject) => {
                const result = this.program.emit(tssrc, (filename, jssrc) => {
                    if (filename.endsWith(".js")) {
                        resolve(jssrc)
                    }
                })
                if (result.diagnostics.length > 0) {
                    reject(result.diagnostics)
                }
            })
            const sandbox = vm.createContext({
                exports: {},
                require,
            })
            vm.runInContext(jssrc, sandbox, { filename: 'qgen.mjs' })
            queries.push(...StorageQuery.copy().map((v) => {
                return { source: tssrc.fileName, query: v }
            }))
        }
        return {
            queries,
            types: StorageType.copy()
        }
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
        const output: RunQueryOutput = Object.fromEntries(sourceResult.queries.map(({ source }) => [source, {}]))
        await Promise.all(sourceResult.queries.map(async ({ query, source }) => {
            const conn = await this.pool.connect()
            try {
                const check = (await conn.query({
                    rowMode: 'array',
                    name: query.name,
                    text: query.text,
                    values: query.inputs.map(v => v.value),
                }))
                output[source][query.name] = {
                    ...query,
                    fields: check.fields.map(v => {
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
                        }
                    }),

                }
            } finally {
                conn.release()
            }
        }))
        return output
    }
    async runBuild(queryResult: RunQueryOutput, sourceResult: RunSourceOutput): Promise<Record<string, string>> {
        const printer = ts.createPrinter()
        const abscwd = path.posix.normalize(path.posix.join(this.option.cwd, this.option.base))

        // const epsource = ts.createSourceFile(path.join(this.option.output, this.option.entrypoint), "", ts.ScriptTarget.ESNext)
        // 
        const sources = Object.fromEntries(await Promise.all(Object.entries(queryResult).map<Promise<[string, string]>>(async ([filename, output]) => {
            let outputPath = path.posix.join(this.option.output, path.posix.relative(abscwd, path.posix.normalize(filename)),)
            const originSrc = this.program.getSourceFile(filename)
            if (originSrc === undefined) {
                throw Error(`${filename} not exist`)
            }
            // 
            const transFuncs = Object.entries(output).map(([name, val]) => {
                const trans: ts.TransformerFactory<ts.SourceFile> = (ctx) => {
                    const { factory } = ctx
                    // Pick<pg.Client, "query"> 작성
                    const connCompatible = factory.createTypeReferenceNode("Pick", [
                        factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier("pg"), factory.createIdentifier("Client"))),
                        factory.createLiteralTypeNode(factory.createStringLiteral('query'))
                    ])
                    return (node) => {
                        console.log(val.fields.map(({ name, notNull, type }) => { return type.oid }))
                        const temp = factory.createFunctionDeclaration(
                            [], // no decorator,
                            [factory.createModifier(ts.SyntaxKind.ExportKeyword)], // export
                            undefined, // no asterisk(aka. generator syntax)
                            name,
                            [],
                            [
                                // conn : Pick<pg.Client, "query">
                                factory.createParameterDeclaration([], [], undefined, 'conn', undefined, connCompatible, undefined),
                                // input : {...}
                                factory.createParameterDeclaration([], [], undefined, 'input', undefined,
                                    factory.createTypeLiteralNode(
                                        val.inputs.map(({ key, type }) => {
                                            return factory.createPropertySignature(undefined, key, factory.createToken(ts.SyntaxKind.QuestionToken), type(ctx)(factory.createToken(ts.SyntaxKind.AnyKeyword)))
                                        })
                                    ),
                                    undefined),
                            ],
                            factory.createTypeReferenceNode("Promise", [
                                factory.createTypeLiteralNode(
                                    val.fields.map(({ name, notNull, type }) => {
                                        return factory.createPropertySignature(undefined, factory.createStringLiteral(name), undefined, pgToTs(type, notNull, { pgNullToTs: 'null', mapping: sourceResult.types })(ctx))
                                    })
                                ),
                            ]),
                            undefined
                        )
                        return factory.updateSourceFile(node, [
                            ...node.statements,
                            temp,
                        ])
                    }
                }
                return trans
            })
            // output
            const tsrc = ts.transform(ts.createSourceFile(path.join(this.option.output, this.option.entrypoint), QueryHeader, ts.ScriptTarget.ESNext), transFuncs).transformed[0]

            return [
                outputPath,
                printer.printFile(tsrc),
            ]
        })))
        return sources
    }
    exit() {
        this.pool.end().then(() => {
            process.exit()
        })
    }
}