import { ExprType } from "./lang-expr-type.js"

export interface StorageQuery {
    name: string
    text: string
    mode: "void" | "option" | "first" | number
    inputs: {
        key: string
        type: ExprType
        value: any
    }[]
}