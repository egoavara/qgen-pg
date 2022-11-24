import { ExprType, ExprTypeFunction } from "./lang-expr-type.js"
import { ExprValue } from "./lang-expr-value.js"

export interface LangFile {
    kindof: "file"
    stmts: DefineStatement[]
}
export function LangFile(...stmtOrFiles: (LangFile | DefineStatement)[]): LangFile {
    return {
        kindof: "file", stmts: stmtOrFiles.map(v => {
            if (v.kindof === "file") {
                return v.stmts
            }
            return v
        }).flat()
    }
}

export type Statement = DefineStatement | RunnableStatement
export type DefineStatement = StatementVariable | StatementType | StatementFunction | StatementImport | StatementModule | StatementInterface
export type RunnableStatement = StatementVariable | StatementType | StatementFunction | StatementReturn | StatementExpression | StatementIf | StatementThrow

export interface _StatementKind {
    kindof: "statement"
}
export interface _StatementModifier {
    export: boolean
}
export interface StatementImport extends _StatementKind {
    stmtof: 'import'
    name?: string
    fields: (string | [string, string])[]
    from: string
}
export function StatementImport(from: string): StatementImport;
export function StatementImport(name: string, from: string): StatementImport;
export function StatementImport(fields: (string | [string, string])[], from: string): StatementImport;
export function StatementImport(name: string, fields: (string | [string, string])[], from: string): StatementImport;
export function StatementImport(...args: any[]): StatementImport {
    if (args.length === 3) {
        return { kindof: "statement", stmtof: "import", name: args[0], fields: args[1], from: args[2] }
    }
    if (args.length === 2 && Array.isArray(args[0])) {
        return { kindof: "statement", stmtof: "import", fields: args[0], from: args[1] }
    }
    if (args.length === 2 && typeof args[0] === 'string') {
        return { kindof: "statement", stmtof: "import", name: args[0], fields: [], from: args[1] }
    }
    return { kindof: "statement", stmtof: "import", fields: [], from: args[0] }
}

export interface StatementVariable extends _StatementKind, _StatementModifier {
    stmtof: 'var' | 'let' | 'const'
    name: string
    type?: ExprType
    value: ExprValue
}
export function StatementVariable(exp: ("export")[], stmtof: 'var' | 'let' | 'const', name: string, typ: ExprType | undefined, value: ExprValue): StatementVariable
export function StatementVariable(stmtof: 'var' | 'let' | 'const', name: string, typ: ExprType | undefined, value: ExprValue): StatementVariable
export function StatementVariable(...args: any[]): StatementVariable {
    if (args.length === 5) {
        return { kindof: "statement", export: true, stmtof: args[1], name: args[2], type: args[3], value: args[4] }
    }
    if (args.length === 4) {
        return { kindof: "statement", export: false, stmtof: args[0], name: args[1], type: args[2], value: args[3] }
    }
    throw Error("unknown")
}

export interface StatementType extends _StatementKind, _StatementModifier {
    stmtof: 'type'
    name: string
    type: ExprType
}

export function StatementType(exp: ("export")[], name: string, value: ExprType): StatementType
export function StatementType(name: string, value: ExprType): StatementType
export function StatementType(...args: any[]): StatementType {
    if (args.length === 3) {
        return { kindof: "statement", export: true, stmtof: 'type', name: args[1], type: args[2] }
    }
    if (args.length === 2) {
        return { kindof: "statement", export: false, stmtof: 'type', name: args[0], type: args[1] }
    }
    throw Error("unknown")
}


export interface StatementInterface extends _StatementKind, _StatementModifier {
    stmtof: 'interface'
    name: string
    fields: [string, ExprType][]
}

export function StatementInterface(exp: ("export")[], name: string, fields: [string, ExprType][]): StatementInterface
export function StatementInterface(name: string, fields: [string, ExprType][]): StatementInterface
export function StatementInterface(...args: any[]): StatementInterface {
    if (args.length === 3) {
        return { kindof: "statement", export: true, stmtof: 'interface', name: args[1], fields: args[2] }
    }
    if (args.length === 2) {
        return { kindof: "statement", export: false, stmtof: 'interface', name: args[0], fields: args[1] }
    }
    throw Error("unknown")
}


export interface StatementFunction extends _StatementKind, _StatementModifier {
    stmtof: 'function'
    async: boolean
    name: string
    type: ExprTypeFunction
    block: Block<RunnableStatement>
}


export function StatementFunction(exp: ("export" | "async")[], name: string, type: ExprTypeFunction, block: Block<RunnableStatement>): StatementFunction
export function StatementFunction(name: string, type: ExprTypeFunction, block: Block<RunnableStatement>): StatementFunction
export function StatementFunction(...args: any[]): StatementFunction {
    if (args.length === 4) {
        return { kindof: "statement", export: args[0].includes("export"), async: args[0].includes("async"), stmtof: 'function', name: args[1], type: args[2], block: args[3] }
    }
    if (args.length === 4) {
        return { kindof: "statement", export: args[0].includes("export"), async: args[0].includes("async"), stmtof: 'function', name: args[1], type: args[2], block: args[3] }
    }
    if (args.length === 3) {
        return { kindof: "statement", export: false, async: false, stmtof: 'function', name: args[0], type: args[1], block: args[2] }
    }
    throw Error("unknown")
}


export interface StatementModule extends _StatementKind, _StatementModifier {
    stmtof: 'module'
    name: string
    block: Block<DefineStatement>
}


export function StatementModule(exp: ("export")[], name: string, block: Block<DefineStatement>): StatementModule
export function StatementModule(name: string, block: Block<DefineStatement>): StatementModule
export function StatementModule(...args: any[]): StatementModule {
    if (args.length === 3) {
        return { kindof: "statement", export: true, stmtof: "module", name: args[1], block: args[2] }
    }
    if (args.length === 2) {
        return { kindof: "statement", export: false, stmtof: "module", name: args[0], block: args[1] }
    }
    throw Error("unknown")
}


export interface StatementReturn extends _StatementKind {
    stmtof: 'return'
    expr?: ExprValue
}
export function StatementReturn(expr?: ExprValue): StatementReturn {
    return { kindof: "statement", stmtof: "return", expr }
}

export interface StatementThrow extends _StatementKind {
    stmtof: 'throw'
    expr: ExprValue
}
export function StatementThrow(expr: ExprValue): StatementThrow {
    return { kindof: "statement", stmtof: "throw", expr }
}


export interface StatementExpression extends _StatementKind {
    stmtof: 'expression'
    expr: ExprValue
}
export function StatementExpression(expr: ExprValue): StatementExpression {
    return { kindof: "statement", stmtof: "expression", expr }
}

export interface StatementIf extends _StatementKind {
    stmtof: 'if'
    condition: ExprValue
    block: Block<RunnableStatement>
}
export function StatementIf(condition: ExprValue, block: Block<RunnableStatement>): StatementIf {
    return { kindof: "statement", stmtof: "if", condition, block }
}


export interface Block<S extends Statement> {
    kindof: "block",
    statements: S[]
}
export function Block(...statements: Statement[]): Block<Statement>;
export function Block(mode: "run", ...statements: RunnableStatement[]): Block<RunnableStatement>;
export function Block(mode: "define", ...statements: DefineStatement[]): Block<DefineStatement>;
export function Block(...args: any[]): Block<any> {
    const statements: Statement[] = []
    if (args.length >= 1 && typeof args[0] === 'string') {
        statements.push(...args.slice(1))
    } else {
        statements.push(...args)
    }
    return { kindof: "block", statements }
}


