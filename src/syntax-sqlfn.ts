import { QueryBuilder } from "./syntax-querybuilder.js"
import { TypeBuilder } from "./syntax-typebuilder.js"

export function sqlfn(name: string): QueryBuilder
export function sqlfn(): TypeBuilder<Record<string, never>>
export function sqlfn(name?: string) {
    if (name === undefined) {
        return new TypeBuilder({}, {})
    }
    return new QueryBuilder(name)
}
