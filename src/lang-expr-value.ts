import { ExprType } from "./lang-expr-type.js"
import { Block, RunnableStatement } from "./lang-stmt.js"

export type ExprValue = ExprValueLiteral | ExprValueArray | ExprValueObject | ExprValueIdentifier | ExprValueCall | ExprValueAwait | ExprValueArrowFunction | ExprValueBinaryOp

export interface ExprValueLiteral {
    kindof: "expression"
    valueof: 'literal'
    value: string | boolean | null | undefined | number | bigint
}
export function ExprValueLiteral(value: string | boolean | null | undefined | number | bigint): ExprValueLiteral { return { kindof: "expression", valueof: "literal", value } }


export interface ExprValueArray {
    kindof: "expression"
    valueof: 'array'
    elems: ExprValue[]
}
export function ExprValueArray(elems: ExprValue[]): ExprValueArray {
    return { kindof: "expression", valueof: "array", elems }
}

export interface ExprValueObject {
    kindof: "expression"
    valueof: 'object'
    fields: [string | ExprValue, ExprValue][]
}
export function ExprValueObject(fields: [string | ExprValue, ExprValue][]): ExprValueObject {
    return { kindof: "expression", valueof: "object", fields }
}

export interface ExprValueIdentifier {
    kindof: "expression"
    valueof: 'identifier'
    ident: [string | ExprValue, ...(ExprValue | string | number)[]]
}
export function ExprValueIdentifier(ident: string | ExprValue, ...elseIdents: (ExprValue | string | number)[]): ExprValueIdentifier { return { kindof: "expression", valueof: "identifier", ident: [ident, ...elseIdents] } }


export interface ExprValueCall {
    kindof: "expression"
    valueof: 'call'
    callee: ExprValue
    typeArgs?: ExprType[]
    args: ExprValue[]
}
export function ExprValueCall(callee: ExprValue, typeArgs: ExprType[], args: ExprValue[]): ExprValueCall;
export function ExprValueCall(callee: ExprValue, args: ExprValue[]): ExprValueCall;
export function ExprValueCall(...args: any[]): ExprValueCall {
    if (args.length === 3) {
        return { kindof: "expression", valueof: "call", callee: args[0], typeArgs: args[1], args: args[2] }
    }
    return { kindof: "expression", valueof: "call", callee: args[0], args: args[1] }
}

export interface ExprValueAwait {
    kindof: "expression"
    valueof: 'await'
    value: ExprValue
}
export function ExprValueAwait(value: ExprValue): ExprValueAwait { return { kindof: "expression", valueof: "await", value } }


export interface ExprValueBinaryOp {
    kindof: "expression"
    valueof: 'binary'
    left: ExprValue
    op: '+' | '-' | '*' | '/' | '%' | '>=' | '>' | '<=' | '<' | '==' | '!=' | '===' | '!=='
    right: ExprValue
}
export function ExprValueBinaryOp(left: ExprValue, op: ExprValueBinaryOp['op'], right: ExprValue): ExprValueBinaryOp {
    return { kindof: "expression", valueof: "binary", left, op, right }
}


export interface ExprValueArrowFunction {
    kindof: "expression"
    valueof: 'arrow-function'
    params: (string | [string, ExprType])[]
    returns?: ExprType
    value: ExprValue | Block<RunnableStatement>
}
export function ExprValueArrowFunction(params: (string | [string, ExprType])[], value: ExprValue | Block<RunnableStatement>): ExprValueArrowFunction
export function ExprValueArrowFunction(params: (string | [string, ExprType])[], returns: ExprType, value: ExprValue | Block<RunnableStatement>): ExprValueArrowFunction
export function ExprValueArrowFunction(...args: any[]): ExprValueArrowFunction {
    if (args.length === 3) {
        return {
            kindof: "expression",
            valueof: "arrow-function",
            params: args[0],
            returns: args[1],
            value: args[2],
        }
    }
    if (args.length === 2) {
        return {
            kindof: "expression",
            valueof: "arrow-function",
            params: args[0],
            value: args[1],
        }
    }
    throw Error("unexpected")
}

