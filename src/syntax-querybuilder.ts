import { StorageQuery } from "./storage-query.js"
import { ExprTypeKeyword } from "./lang.js"

export class QueryBuilder {
    static RE_NAMED_ARGS = /\{\{\s*([a-zA-Z_-][a-zA-Z0-9_-]*)\s*\}\}/g
    mode: "void" | "option" | "first" | number
    ref: StorageQuery
    constructor() {
        this.mode = Infinity
        this.ref = {
            name: "unknown",
            mode: this.mode,
            text: '',
            inputs: []
        }
    }
    /**
     * @param rowCount : must be integer with 0 or Infinity
     */
    exact(rowCount: number): Omit<QueryBuilder, "exact" | "void" | "option" | "first"> {
        if (rowCount < 0) { throw Error("rowCount must be large equal than 0") }
        if (Number.isFinite(rowCount) && !Number.isInteger(rowCount)) { throw Error("rowCount must be integer or Infinity") }
        this.mode = rowCount
        return this
    }
    void(): Omit<QueryBuilder, "exact" | "void" | "option" | "first"> {
        this.mode = "void"
        return this
    }
    option(): Omit<QueryBuilder, "exact" | "void" | "option" | "first"> {
        this.mode = "option"
        return this
    }
    first(): Omit<QueryBuilder, "exact" | "void" | "option" | "first"> {
        this.mode = "first"
        return this
    }


    query<NQ extends string>(q: NQ): Omit<QueryBuilder, "exact" | "void" | "option" | "first" | "query"> {
        let idx = 1
        let qStartAt = 0
        for (const field of q.matchAll(QueryBuilder.RE_NAMED_ARGS)) {
            if (this.ref.inputs.findIndex((v) => v.key === field[1]) !== -1) {
                continue
            }
            this.ref.text += q.slice(qStartAt, field.index) + '$' + idx + ' '
            this.ref.inputs.push({
                key: field[1],
                value: null,
                type: ExprTypeKeyword("any")
            })
            qStartAt = field.index! + field[0].length
        }
        this.ref.text += q.slice(qStartAt)
        // 
        //
        return this
    }
}