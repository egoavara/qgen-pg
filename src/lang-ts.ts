import { ExprType } from "./lang-expr-type.js"
import { ExprValue } from "./lang-expr-value.js"
import { Block, LangFile, Statement } from "./lang-stmt.js"

export interface TypescriptFormat {
    depth?: number
    indent?: string
    ignoreDepth?: boolean
}
export type RequiredTypescriptFormat = Required<TypescriptFormat>

export function requiredTypescriptFormat(option?: TypescriptFormat): RequiredTypescriptFormat {
    return {
        depth: option?.depth ?? 0,
        indent: option?.indent ?? '    ',
        ignoreDepth: false,
    }
}
export function nextOption(option: RequiredTypescriptFormat, extra?: { depthIncrease?: false, ignoreDepth?: true }): RequiredTypescriptFormat {
    return {
        ...option,
        depth: extra?.depthIncrease === false ? option.depth : option.depth + 1,
        ignoreDepth: extra?.ignoreDepth ?? false,
    }
}


export function fromFileToTypescript(lfile: LangFile, option?: TypescriptFormat): string {
    return lfile.stmts.map(v => fromStmtToTypescript(v, requiredTypescriptFormat(option))).join("\n")
}

export function fromStmtToTypescript(stmt: Statement, option?: TypescriptFormat): string {
    const nnoption = requiredTypescriptFormat(option)
    const indent = nnoption.ignoreDepth ? '' : nnoption.indent.repeat(nnoption.depth)
    const temp: (string | string[])[] = []
    switch (stmt.stmtof) {
        case "if":
            temp.push(`if (${fromExprValueToTypescript(stmt.condition, nextOption(nnoption, { ignoreDepth: true }))}) ${fromBlockToTypescript(stmt.block, nextOption(nnoption, { depthIncrease: false })).trimStart()}`)
            break
        case "expression":
            temp.push(fromExprValueToTypescript(stmt.expr, nextOption(nnoption, { ignoreDepth: true })))
            break
        case "return":
            if (stmt.expr === undefined) { temp.push(`return`); break }
            temp.push(`return ${fromExprValueToTypescript(stmt.expr, nextOption(nnoption, { ignoreDepth: true }))}`)
            break
        case "throw":
            temp.push(`throw ${fromExprValueToTypescript(stmt.expr, nextOption(nnoption, { ignoreDepth: true }))}`)
            break
        case "module":
            if (stmt.export) {
                temp.push("export")
            }
            temp.push(
                "module",
                stmt.name,
                fromBlockToTypescript(stmt.block, nextOption(nnoption, { depthIncrease: false })))
            break
        case "import":
            temp.push("import")
            if (stmt.name === undefined && stmt.fields.length === 0) {
                temp.push(JSON.stringify(stmt.from))
                break
            }
            temp.push([
                ...(stmt.name !== undefined ? [stmt.name] : []),
                ...(stmt.fields.length > 0 ? [
                    `{ ${stmt.fields.map(v => {
                        if (Array.isArray(v)) {
                            return `${v[0]} as ${v[1]}`
                        } else {
                            return v
                        }
                    }).join(", ")} }`
                ] : []),
            ])
            temp.push("from", JSON.stringify(stmt.from))
            break
        case "var":
        case "let":
        case "const":
            if (stmt.export) {
                temp.push("export")
            }
            temp.push(stmt.stmtof, stmt.name)
            if (stmt.type !== undefined) {
                temp.push(":", fromExprTypeToTypescript(stmt.type, nextOption(nnoption, { depthIncrease: false, ignoreDepth: true })))
            }
            temp.push("=", fromExprValueToTypescript(stmt.value, nextOption(nnoption, { depthIncrease: false, ignoreDepth: true })))
            break
        case "function":
            if (stmt.export) {
                temp.push("export")
            }
            if (stmt.async) {
                temp.push("async")
            }
            temp.push(stmt.stmtof, stmt.name, "(")
            temp.push(stmt.type.params.map(v => `${v[0]}: ${fromExprTypeToTypescript(v[1], nextOption(nnoption, { ignoreDepth: true }))}`))
            temp.push("):")
            if (stmt.type.returns) {
                temp.push(fromExprTypeToTypescript(stmt.type.returns, nextOption(nnoption, { ignoreDepth: true })))
            }
            temp.push(fromBlockToTypescript(stmt.block, nnoption))
            break

        case "interface":
            if (stmt.export) {
                temp.push("export")
            }
            const nextIndent = indent + nnoption.indent
            temp.push(stmt.stmtof, stmt.name, `{\n${stmt.fields.map(([k, v]) => {
                return `${nextIndent}${k}: ${fromExprTypeToTypescript(v, nextOption(nnoption))}`
            }).join('\n')}\n${indent}}`)
            break
        case "type":
            if (stmt.export) {
                temp.push("export")
            }
            temp.push(stmt.stmtof, stmt.name, "=", fromExprTypeToTypescript(stmt.type))
            break
        case "export-default":
            temp.push("export", "default", fromExprValueToTypescript(stmt.expr, nextOption(nnoption)))
            break
        case "import-type":
            temp.push("import", "type")
            if (stmt.name === undefined && stmt.fields.length === 0) {
                temp.push(JSON.stringify(stmt.from))
                break
            }
            temp.push([
                ...(stmt.name !== undefined ? [stmt.name] : []),
                ...(stmt.fields.length > 0 ? [
                    `{ ${stmt.fields.map(v => {
                        if (Array.isArray(v)) {
                            return `${v[0]} as ${v[1]}`
                        } else {
                            return v
                        }
                    }).join(", ")} }`
                ] : []),
            ])
            temp.push("from", JSON.stringify(stmt.from))
            break
    }
    return indent + temp.map(v => {
        if (Array.isArray(v)) {
            return v.join(", ")
        } else {
            return v
        }
    }).join(" ")
}

