import ts from "typescript";
import { Extension } from "./extension.js";
import { PgType } from "./load-pgtype.js";
import { pgBuiltins } from "./pg-builtins.js";
export type Define = Record<number, { type: (factory: ts.NodeFactory) => ts.TypeNode, parser: (factory: ts.NodeFactory) => ts.Expression }>
export const defaultDefines: Define = {
    [pgBuiltins.bool]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseBool") },
    [pgBuiltins.bytea]: { type: (f) => f.createTypeReferenceNode('Buffer'), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseBytea") },
    [pgBuiltins.char]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "noParse") },
    [pgBuiltins.int8]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "noParse") },
    [pgBuiltins.int2]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseInteger") },
    [pgBuiltins.int4]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseInteger") },
    // [pg.types.builtins.REGPROC]: {},
    [pgBuiltins.text]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "noParse") },
    // [pg.types.builtins.OID]: {},
    // [pg.types.builtins.TID]: {},
    // [pg.types.builtins.XID]: {},
    // [pg.types.builtins.CID]: {},
    [pgBuiltins.json]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseJson") },
    [pgBuiltins.xml]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseXml") },
    // [pg.types.builtins.PG_NODE_TREE]: {},
    // [pg.types.builtins.SMGR]: {},
    // [pg.types.builtins.PATH]: {},
    // [pg.types.builtins.POLYGON]: {},
    [pgBuiltins.cidr]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "noParse") },
    [pgBuiltins.float4]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseNumber") },
    [pgBuiltins.float8]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseNumber") },
    [pgBuiltins.macaddr8]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "noParse") },
    [pgBuiltins.money]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "noParse") },
    [pgBuiltins.macaddr]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "noParse") },
    [pgBuiltins.inet]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "noParse") },
    // [pg.types.builtins.ACLITEM]: {},
    [pgBuiltins.bpchar]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "noParse") },
    [pgBuiltins.varchar]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "noParse") },
    [pgBuiltins.date]: { type: (f) => f.createTypeReferenceNode("Date"), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseDate") },
    // [pg.types.builtins.TIME]: {},
    [pgBuiltins.timestamp]: { type: (f) => f.createTypeReferenceNode("Date"), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseDate") },
    [pgBuiltins.timestamptz]: { type: (f) => f.createTypeReferenceNode("Date"), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseDate") },
    [pgBuiltins.interval]: { type: (f) => f.createTypeReferenceNode(f.createQualifiedName(f.createIdentifier("PP"), "IPostgresInterval")), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseDate") },
    // [pg.types.builtins.TIMETZ]: {},
    // [pg.types.builtins.BIT]: {},
    // [pg.types.builtins.VARBIT]: {},
    // [pg.types.builtins.NUMERIC]: {},
    // [pg.types.builtins.REFCURSOR]: {},
    // [pg.types.builtins.REGPROCEDURE]: {},
    // [pg.types.builtins.REGOPER]: {},
    // [pg.types.builtins.REGOPERATOR]: {},
    // [pg.types.builtins.REGCLASS]: {},
    // [pg.types.builtins.REGTYPE]: {},
    [pgBuiltins.uuid]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "noParse") },
    // [pg.types.builtins.TXID_SNAPSHOT]: {},
    // [pg.types.builtins.PG_LSN]: {},
    // [pg.types.builtins.PG_NDISTINCT]: {},
    // [pg.types.builtins.PG_DEPENDENCIES]: {},
    // [pg.types.builtins.TSVECTOR]: {},
    // [pg.types.builtins.TSQUERY]: {},
    // [pg.types.builtins.GTSVECTOR]: {},
    // [pg.types.builtins.REGCONFIG]: {},
    // [pg.types.builtins.REGDICTIONARY]: {},
    [pgBuiltins.jsonb]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseJson") },
    // [pg.types.builtins.REGNAMESPACE]: {},
    // [pg.types.builtins.REGROLE]: {},
    [pgBuiltins.point]: { type: (f) => f.createTypeReferenceNode(f.createQualifiedName(f.createIdentifier("PP"), "Point")), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parsePoint") },
    [pgBuiltins.circle]: { type: (f) => f.createTypeReferenceNode(f.createQualifiedName(f.createIdentifier("PP"), "Circle")), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseCircle") },
    [pgBuiltins.line]: { type: (f) => f.createTypeReferenceNode(f.createQualifiedName(f.createIdentifier("PP"), "Line")), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseLine") },
    [pgBuiltins.box]: { type: (f) => f.createTypeReferenceNode(f.createQualifiedName(f.createIdentifier("PP"), "Box")), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseBox") },
    [pgBuiltins.path]: { type: (f) => f.createTypeReferenceNode(f.createQualifiedName(f.createIdentifier("PP"), "Path")), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parsePath") },
    [pgBuiltins.polygon]: { type: (f) => f.createTypeReferenceNode(f.createQualifiedName(f.createIdentifier("PP"), "Polygon")), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parsePolygon") },

}
export interface PgToTsConfig {
    extension : Extension[]
    tsNullType: 'null' | 'undefined', 
    arrayElem : 'null' | 'notnull'
    mapping: Record<number, PgType>, 
    define: Define
}

export function pgToTsTypeTuple(factory: ts.NodeFactory, pgtype: [PgType, boolean][], option: PgToTsConfig): ts.TypeNode {
    if (pgtype.length == 1) {
        return pgToTsType(factory, pgtype[0][0], pgtype[0][1], option)
    }
    return factory.createTupleTypeNode(pgtype.map(([tp, nn]) => {
        return pgToTsType(factory, tp, nn, option)
    }))
}

export function pgToTsType(factory: ts.NodeFactory, pgtype: PgType, notNull: boolean | undefined, option: PgToTsConfig): ts.TypeNode {
    let modifier: (node: ts.TypeNode) => ts.TypeNode;
    if (notNull === true) {
        modifier = (origin) => origin
    } else {
        switch (option.tsNullType) {
            case 'null':
                modifier = (origin) => {
                    return factory.createUnionTypeNode([
                        origin,
                        factory.createLiteralTypeNode(factory.createToken(ts.SyntaxKind.NullKeyword)),
                    ])
                }
                break
            case 'undefined':
                modifier = (origin) => {
                    return factory.createUnionTypeNode([
                        origin,
                        factory.createToken(ts.SyntaxKind.UndefinedKeyword),
                    ])
                }
                break
        }
    }
    if (pgtype.oid in option.define) {
        return modifier(option.define[pgtype.oid].type(factory))
    }
    switch (pgtype.type) {
        case 'alias':
            return modifier(pgToTsType(factory, pgtype.basetype, notNull, option))
        case 'array':
            if(option.arrayElem === 'notnull'){
                return modifier(factory.createArrayTypeNode(pgToTsType(factory, pgtype.elem, true, option)))
            }
            return modifier(factory.createArrayTypeNode(factory.createUnionTypeNode([
                pgToTsType(factory, pgtype.elem, true, option),
                factory.createLiteralTypeNode(factory.createToken(ts.SyntaxKind.NullKeyword))
            ])))
        case 'class':
            return modifier(factory.createTypeLiteralNode(Object.entries(pgtype.fields).map(([key, val]): ts.PropertySignature => {
                return factory.createPropertySignature(undefined, factory.createStringLiteral(key), undefined, pgToTsType(factory, val, val.notNull, option))
            })))
        case 'primitive':
            return modifier(factory.createToken(ts.SyntaxKind.StringKeyword))
    }
}

export function pgToTsParser(factory: ts.NodeFactory, pgtype: PgType, notNull: boolean | undefined, option: PgToTsConfig): ts.Expression {
    let modifier: (node: ts.Expression) => ts.Expression;
    if (notNull === true) {
        modifier = (origin) => origin
    } else {
        switch (option.tsNullType) {
            case 'null':
                modifier = (origin) => {
                    return factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("PP"), "parseNullable"), undefined, [origin])
                }
                break
            case 'undefined':
                modifier = (origin) => {
                    return factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("PP"), "parseNullable"), undefined, [origin, factory.createIdentifier('undefined')])
                }
                break
        }
    }
    if (pgtype.oid in option.define) {
        return modifier(option.define[pgtype.oid].parser(factory))
    }
    switch (pgtype.type) {
        case 'alias':
            return modifier(pgToTsParser(factory, pgtype.basetype, notNull, option))
        case 'array':
            return modifier(factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier("AP"), "create"), undefined, [pgToTsParser(factory, pgtype.elem, false, option)]))
        case 'class':
            return modifier(factory.createCallExpression(
                factory.createPropertyAccessExpression(factory.createIdentifier("CP"), "create"),
                undefined,
                [
                    factory.createArrayLiteralExpression(Object.entries(pgtype.fields).map(([key, val]): ts.ArrayLiteralExpression => {
                        return factory.createArrayLiteralExpression([factory.createStringLiteral(key), pgToTsParser(factory, val, val.notNull, option)])
                    }))
                ]

            ))
        case 'primitive':
            return modifier(factory.createPropertyAccessExpression(factory.createIdentifier("PP"), "noParse"))
    }
}