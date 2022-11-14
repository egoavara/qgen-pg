import ts from "typescript";
import pg from "pg";
import { AssignDepth2, QueryArgs, StorageQuery } from "./index.js";
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
        this.#mapping = mapping
        this.#parser = parser
    }
    // oid, namespace, name, parser
    setup(set: [number, string, string, (raw: string) => any][]) {
        for (const [oid, ns, nm, parser] of set) {
            this.#mapping[oid] = [ns, nm]
            if (!(ns in this.#parser)) {
                this.#parser[ns] = {}
            }
            this.#parser[ns][nm] = parser
        }
    }
    use(ext: "bigint"): TypeBuilder<AssignDepth2<Record<'pg_catalog', pg_catalog_ext['bigint']>, Type>>;
    use(ext: "bitnumber.js"): TypeBuilder<AssignDepth2<Record<'pg_catalog', pg_catalog_ext['bitnumber.js']>, Type>>;
    use(ext: "moment"): TypeBuilder<AssignDepth2<Record<'pg_catalog', pg_catalog_ext['moment']>, Type>>;
    use(ext: string, ...args: any[]): any {
        switch (ext) {
            case "bigint":
                this.#parser['pg_catalog']['int8'] = (raw: string) => { return BigInt(raw) }
                return this
            case "bitnumber.js":
                import('bignumber.js').then(bn => {
                    this.#parser['pg_catalog']['numeric'] = (raw: string) => {
                        return bn.BigNumber(raw)
                    }
                }).catch(() => {
                    console.error(`must install 'bignumber.js' for your package
npm  : npm i bignumber.js
yarn : yarn add bignumber.js
pnpm : pnpm add bignumber.js
                    `)
                    process.exit(1)
                })
                return this
            case "moment":
                // "date": import("moment").Moment,
                // "time": import("moment").Moment,
                // "timestamp": import("moment").Moment,
                // "timestamptz": import("moment").Moment,
                // "timetz": import("moment").Moment,
                // "interval": import("moment").Duration,
                import('moment').then(moment => {
                    
                    this.#parser['pg_catalog']['date'] = (raw: string) => {
                        return moment.default(raw, "YYYY-MM-DD")
                    }
                    this.#mapping[pg.types.builtins.TIME] = ['pg_catalog', 'time']
                    this.#parser['pg_catalog']['time'] = (raw: string) => {
                        return moment.default(raw, "hh:mm:ss")
                    }
                }).catch(() => {
                    console.error(`must install 'moment' for your package
    npm  : npm i moment
    yarn : yarn add moment
    pnpm : pnpm add moment
                        `)
                    process.exit(1)
                })
                return this
            default:
                throw Error(`unknown extension ${ext}`)
        }
    }
    find(type: 'oid', namespace: string, name: string): number | undefined {
        const temp = Object.entries(this.#mapping).find(([k, [ns, nm]]) => {
            if (ns === namespace && nm === name) {
                return true
            }
            return false
        })
        if (temp === undefined) {
            return undefined
        }
        return Number(temp[0])
    }

    type<NS extends keyof Type, NM extends keyof Type[NS], T>(namespace: NS, name: NM, parser: (raw: string) => T, oid?: number): TypeBuilder<Omit<Type, NS> & Record<NS, Omit<Type[NS], NM>> & Record<NS, Record<NM, T>>>;
    type<NS extends keyof Type, NM extends string, T>(namespace: NS, name: NM, parser: (raw: string) => T, oid?: number): TypeBuilder<Type & Record<NS, Record<NM, T>>>;
    type<NS extends string, NM extends string, T>(namespace: NS, name: NM, parser: (raw: string) => T, oid?: number): TypeBuilder<Type & Record<NS, Record<NM, T>>>;
    type<NS extends string, NM extends string, T>(namespace: NS, name: NM, parser: (raw: string) => T, oid?: number): TypeBuilder<Omit<Type, NS> & Record<NS, Record<NM, T>>> {
        if (oid !== undefined) {
            this.#mapping[oid] = [namespace, name]
        }
        if (!(namespace in this.#parser)) {
            this.#parser[namespace] = {}
        }
        this.#parser[namespace][name] = parser
        return this as any
    }
    getTypeParser(id: number, format?: any): any {
        if (format === 'binary') {
            throw new Error(`binary not support`)
        }
        if (id in this.#mapping) {
            const [ns, nm] = this.#mapping[id]
            return this.#parser[ns]?.[nm] ?? pg.types.getTypeParser(id, format)
        }
        return pg.types.getTypeParser(id, format)
    }


}
export type pg_catalog = {
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
}
export type pg_catalog_ext = {
    "bigint": {
        int8: bigint
    },
    "bitnumber.js": {
        numeric: import('bignumber.js').BigNumber
    },
    "moment": {
        "date": import("moment").Moment,
        "time": import("moment").Moment,
        "timestamp": import("moment").Moment,
        "timestamptz": import("moment").Moment,
        "timetz": import("moment").Moment,
        "interval": import("moment").Duration,
    }
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
            : any
        )
        : any
    )
    : unknown
