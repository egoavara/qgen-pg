import { StorageQuery } from "./storage-query.js"
import ts from "typescript"
import { QueryArgs } from "./index.js"

export class QueryBuilder {
    static RE_NAMED_ARGS = /\{\{\s*([a-zA-Z_-][a-zA-Z0-9_-]*)\s*\}\}/g
    name: string
    constructor(name: string) {
        this.name = name
    }
    query<NQ extends string>(q: NQ): QueryBuilderInput<NQ> {
        let idx = 1
        let qStartAt = 0
        const ref: StorageQuery = {
            name: this.name,
            text: '',
            inputs: []
        }
        for (const field of q.matchAll(QueryBuilder.RE_NAMED_ARGS)) {
            if (ref.inputs.findIndex((v) => v.key === field[1]) !== -1) {
                continue
            }
            ref.text += q.slice(qStartAt, field.index) + '$' + idx + ' '
            ref.inputs.push({
                key: field[1],
                value: null,
                type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword)
            })
            qStartAt = field.index! + field[0].length
        }
        ref.text += q.slice(qStartAt)
        StorageQuery.push(ref)
        return new QueryBuilderInput(this.name, ref)
    }
}
export class QueryBuilderInput<Q extends string> {
    name: string
    ref: StorageQuery
    constructor(name: string, ref: StorageQuery) {
        this.name = name
        this.ref = ref
    }
    input<T = any>(field: QueryArgs<Q>, testValue?: any): QueryBuilderInput<Q> {
        const target = this.ref.inputs.find((v) => v.key === field)
        if (target === undefined) {
            throw new Error('unknown field ' + field + ' on ' + this.name)
        }
        target.value = testValue
        return this
    }
}