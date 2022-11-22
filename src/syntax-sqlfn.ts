import { QueryBuilder } from "./syntax-querybuilder.js"
import { TypeBuilder } from "./syntax-typebuilder.js"

export function sqlfn(): QueryBuilder
export function sqlfn(mode: "type"): TypeBuilder<Record<string, never>>
export function sqlfn(mode? : string) {
    if (mode === "type") {
        return new TypeBuilder({}, {})
    }
    return new QueryBuilder()
}
