import ts from "typescript"
import pg from "pg"

const pgBuiltinTypes: Record<number, (ctx: ts.TransformationContext) => ts.TypeNode> = {
    [pg.types.builtins.BOOL]: ({ factory }) => factory.createToken(ts.SyntaxKind.BooleanKeyword),
    [pg.types.builtins.BYTEA]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.CHAR]: ({ factory }) => factory.createToken(ts.SyntaxKind.StringKeyword),
    [pg.types.builtins.INT8]: ({ factory }) => factory.createToken(ts.SyntaxKind.StringKeyword),
    [pg.types.builtins.INT2]: ({ factory }) => factory.createToken(ts.SyntaxKind.NumberKeyword),
    [pg.types.builtins.INT4]: ({ factory }) => factory.createToken(ts.SyntaxKind.NumberKeyword),
    [pg.types.builtins.REGPROC]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.TEXT]: ({ factory }) => factory.createToken(ts.SyntaxKind.StringKeyword),
    [pg.types.builtins.OID]: ({ factory }) => factory.createToken(ts.SyntaxKind.NumberKeyword),
    [pg.types.builtins.TID]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.XID]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.CID]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.JSON]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.XML]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.PG_NODE_TREE]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.SMGR]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.PATH]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.POLYGON]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.CIDR]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.FLOAT4]: ({ factory }) => factory.createToken(ts.SyntaxKind.NumberKeyword),
    [pg.types.builtins.FLOAT8]: ({ factory }) => factory.createToken(ts.SyntaxKind.NumberKeyword),
    [pg.types.builtins.ABSTIME]: ({ factory }) => factory.createTypeReferenceNode('Date'),
    [pg.types.builtins.RELTIME]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.TINTERVAL]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.CIRCLE]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.MACADDR8]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.MONEY]: ({ factory }) => factory.createToken(ts.SyntaxKind.StringKeyword),
    [pg.types.builtins.MACADDR]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.INET]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.ACLITEM]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.BPCHAR]: ({ factory }) => factory.createToken(ts.SyntaxKind.StringKeyword),
    [pg.types.builtins.VARCHAR]: ({ factory }) => factory.createToken(ts.SyntaxKind.StringKeyword),
    [pg.types.builtins.DATE]: ({ factory }) => factory.createTypeReferenceNode('Date'),
    [pg.types.builtins.TIME]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.TIMESTAMP]: ({ factory }) => factory.createTypeReferenceNode('Date'),
    [pg.types.builtins.TIMESTAMPTZ]: ({ factory }) => factory.createTypeReferenceNode('Date'),
    [pg.types.builtins.INTERVAL]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.TIMETZ]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.BIT]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.VARBIT]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.NUMERIC]: ({ factory }) => factory.createToken(ts.SyntaxKind.StringKeyword),
    [pg.types.builtins.REFCURSOR]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.REGPROCEDURE]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.REGOPER]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.REGOPERATOR]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.REGCLASS]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.REGTYPE]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.UUID]: ({ factory }) => factory.createToken(ts.SyntaxKind.StringKeyword),
    [pg.types.builtins.TXID_SNAPSHOT]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.PG_LSN]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.PG_NDISTINCT]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.PG_DEPENDENCIES]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.TSVECTOR]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.TSQUERY]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.GTSVECTOR]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.REGCONFIG]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.REGDICTIONARY]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.JSONB]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.REGNAMESPACE]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),
    [pg.types.builtins.REGROLE]: ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword),

}


export interface StorageType {
    type?: (ctx: ts.TransformationContext) => ts.TypeNode
    parser: (raw: string) => any
}

export interface CopiedStorageType {
    oid: Record<number, StorageType>
    name: Record<string, Record<string, StorageType>>
}

export namespace StorageType {
    let secretOid: Record<number, StorageType> = {}
    let secretName: Record<string, Record<string, StorageType>> = {}
    export function clear() {
        secretOid = Object.fromEntries(Object.entries(pgBuiltinTypes).map<[string, StorageType]>(([k, v]) => {
            return [k, {
                parser: pg.types.getTypeParser(Number(k), 'text'),
                type: v
            }]
        }))
    }
    export function push(oid: number, val: StorageType): void;
    export function push(namespace: string, name: string, val: StorageType): void;
    export function push(...args: any[]) {
        if (typeof args[0] === 'number') {
            secretOid[args[0]] = args[1]
        }
        if (typeof args[0] === 'string') {
            if (!(args[0] in secretName)) {
                secretName[args[0]] = {}
            }
            secretName[args[0]][args[1]] = args[2]

        }
    }
    export function copy(): CopiedStorageType {
        return {
            oid: Object.fromEntries(Object.entries(secretOid)),
            name: Object.fromEntries(Object.entries(secretName).map(([k, v]) => {
                return [k, Object.fromEntries(Object.entries(v).map(([k2, v2]) => {
                    return [k2, v2]
                }))]
            })),
        }
    }
    clear()
}