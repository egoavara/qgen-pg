#!/usr/bin/env node

const { fromFileToTypescript, LangFile, StatementImport, StatementFunction, ExprTypeFunction, ExprTypeReference, ExprTypeObject, ExprTypeKeyword, Block, ExprTypeAccess, ExprTypeLiteral, ExprTypeUnion, StatementVariable, ExprValueLiteral, ExprValueCall, ExprValueIdentifier, ExprValueObject, ExprValueAwait, StatementReturn, ExprValueArrowFunction, StatementModule, StatementInterface, StatementIf, ExprValueBinaryOp, StatementThrow } = require("@egoavara/sqlfn")
console.log(
    fromFileToTypescript(
        LangFile(
            StatementImport(undefined, ["sqlfn", ["PrimitiveParser", "PP"], ["ArrayParser", "AP"], ["CompositeParser", "CP"]], "@egoavara/sqlfn"),
            StatementImport("moment", "moment"),
            StatementImport("bignumber", "bignumber.js"),
            StatementImport("currency", "currency.js"),
            StatementFunction(
                ["export", "async"],
                "hello",
                ExprTypeFunction(
                    ExprTypeReference("Promise", [
                        ExprTypeReference("Array", [ExprTypeAccess('hello', 'Output')])
                    ]),
                    [
                        ["conn", ExprTypeReference("Pick", [ExprTypeAccess("pg", "Conn"), ExprTypeUnion(ExprTypeLiteral("query"))])],
                        ["input", ExprTypeAccess("hello", "Input")],
                    ],
                ),
                Block(
                    StatementVariable(
                        "const",
                        "result",
                        undefined,
                        ExprValueAwait(ExprValueCall(ExprValueIdentifier("conn", "query"), [
                            ExprValueObject([
                                ["rowMode", ExprValueLiteral("array")],
                                ["name", ExprValueLiteral("hello1")],
                                ["text", ExprValueLiteral("select * from test")],
                                ["types", ExprValueIdentifier("_SQLFN_EP")],
                            ])
                        ]))
                    ),
                    StatementIf(ExprValueBinaryOp(ExprValueIdentifier("row", "rowCount"), ">=", ExprValueLiteral(1)), Block(
                        StatementThrow(ExprValueCall(ExprValueIdentifier("Error"), [ExprTypeLiteral("expected more than one")]))
                    )),
                    StatementVariable(
                        "const",
                        "transformed",
                        undefined,
                        ExprValueCall(
                            ExprValueIdentifier("result.rows.map"),
                            [
                                ExprValueArrowFunction(['raw'], Block(
                                    StatementReturn(ExprValueObject([
                                        ['a', ExprValueIdentifier('raw', 1)],
                                        ['b', ExprValueIdentifier('raw', 2)],
                                    ]))
                                    ,
                                ))
                            ]
                        )
                    ),
                    StatementReturn(
                        ExprValueIdentifier("transformed")
                    )
                )
            ),
            StatementModule(["export"], 'hello', Block(
                StatementInterface(["export"], "Input", []),
                StatementInterface(["export"], "Output", [
                    ["a", ExprTypeKeyword("string")],
                    ["b", ExprTypeKeyword("number")],
                ]),
            )),
        ),

    )
)
