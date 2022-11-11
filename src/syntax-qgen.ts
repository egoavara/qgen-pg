import ts from "typescript";
import pg from "pg";
import { QueryArgs, StorageQuery } from "./index.js";
const RE_NAMED_ARGS = /\{\{\s*([a-zA-Z_-][a-zA-Z0-9_-]*)\s*\}\}/g
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
export class TypeBuilder<Type> implements pg.CustomTypesConfig {
    #mapping: Record<number, [string, string]>
    #parser: Record<string, Record<string, (raw: string) => any>>
    constructor(mapping: Record<number, [string, string]>, parser: Record<string, Record<string, (raw: string) => any>>) {
        this.#mapping = {}
        this.#parser = {}
    }
    addOid(oid: number, namespace: string, name: string) {
        this.#mapping[oid] = [namespace, name]
    }
    type<NS extends string, NM extends string, T>(namespace: NS, name: NM, parser: (raw: string) => T, oid?: number): TypeBuilder<Type & Record<NS, Record<NM, T>>> {
        if (oid !== undefined) {
            this.#mapping[oid] = [namespace, name]
        }
        if (!(namespace in this.#parser)) {
            this.#parser[namespace] = {}
        }
        this.#parser[namespace][name] = parser
        return this
    }
    getTypeParser(id: number, format?: any): any {
        if (format === 'binary') {
            throw new Error(`binary not support`)
        }
        if (id in format) {
            const [ns, nm] = this.#mapping[id]
            return this.#parser[ns]?.[nm] ?? pg.types.getTypeParser(id, format)
        }
        return pg.types.getTypeParser(id, format)
    }


}
export interface pg_catalog {
    bool: boolean
    char: string
    int8: string
    int4: number
    int2: number
    text: string
    oid: number
    json: any
    xml: any
    float4: number
    float8: number
    bpchar: string
    varchar: string
    date: Date
    timestamp: Date
    timestamptz: Date
    numeric: string
    uuid: string
    jsonb: any
    // 
    [x: string]: any
}
export function qgen(name: string): QueryBuilder;
export function qgen(): TypeBuilder<{ pg_catalog: pg_catalog }>;
export function qgen(name?: string) {
    if (name === undefined) {
        return new TypeBuilder({
            [pg.types.builtins.BOOL]: ['pg_catalog', 'bool'],
            [pg.types.builtins.CHAR]: ['pg_catalog', 'char'],
            [pg.types.builtins.INT8]: ['pg_catalog', 'int8'],
            [pg.types.builtins.INT2]: ['pg_catalog', 'int2'],
            [pg.types.builtins.INT4]: ['pg_catalog', 'int4'],
            [pg.types.builtins.TEXT]: ['pg_catalog', 'text'],
            [pg.types.builtins.JSON]: ['pg_catalog', 'json'],
            [pg.types.builtins.XML]: ['pg_catalog', 'xml'],
            [pg.types.builtins.FLOAT4]: ['pg_catalog', 'float4'],
            [pg.types.builtins.FLOAT8]: ['pg_catalog', 'float8'],
            [pg.types.builtins.BPCHAR]: ['pg_catalog', 'bpchar'],
            [pg.types.builtins.VARCHAR]: ['pg_catalog', 'varchar'],
            [pg.types.builtins.DATE]: ['pg_catalog', 'date'],
            [pg.types.builtins.TIMESTAMP]: ['pg_catalog', 'timestamp'],
            [pg.types.builtins.TIMESTAMPTZ]: ['pg_catalog', 'timestamptz'],
            [pg.types.builtins.UUID]: ['pg_catalog', 'uuid'],
            [pg.types.builtins.JSONB]: ['pg_catalog', 'jsonb'],
        }, {
            'pg_catalog': {
                'bool': pg.types.getTypeParser(pg.types.builtins.BOOL, 'text'),
                'char': pg.types.getTypeParser(pg.types.builtins.CHAR, 'text'),
                'int8': pg.types.getTypeParser(pg.types.builtins.INT8, 'text'),
                'int2': pg.types.getTypeParser(pg.types.builtins.INT2, 'text'),
                'int4': pg.types.getTypeParser(pg.types.builtins.INT4, 'text'),
                'text': pg.types.getTypeParser(pg.types.builtins.TEXT, 'text'),
                'json': pg.types.getTypeParser(pg.types.builtins.JSON, 'text'),
                'xml': pg.types.getTypeParser(pg.types.builtins.XML, 'text'),
                'float4': pg.types.getTypeParser(pg.types.builtins.FLOAT4, 'text'),
                'float8': pg.types.getTypeParser(pg.types.builtins.FLOAT8, 'text'),
                'bpchar': pg.types.getTypeParser(pg.types.builtins.BPCHAR, 'text'),
                'varchar': pg.types.getTypeParser(pg.types.builtins.VARCHAR, 'text'),
                'date': pg.types.getTypeParser(pg.types.builtins.DATE, 'text'),
                'timestamp': pg.types.getTypeParser(pg.types.builtins.TIMESTAMP, 'text'),
                'timestamptz': pg.types.getTypeParser(pg.types.builtins.TIMESTAMPTZ, 'text'),
                'uuid': pg.types.getTypeParser(pg.types.builtins.UUID, 'text'),
                'jsonb': pg.types.getTypeParser(pg.types.builtins.JSONB, 'text'),
            }
        })
    }
    return new QueryBuilder(name)
}

export type QgenTypeParser<T, NS, NM> = T extends TypeBuilder<infer Parser>
    ? (
        NS extends keyof Parser
        ? (
            NM extends keyof Parser[NS]
            ? Parser[NS][NM]
            : unknown
        )
        : unknown
    )
    : unknown