export function fromBlockToTypescript(block: Block<any>, option?: TypescriptFormat): string {
    const nnoption = requiredTypescriptFormat(option)
    const indent = nnoption.ignoreDepth ? '' : nnoption.indent.repeat(nnoption.depth)
    return `${indent}{\n${block.statements.map(v => {
        const temp = fromStmtToTypescript(v, nextOption(nnoption))
        if (temp.endsWith("}")) {
            return temp
        } else {
            return temp + ";"
        }
    }).join("\n")}\n${indent}}`
}
export function fromExprValueToTypescript(expr: ExprValue, option?: TypescriptFormat): string {
    const nnoption = requiredTypescriptFormat(option)
    let result = ''
    switch (expr.valueof) {
        case "binary":
            return `${fromExprValueToTypescript(expr.left, nnoption)} ${expr.op} ${fromExprValueToTypescript(expr.right, nnoption)}`
        case "literal":
            switch (typeof expr.value) {
                case "undefined": return "undefined";
                case "object": return "null";
                case "bigint": return expr.value.toString() + "n";
                default: return JSON.stringify(expr.value);
            }
        case "identifier":
            if (typeof expr.ident[0] === 'string') {
                result += expr.ident[0]
            } else {
                result += fromExprValueToTypescript(expr.ident[0], nnoption)
            }
            for (const v of expr.ident.slice(1)) {
                switch (typeof v) {
                    case "number":
                        result += `[${v}]`
                        break
                    case "string":
                        result += `.${v}`
                        break
                    default:
                        result += `[${fromExprValueToTypescript(v, nextOption(nnoption, { depthIncrease: false, ignoreDepth: true }))}]`
                        break
                }
            }
            return result
        case "array":
            return `[${expr.elems.map((v) => { return fromExprValueToTypescript(v, nnoption) }).join(", ")}]`

        case "object":
            return `{ ${expr.fields.map(([k, v]) => {
                if (typeof k === 'string') {
                    return `${JSON.stringify(k)}: ${fromExprValueToTypescript(v, nnoption)}`
                }
                return `[${fromExprValueToTypescript(v, nnoption)}]: ${fromExprValueToTypescript(v, nnoption)}`
            }).join(", ")} }`

        case "call":
            result += fromExprValueToTypescript(expr.callee, nnoption)
            if (expr.typeArgs !== undefined) {
                result += `<${expr.typeArgs.map(v => fromExprTypeToTypescript(v, nextOption(nnoption, { ignoreDepth: true }))).join(", ")}>`
            }
            result += `(${expr.args.map(v => fromExprValueToTypescript(v, nnoption))})`
            return result
        case "await":
            return `await ${fromExprValueToTypescript(expr.value, nnoption)}`
        case "arrow-function":
            let param = '()'
            let body = '{}'
            if (expr.params.length === 1 && typeof expr.params[0] === 'string') {
                param = expr.params[0]
            } else {
                param = `(${expr.params.map(v => {
                    if (Array.isArray(v)) {
                        return `${v[0]}: ${fromExprTypeToTypescript(v[1], nnoption)}`
                    }
                    return v
                }).join(", ")})`
            }
            if (expr.value.kindof === 'block') {
                body = fromBlockToTypescript(expr.value, nnoption).trimStart()
            } else {
                body = fromExprValueToTypescript(expr.value, nnoption)
                if (body.trim().startsWith("{")) {
                    return `${param} => (${body})`
                }
            }
            return `${param} => ${body}`

    }
    return "{} as any"
}

