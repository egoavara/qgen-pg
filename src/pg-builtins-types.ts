export interface IPostgresInterval {
    years?: number
    months?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number

    toPostgres(): string

    toISO(): string
    toISOString(): string
}

export type pg_catalog_ext = {
    "bigint": {
        int8: bigint
        _int8: bigint[]
    },
    "bitnumber.js": {
        numeric: import('bignumber.js').BigNumber
        _numeric: import('bignumber.js').BigNumber[]
    },
    "moment": {
        "date": import("moment").Moment,
        "_date": import("moment").Moment[],
        "time": import("moment").Moment,
        "_time": import("moment").Moment[],
        "timestamp": import("moment").Moment,
        "_timestamp": import("moment").Moment[],
        "timestamptz": import("moment").Moment,
        "_timestamptz": import("moment").Moment[],
        "timetz": import("moment").Moment,
        "_timetz": import("moment").Moment[],
        "interval": import("moment").Duration,
        "_interval": import("moment").Duration[],
    }
}

export type pg_catalog = {
    bool: boolean
    _bool: boolean[]
    char: string
    _char: string[]
    int8: string
    _int8: string[]
    int4: number
    _int4: number[]
    int2: number
    _int2: number[]
    text: string
    _text: string[]
    oid: number
    _oid: number[]
    json: any
    _json: any[]
    xml: any
    _xml: any[]
    float4: number
    _float4: number[]
    float8: number
    _float8: number[]
    bpchar: string
    _bpchar: string[]
    varchar: string
    _varchar: string[]
    date: Date
    _date: Date[]
    timestamp: Date
    _timestamp: Date[]
    timestamptz: Date
    _timestamptz: Date[]
    numeric: string
    _numeric: string[]
    uuid: string
    _uuid: string[]
    jsonb: any
    _jsonb: any[]
    point: { x: number, y: number }
    _point: { x: number, y: number }[]
    interval: IPostgresInterval
    _interval: IPostgresInterval[]
    bytea: Buffer
    _bytea: Buffer[]
}