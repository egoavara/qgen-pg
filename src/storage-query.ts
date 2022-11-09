import ts from "typescript"

export interface StorageQuery {
    name: string
    text: string
    inputs: {
        key: string
        type: ts.TransformerFactory<ts.TypeNode>
        value: any
    }[]
}

export namespace StorageQuery {
    let secret: StorageQuery[] = []
    export function push(val: StorageQuery) {
        secret.push(val)
    }
    export function clear() {
        secret = []
    }
    export function copy() {
        return Array.from(secret)
    }
}