export function fromExprTypeToTypescript(expr: ExprType, option?: TypescriptFormat): string {
    const nnoption = requiredTypescriptFormat(option)
    switch (expr.typeof) {
        case "any": return "any";
        case "void": return "void";
        case "unknown": return "unknown";
        case "boolean": return "boolean";
        case "string": return "string";
        case "number": return "number";
        case "bigint": return "bigint";
        case "literal":
            switch (typeof expr.value) {
                case "undefined": return "undefined";
                case "object": return "null";
                default: return JSON.stringify(expr.value)
            }
            throw Error("unexpected")
        case "object":
            return "{" + expr.fields.map(([key, tp]) => { return `${JSON.stringify(key)}: ${fromExprTypeToTypescript(tp, nnoption)}` }).join(", ") + "}"
        case "function":
            return `(${expr.params.map(([k, v]) => { return `${k}: ${fromExprTypeToTypescript(v, nnoption)}` }).join(", ")}) => ${fromExprTypeToTypescript(expr.returns, nnoption)}`
        case "reference":
            const name = fromExprTypeToTypescript(expr.name, nnoption)
            if (expr.typeargs.length === 0) {
                return name
            }
            return `${name}<${expr.typeargs.map(v => fromExprTypeToTypescript(v, nnoption)).join(", ")}>`
        case "access":
            let result = ''
            // expr.args[0].toString()
            if (typeof expr.args[0] === 'string') {
                result += expr.args[0]
            } else {
                result += fromExprTypeToTypescript(expr.args[0], nnoption)
            }
            for (const v of expr.args.slice(1)) {
                if (typeof v === "string") {
                    result += '.' + v
                } else {
                    result += `[${fromExprTypeToTypescript(v, nnoption)}]`
                }
            }
            return result
        case "union":
            return expr.args.map(v => { return fromExprTypeToTypescript(v, nnoption) }).join(" | ")
        case "intersect":
            return expr.args.map(v => { return fromExprTypeToTypescript(v, nnoption) }).join(" & ")
        case "import":
            return `import(${JSON.stringify(expr.name)})`
        case "typeof":
            return `typeof ${fromExprTypeToTypescript(expr.about, nnoption)}`
        case "tuple":
            return `[${expr.elems.map(v => fromExprTypeToTypescript(v, nnoption))}]`
    }
    return "any"
}
