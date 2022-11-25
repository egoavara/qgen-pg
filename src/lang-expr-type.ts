export type ExprType = ExprTypeKeyword | ExprTypeLiteral | ExprTypeObject | ExprTypeFunction | ExprTypeReference | ExprTypeUnion | ExprTypeAccess | ExprTypeIntersect | ExprTypeImport | ExprTypeTypeof | ExprTypeTuple

export interface ExprTypeKeyword {
    kindof: "expression"
    typeof: 'number' | 'string' | 'bigint' | 'boolean' | 'any' | 'unknown' | 'void'
}
export function ExprTypeKeyword(tt: ExprTypeKeyword['typeof']): ExprTypeKeyword { return { kindof: "expression", typeof: tt } }

export interface ExprTypeLiteral<T extends string | number | boolean | null | undefined = string | number | boolean | null | undefined> {
    kindof: "expression"
    typeof: 'literal',
    value: T
}
export function ExprTypeLiteral<T extends string | number | boolean | null | undefined>(value: T): ExprTypeLiteral<T> { return { kindof: "expression", typeof: 'literal', value } }

export interface ExprTypeObject {
    kindof: "expression"
    typeof: 'object',
    fields: [string, ExprType][]
}
export function ExprTypeObject(...fields: [string, ExprType][]): ExprTypeObject { return { kindof: "expression", typeof: 'object', fields } }

export interface ExprTypeFunction {
    kindof: "expression"
    typeof: 'function',
    params: [string, ExprType][]
    returns: ExprType
}
export function ExprTypeFunction(returns: ExprType, params: [string, ExprType][]): ExprTypeFunction { return { kindof: "expression", typeof: 'function', params, returns } }

export interface ExprTypeReference {
    kindof: "expression"
    typeof: 'reference',
    typeargs: ExprType[]
    name: ExprType
}
export function ExprTypeReference(name: ExprType, typeargs: ExprType[]): ExprTypeReference { return { kindof: "expression", typeof: 'reference', name, typeargs } }

export interface ExprTypeUnion {
    kindof: "expression"
    typeof: 'union',
    args: ExprType[]
}
export function ExprTypeUnion(...args: (ExprType)[]): ExprTypeUnion { return { kindof: "expression", typeof: 'union', args } }

export interface ExprTypeAccess {
    kindof: "expression"
    typeof: 'access',
    args: (string | ExprType)[]
}
export function ExprTypeAccess(...args: (string | ExprType)[]): ExprTypeAccess { return { kindof: "expression", typeof: 'access', args } }


export interface ExprTypeIntersect {
    kindof: "expression"
    typeof: 'intersect',
    args: ExprType[]
}
export function ExprTypeIntersect(...args: (ExprType)[]): ExprTypeIntersect { return { kindof: "expression", typeof: 'intersect', args } }

export interface ExprTypeImport {
    kindof: "expression"
    typeof: 'import',
    name: string,

}
export function ExprTypeImport(name: string,): ExprTypeImport { return { kindof: "expression", typeof: 'import', name } }
export interface ExprTypeTypeof {
    kindof: "expression"
    typeof: 'typeof',
    about: ExprType

}
export function ExprTypeTypeof(about: ExprType): ExprTypeTypeof { return { kindof: "expression", typeof: 'typeof', about } }

export interface ExprTypeTuple {
    kindof: "expression"
    typeof: 'tuple',
    elems: ExprType[]

}
export function ExprTypeTuple(...elems: ExprType[]): ExprTypeTuple { return { kindof: "expression", typeof: 'tuple', elems } }