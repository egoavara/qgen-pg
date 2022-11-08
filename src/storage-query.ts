import ts from "typescript"

export interface Query {
    
    name: string
    text: string
    inputs: {
        key: string
        type?: ts.TypeAliasDeclaration
        value: any
    }[]
}
export namespace Query {
    let secret: Query[] = []
    export function add(q: Query) {
        secret.push(q)
    }

    export function clear() {
        secret = []
    }

    export function copy() {
        return Array.from(secret)
    }
}
