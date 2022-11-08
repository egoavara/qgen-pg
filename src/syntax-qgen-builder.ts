import { addDefine } from "./storage.js"
import { TsSnippet } from "./ts-snippet.js"

const RE_NAMED_ARGS = /\{\{\s*([a-zA-Z_-][a-zA-Z0-9_-]*)\s*\}\}/g

export type Trim<Q> =
    Q extends ` ${infer Remain}`
    ? Trim<Remain>
    : Q extends `${infer Remain} `
    ? Trim<Remain>
    : Q
export type QueryArgs<Q> =
    Q extends `${string}{{${infer Name}}}${infer Remain}`
    ? Trim<Name> | QueryArgs<Remain>
    : never

export class QgenBuilder<Query extends string = ''> {
    #name: string
    #query: string
    #inputs: Record<string, { name: string, index: number, value: any, typeSnippet?: TsSnippet }>
    private constructor(name: string) {
        this.#name = name
        this.#query = ''
        this.#inputs = {}
    }
    static create(name: string): QgenBuilder {
        return new QgenBuilder(name)
    }
    query<NewQuery extends string>(query: NewQuery): QgenBuilder<NewQuery> {
        let idx = 1;
        let qStartAt = 0
        this.#inputs = {}
        this.#query = ''
        for (const field of query.matchAll(RE_NAMED_ARGS)) {
            if (field[1] in this.#inputs) {
                continue
            }
            this.#query += query.slice(qStartAt, field.index) + `$${idx}`
            this.#inputs[field[1]] = { name: field[1], index: idx++, value: null }
            qStartAt = field.index! + field[0].length
        }
        this.#query += query.slice(qStartAt)
        return this as any
    }
    inputType(partitial: Partial<Record<QueryArgs<Query>, TsSnippet>>): QgenBuilder<Query> {
        for (const [k, v] of Object.entries(partitial)) {
            this.#inputs[k].typeSnippet = v as any
        }
        return this
    }
    inputs(partitial: Partial<Record<QueryArgs<Query>, any>>): QgenBuilder<Query> {
        for (const [k, v] of Object.entries(partitial)) {
            this.#inputs[k].value = v
        }
        return this
    }
    end() {
        return {
            name: this.#name,
            query: this.#query,
            inputs: this.#inputs,
            testValues: Object.entries(this.#inputs).sort(([k, v]) => { return v.index }).reduce((acc, [k, v]) => { acc.push(v.value); return acc }, [] as any[])
        }
    }
}

export const qgen = (name: string) => {
    const temp = QgenBuilder.create(name)
    addDefine(temp)
    return temp
}