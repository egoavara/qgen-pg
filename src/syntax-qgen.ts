import { PgType } from "./load-pgtype.js"
import { StorageQuery } from "./storage-query.js"
import { StorageType } from "./storage-type.js";
// declare global {
//     module NodeJS {
//         interface Global {
//             QGEN_STORAGE_QUERY?: StorageQuery[];
//             QGEN_STORAGE_TYPE?: StorageType[];
//         }
//     }
// }
declare module globalThis {
    const QGEN_STORAGE_QUERY: StorageQuery[];
    const QGEN_STORAGE_TYPE: StorageType[];
}
type s = typeof globalThis

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

export class QueryBuilder {
    name: string
    constructor(name: string) {
        this.name = name
    }
    query<NQ extends string>(q: NQ): QueryBuilderInput<NQ> {
        let idx = 1;
        let qStartAt = 0
        const ref: StorageQuery = {
            name: this.name,
            text: '',
            inputs: []
        }
        for (const field of q.matchAll(RE_NAMED_ARGS)) {
            if (ref.inputs.findIndex((v) => v.key === field[1]) !== -1) {
                continue
            }
            ref.text += q.slice(qStartAt, field.index) + `$${idx}`
            ref.inputs.push({
                key: field[1],
                value: null,
                type: (_) => {
                    return (node) => node
                }
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
            throw new Error(`unknown field ${field} on ${this.name}`)
        }
        target.value = testValue
        return this
    }
}
export class TypeBuilder {
    type<T = any>(): TypeBuilderWhen<T> {
        return new TypeBuilderWhen()
    }
}
export class TypeBuilderWhen<T> {
    when(namespace: string, name: string): TypeBuilderParser<T>;
    when(oid: number): TypeBuilderParser<T>;
    when(...args: any[]): TypeBuilderParser<T> {
        if (typeof args[0] === 'string' && typeof args[1] === 'string') {
            return new TypeBuilderParser<T>([args[0], args[1]])
        }
        return new TypeBuilderParser<T>(args[0])
    }
}
export class TypeBuilderParser<T> {
    when: number | [string, string]
    constructor(when: number | [string, string]) {
        this.when = when
    }
    parser(parser: (raw: string) => T): void {
        if (typeof this.when === 'number') {
            StorageType.push(this.when, { parser })
        } else {
            StorageType.push(this.when[0], this.when[1], { parser })
        }
    }
}
export function qgen(name: string): QueryBuilder;
export function qgen(): TypeBuilder;
export function qgen(name?: string) {
    if (name === undefined) {
        return new TypeBuilder()
    }
    return new QueryBuilder(name)
}