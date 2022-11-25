#!/usr/bin/env node

const { fromFileToTypescript, LangFile, StatementImport, StatementFunction, ExprTypeFunction, ExprTypeReference, ExprTypeObject, ExprTypeKeyword, Block, ExprTypeAccess, ExprTypeLiteral, ExprTypeUnion, StatementVariable, ExprValueLiteral, ExprValueCall, ExprValueIdentifier, ExprValueObject, ExprValueAwait, StatementReturn, ExprValueArrowFunction, StatementModule, StatementInterface, StatementIf, ExprValueBinaryOp, StatementThrow } = require("@egoavara/sqlfn")
console.log(
    fromFileToTypescript(
        LangFile(
            StatementImport(undefined, ["sqlfn", ["PrimitiveParser", "PP"], ["ArrayParser", "AP"], ["CompositeParser", "CP"]], "@egoavara/sqlfn"),
            StatementImport("moment", "moment"),
            StatementImport("bignumber", "bignumber.js"),
            StatementImport("currency", "currency.js"),
            
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
