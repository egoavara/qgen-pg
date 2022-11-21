import { } from "bignumber.js"
import ts, { factory } from "typescript"
import { pgBuiltins } from "./pg-builtins.js"
import { Define } from "./pg-to-ts.js"
export type Extension = ("bigint" | "bignumber.js" | "moment" | "currency.js")
export const ExtensionImport: Record<Extension, (f: ts.NodeFactory) => ts.Statement[]> = {
    "bigint": (f) => [],
    "bignumber.js": (f) => [f.createImportDeclaration(undefined, f.createImportClause(false, undefined, f.createNamedImports([f.createImportSpecifier(false, undefined, f.createIdentifier('BigNumber'))])), f.createStringLiteral("bignumber.js"))],
    "moment": (f) => [f.createImportDeclaration(undefined, f.createImportClause(false, f.createIdentifier("moment"), f.createNamedImports([
        f.createImportSpecifier(false, undefined, f.createIdentifier('Moment')),
        f.createImportSpecifier(false, undefined, f.createIdentifier('Duration')),
    ])), f.createStringLiteral("moment"))],
    "currency.js": (f) => [f.createImportDeclaration(undefined, f.createImportClause(false, f.createIdentifier("currency"), undefined), f.createStringLiteral("currency.js")),],
}
export const ExtensionDefine: Record<Extension, Define> = {
    "bigint": {
        [pgBuiltins.int8]: { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseBigInteger") }
    },
    "bignumber.js": {
        [pgBuiltins.numeric]: { type: (f) => f.createTypeReferenceNode("BigNumber"), parser: (f) => f.createIdentifier("BigNumber") }
    },
    "moment": {
        [pgBuiltins.date]: {
            type: (f) => f.createTypeReferenceNode("Moment"),
            parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw')], undefined,
                f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createIdentifier("moment"), undefined, [f.createIdentifier("raw"), f.createStringLiteral("YYYY-MM-DD")])
            )
        },
        [pgBuiltins.timestamp]: {
            type: (f) => f.createTypeReferenceNode("Moment"),
            parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw')], undefined,
                f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createIdentifier("moment"), undefined, [f.createIdentifier("raw"), f.createStringLiteral("YYYY-MM-DD hh:mm:ss")])
            )
        },
        [pgBuiltins.timestamptz]: {
            type: (f) => f.createTypeReferenceNode("Moment"),
            parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw')], undefined,
                f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createIdentifier("moment"), undefined, [f.createIdentifier("raw"), f.createStringLiteral("YYYY-MM-DD hh:mm:ssZ")])
            )
        },
        [pgBuiltins.time]: {
            type: (f) => f.createTypeReferenceNode("Moment"),
            parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw')], undefined,
                f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createIdentifier("moment"), undefined, [f.createIdentifier("raw"), f.createStringLiteral("hh:mm:ss")])
            )
        },
        [pgBuiltins.timetz]: {
            type: (f) => f.createTypeReferenceNode("Moment"),
            parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw')], undefined,
                f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createIdentifier("moment"), undefined, [f.createIdentifier("raw"), f.createStringLiteral("hh:mm:ssZ")])
            )
        },
    },
    "currency.js": {
        [pgBuiltins.money]: {
            type: (f) => f.createTypeReferenceNode("currency"),
            parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw', undefined, f.createToken(ts.SyntaxKind.StringKeyword))], undefined,
                f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createIdentifier("currency"), undefined, [f.createIdentifier("raw")])
            )
        }
    },
}