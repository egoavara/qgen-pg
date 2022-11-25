import * as l from "./lang.js"
import { pgBuiltins } from "./pg-builtins.js"
import { Define } from "./pg-to-ts.js"
export type Extension = ("bigint" | "bignumber.js" | "moment" | "currency.js")
export const ExtensionImport: Record<Extension, () => l.DefineStatement[]> = {
    "bigint": () => [],
    "bignumber.js": () => ([l.StatementImport(["BigNumber"], "bignumber.js")]),
    "moment": () => ([l.StatementImport("moment", ["Moment", "Duration"], "moment")]),
    "currency.js": () => ([l.StatementImport("currency", "currency.js")]),
}
export const ExtensionDefine: Record<Extension, Define> = {
    "bigint": {
        [pgBuiltins.int8]: { type: () => l.ExprTypeKeyword("bigint"), parser: () => l.ExprValueIdentifier("PP", "parseBigInteger") }
    },
    "bignumber.js": {
        [pgBuiltins.numeric]: { type: () => l.ExprTypeAccess("BigNumber"), parser: () => l.ExprValueIdentifier("BigNumber") }
    },
    "moment": {
        [pgBuiltins.date]: {
            type: () => l.ExprTypeAccess("Moment"),
            parser: () => l.ExprValueArrowFunction(
                [["raw", l.ExprTypeKeyword("string")]],
                l.ExprValueCall(l.ExprValueIdentifier("moment"), [l.ExprValueIdentifier("raw"), l.ExprValueLiteral("YYYY-MM-DD")]),
            )
        },
        [pgBuiltins.timestamp]: {
            type: () => l.ExprTypeAccess("Moment"),
            parser: () => l.ExprValueArrowFunction(
                [["raw", l.ExprTypeKeyword("string")]],
                l.ExprValueCall(l.ExprValueIdentifier("moment"), [l.ExprValueIdentifier("raw"), l.ExprValueLiteral("YYYY-MM-DD hh:mm:ss")]),
            )
        },
        [pgBuiltins.timestamptz]: {
            type: () => l.ExprTypeAccess("Moment"),
            parser: () => l.ExprValueArrowFunction(
                [["raw", l.ExprTypeKeyword("string")]],
                l.ExprValueCall(l.ExprValueIdentifier("moment"), [l.ExprValueIdentifier("raw"), l.ExprValueLiteral("YYYY-MM-DD hh:mm:ssZ")]),
            )
        },
        [pgBuiltins.time]: {
            type: () => l.ExprTypeAccess("Moment"),
            parser: () => l.ExprValueArrowFunction(
                [["raw", l.ExprTypeKeyword("string")]],
                l.ExprValueCall(l.ExprValueIdentifier("moment"), [l.ExprValueIdentifier("raw"), l.ExprValueLiteral("hh:mm:ss")]),
            )
        },
        [pgBuiltins.timetz]: {
            type: () => l.ExprTypeAccess("Moment"),
            parser: () => l.ExprValueArrowFunction(
                [["raw", l.ExprTypeKeyword("string")]],
                l.ExprValueCall(l.ExprValueIdentifier("moment"), [l.ExprValueIdentifier("raw"), l.ExprValueLiteral("hh:mm:ssZ")]),
            )
        },
    },
    "currency.js": {
        [pgBuiltins.money]: {
            type: () => l.ExprTypeAccess("currency"),
            parser: () => l.ExprValueArrowFunction([["raw", l.ExprTypeKeyword("string")]], l.ExprValueCall(l.ExprValueIdentifier("currency"), [l.ExprValueIdentifier("raw")]))
        }
    },
}