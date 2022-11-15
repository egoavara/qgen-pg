import { QueryBuilder } from "./syntax-querybuilder.js"
import { TypeBuilder } from "./syntax-typebuilder.js"

export function qgen(name: string): QueryBuilder
export function qgen(): TypeBuilder<Record<string, never>>
export function qgen(name?: string) {
    if (name === undefined) {
        return new TypeBuilder({}, {})
    }
    return new QueryBuilder(name)
}
