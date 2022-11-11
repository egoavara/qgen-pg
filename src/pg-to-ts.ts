import ts from "typescript";
import { PgType } from "./load-pgtype.js";
import { StorageType } from "./storage-type.js";

export function pgToTsTuple(pgtype: [PgType, boolean][], option: { pgNullToTs: 'null' | 'undefined', mapping: Record<number, StorageType> }): (context: ts.TransformationContext) => ts.TypeNode {
    return (ctx) => {
        if (pgtype.length == 1) {
            return pgToTs(pgtype[0][0], pgtype[0][1], option)(ctx)
        }
        return ctx.factory.createTupleTypeNode(pgtype.map(([tp, nn]) => {
            return pgToTs(tp, nn, option)(ctx)
        }))
    }
}
export function pgToTs(pgtype: PgType | undefined, notNull: boolean | undefined, option: { pgNullToTs: 'null' | 'undefined', mapping: Record<number, StorageType> }): (context: ts.TransformationContext) => ts.TypeNode {
    if (pgtype === undefined) {
        return ({ factory }) => factory.createToken(ts.SyntaxKind.AnyKeyword)
    }
    let modifier: (origin: (context: ts.TransformationContext) => ts.TypeNode) => (context: ts.TransformationContext) => ts.TypeNode;
    if (notNull === true) {
        modifier = (origin) => origin
    } else {
        switch (option.pgNullToTs) {
            case 'null':
                modifier = (origin) => {
                    return (ctx) => {
                        return ctx.factory.createUnionTypeNode([
                            origin(ctx),
                            ctx.factory.createLiteralTypeNode(ctx.factory.createToken(ts.SyntaxKind.NullKeyword)),
                        ])
                    }
                }
                break
            case 'undefined':
                modifier = (origin) => {
                    return (ctx) => {
                        return ctx.factory.createUnionTypeNode([
                            origin(ctx),
                            ctx.factory.createToken(ts.SyntaxKind.UndefinedKeyword),
                        ])
                    }
                }
                break
        }
    }
    switch (pgtype.type) {
        case 'alias':
            return modifier(pgToTs(pgtype.basetype, notNull, option))
        case 'array':
            return modifier((ctx) => ctx.factory.createArrayTypeNode(pgToTs(pgtype.elem, true, option)(ctx)))
        case 'class':
            return modifier((ctx) => {
                return ctx.factory.createTypeLiteralNode(
                    Object.entries(pgtype.fields).map(([key, val]) => {
                        return ctx.factory.createPropertySignature(undefined, ctx.factory.createStringLiteral(key), undefined, pgToTs(val, val.notNull, option)(ctx))
                    })
                )
            })
        case 'primitive':
            const generator = (ctx: ts.TransformationContext) => {
                return option.mapping[pgtype.oid]?.type
                    ?? ctx.factory.createToken(ts.SyntaxKind.AnyKeyword)
            }
            return modifier(generator)
    }

}

