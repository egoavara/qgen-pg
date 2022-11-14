import { pg_catalog } from "./interface-pg_catalog.js"
import { PgCatalogOid, PgCatalogParser } from "./pg-builtins.js"
import { QueryBuilder } from "./syntax-querybuilder.js"
import { TypeBuilder } from "./syntax-typebuilder.js"

export function qgen(name: string): QueryBuilder
export function qgen(): TypeBuilder<{ pg_catalog: pg_catalog }>
export function qgen(name?: string) {
    if (name === undefined) {
        return new TypeBuilder(PgCatalogOid, PgCatalogParser)
    }
    return new QueryBuilder(name)
}
