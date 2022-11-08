import ts from "typescript"
import { Query } from "./storage-query"
export interface ProgramOption {
    cwd?: string
    input?: string[]
    output?: string
    base?: string
    tsconfig?: string
    pgHost?: string
    pgPort?: number
    pgUsername?: string
    pgPassword?: string | null
    pgDatabase?: string
}
export class Program {
    option: Required<ProgramOption>
    program: ts.Program
    constructor(option: ProgramOption) {
        this.option = {
            cwd: option.cwd ?? process.cwd(),
            input: option.input ?? ["./**/*.qg.ts", "./**/*.qg.js"],
            output: option.output ?? "",
            base: option.base ?? ".",
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

        }

        const { options, fileNames, errors } = ts.parseJsonConfigFileContent(config, ts.sys, this.option.cwd)
        if (errors.length > 0) {
            throw errors
        }
        this.program = ts.createProgram(fileNames, options)
    }
    sources(): string[] {
        return this.program.getSourceFiles().map(v => v.fileName)
    }
    async run(sources?: string[]): Promise<Query[]> {
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
        
    }
}