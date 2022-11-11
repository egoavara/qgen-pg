import ts from "typescript"
import pg from "pg"
function pgDefaultTypeParserExpr(oid: number): ts.Expression {
    return ts.factory.createCallExpression(
        // pg.types.getTypeParser
        ts.factory.createPropertyAccessExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('pg'), 'types'), 'getTypeParser'),
        undefined,
        // <oid>, "text"
        [ts.factory.createNumericLiteral(oid), ts.factory.createStringLiteral('text')])
}
const pgBuiltinTypes = {
    [pg.types.builtins.BOOL]: { type: ts.factory.createToken(ts.SyntaxKind.BooleanKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.BOOL) },
    [pg.types.builtins.BYTEA]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.BYTEA) },
    [pg.types.builtins.CHAR]: { type: ts.factory.createToken(ts.SyntaxKind.StringKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.CHAR) },
    [pg.types.builtins.INT8]: { type: ts.factory.createToken(ts.SyntaxKind.StringKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.INT8) },
    [pg.types.builtins.INT2]: { type: ts.factory.createToken(ts.SyntaxKind.NumberKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.INT2) },
    [pg.types.builtins.INT4]: { type: ts.factory.createToken(ts.SyntaxKind.NumberKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.INT4) },
    [pg.types.builtins.REGPROC]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.REGPROC) },
    [pg.types.builtins.TEXT]: { type: ts.factory.createToken(ts.SyntaxKind.StringKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.TEXT) },
    [pg.types.builtins.OID]: { type: ts.factory.createToken(ts.SyntaxKind.NumberKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.OID) },
    [pg.types.builtins.TID]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.TID) },
    [pg.types.builtins.XID]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.XID) },
    [pg.types.builtins.CID]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.CID) },
    [pg.types.builtins.JSON]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.JSON) },
    [pg.types.builtins.XML]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.XML) },
    [pg.types.builtins.PG_NODE_TREE]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.PG_NODE_TREE) },
    [pg.types.builtins.SMGR]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.SMGR) },
    [pg.types.builtins.PATH]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.PATH) },
    [pg.types.builtins.POLYGON]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.POLYGON) },
    [pg.types.builtins.CIDR]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.CIDR) },
    [pg.types.builtins.FLOAT4]: { type: ts.factory.createToken(ts.SyntaxKind.NumberKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.FLOAT4) },
    [pg.types.builtins.FLOAT8]: { type: ts.factory.createToken(ts.SyntaxKind.NumberKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.FLOAT8) },
    [pg.types.builtins.ABSTIME]: { type: ts.factory.createTypeReferenceNode('Date'), parser: pgDefaultTypeParserExpr(pg.types.builtins.ABSTIME) },
    [pg.types.builtins.RELTIME]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.RELTIME) },
    [pg.types.builtins.TINTERVAL]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.TINTERVAL) },
    [pg.types.builtins.CIRCLE]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.CIRCLE) },
    [pg.types.builtins.MACADDR8]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.MACADDR8) },
    [pg.types.builtins.MONEY]: { type: ts.factory.createToken(ts.SyntaxKind.StringKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.MONEY) },
    [pg.types.builtins.MACADDR]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.MACADDR) },
    [pg.types.builtins.INET]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.INET) },
    [pg.types.builtins.ACLITEM]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.ACLITEM) },
    [pg.types.builtins.BPCHAR]: { type: ts.factory.createToken(ts.SyntaxKind.StringKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.BPCHAR) },
    [pg.types.builtins.VARCHAR]: { type: ts.factory.createToken(ts.SyntaxKind.StringKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.VARCHAR) },
    [pg.types.builtins.DATE]: { type: ts.factory.createTypeReferenceNode('Date'), parser: pgDefaultTypeParserExpr(pg.types.builtins.DATE) },
    [pg.types.builtins.TIME]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.TIME) },
    [pg.types.builtins.TIMESTAMP]: { type: ts.factory.createTypeReferenceNode('Date'), parser: pgDefaultTypeParserExpr(pg.types.builtins.TIMESTAMP) },
    [pg.types.builtins.TIMESTAMPTZ]: { type: ts.factory.createTypeReferenceNode('Date'), parser: pgDefaultTypeParserExpr(pg.types.builtins.TIMESTAMPTZ) },
    [pg.types.builtins.INTERVAL]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.INTERVAL) },
    [pg.types.builtins.TIMETZ]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.TIMETZ) },
    [pg.types.builtins.BIT]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.BIT) },
    [pg.types.builtins.VARBIT]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.VARBIT) },
    [pg.types.builtins.NUMERIC]: { type: ts.factory.createToken(ts.SyntaxKind.StringKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.NUMERIC) },
    [pg.types.builtins.REFCURSOR]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.REFCURSOR) },
    [pg.types.builtins.REGPROCEDURE]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.REGPROCEDURE) },
    [pg.types.builtins.REGOPER]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.REGOPER) },
    [pg.types.builtins.REGOPERATOR]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.REGOPERATOR) },
    [pg.types.builtins.REGCLASS]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.REGCLASS) },
    [pg.types.builtins.REGTYPE]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.REGTYPE) },
    [pg.types.builtins.UUID]: { type: ts.factory.createToken(ts.SyntaxKind.StringKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.UUID) },
    [pg.types.builtins.TXID_SNAPSHOT]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.TXID_SNAPSHOT) },
    [pg.types.builtins.PG_LSN]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.PG_LSN) },
    [pg.types.builtins.PG_NDISTINCT]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.PG_NDISTINCT) },
    [pg.types.builtins.PG_DEPENDENCIES]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.PG_DEPENDENCIES) },
    [pg.types.builtins.TSVECTOR]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.TSVECTOR) },
    [pg.types.builtins.TSQUERY]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.TSQUERY) },
    [pg.types.builtins.GTSVECTOR]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.GTSVECTOR) },
    [pg.types.builtins.REGCONFIG]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.REGCONFIG) },
    [pg.types.builtins.REGDICTIONARY]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.REGDICTIONARY) },
    [pg.types.builtins.JSONB]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.JSONB) },
    [pg.types.builtins.REGNAMESPACE]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.REGNAMESPACE) },
    [pg.types.builtins.REGROLE]: { type: ts.factory.createToken(ts.SyntaxKind.AnyKeyword), parser: pgDefaultTypeParserExpr(pg.types.builtins.REGROLE) },
}


export interface StorageType {
    oid: number
    parser: ts.Expression
    type: ts.TypeNode
}


// export namespace StorageType {
//     let secretOid: StorageType[]
//     export function clear() {
//         // secretOid = Object.fromEntries(Object.entries(pgBuiltinTypes).map<[string, StorageType]>(([k, v]) => {
//         //     return [k, v]
//         // }))
//         secretOid = {}
//     }
//     export function push(oid: number, val: StorageType): void {
//         secretOid[oid] = val
//     }
//     export function copy(): CopiedStorageType {
//         return Object.fromEntries(Object.entries(secretOid))
//     }
// }