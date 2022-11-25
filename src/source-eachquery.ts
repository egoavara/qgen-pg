import ts from "typescript"
import * as l from "./lang.js"
import { RunEachQueryField, RunEachQueryOutput } from "./program.js"

const helpIdentifier = (f: ts.NodeFactory, first: string, ...args: (string | number)[]): ts.Expression => {
    if (args.length === 0) {
        return f.createIdentifier(first)
    }
    const last = args[args.length - 1]
    if (typeof last === 'number') {
        if (!Number.isFinite(last)) {
            throw new Error("number must be finite")
        }
        return f.createElementAccessExpression(helpIdentifier(f, first, ...args.slice(0, args.length - 1)), last)
    }

    return f.createPropertyAccessExpression(helpIdentifier(f, first, ...args.slice(0, args.length - 1)), last)
}

// function nullableType(ctx: ts.TransformationContext, notNull: boolean, ori: ts.TypeNode, nullType?: 'null' | 'undefined'): ts.TypeNode {
//     if (!notNull) {
//         if (nullType === 'undefined') {
//             return ctx.factory.createUnionTypeNode([ori, ctx.factory.createToken(ts.SyntaxKind.UndefinedKeyword)])
//         }
//         return ctx.factory.createUnionTypeNode([ori, ctx.factory.createLiteralTypeNode(ctx.factory.createNull())])
//     }
//     return ori
// }

function nullableType(notNull: boolean, ori: l.ExprType, nullType?: 'null' | 'undefined'): l.ExprType {
    if (!notNull) {
        if (nullType === 'undefined') {
            return l.ExprTypeUnion(ori, l.ExprTypeLiteral(undefined))
        }
        return l.ExprTypeUnion(ori, l.ExprTypeLiteral(null))
    }
    return ori
}


// export const eachQuery = (ctx: ts.TransformationContext, runEachQuery: RunEachQueryOutput, ep: string): ts.Statement[] => {
//     const { factory } = ctx
//     // Pick<pg.Client, "query">
//     const connCompatible = factory.createTypeReferenceNode("Pick", [
//         factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier("pg"), factory.createIdentifier("Client"))),
//         factory.createLiteralTypeNode(factory.createStringLiteral('query'))
//     ])
//     // 각 필드를 이름단위로 묶음
//     const fieldsGroupByName = Object.fromEntries(runEachQuery.fields.map(({ name }) => [name, [] as RunEachQueryField[]]))
//     for (const field of runEachQuery.fields) {
//         fieldsGroupByName[field.name].push(field)
//     }
//     // 각 필드의 배열상 위치를 집계
//     const eachinto: Record<string, number | number[]> = {}
//     for (const [name, typs] of Object.entries(fieldsGroupByName)) {
//         if (name === "?column?") {
//             for (const [i, typ] of typs.entries()) {
//                 eachinto[i.toString()] = typ.index
//             }
//             continue
//         }
//         if (typs.length === 1) {
//             eachinto[name] = typs[0].index
//         } else {
//             eachinto[name] = typs.map(v => v.index)
//         }
//     }
//     // ====================================================================
//     const functionBlock: ts.Statement[] = []
//     // const result = await conn.query({ ... })
//     functionBlock.push(factory.createVariableStatement(undefined, factory.createVariableDeclarationList([
//         factory.createVariableDeclaration(
//             'result', undefined, undefined,
//             factory.createAwaitExpression(factory.createCallExpression(
//                 factory.createPropertyAccessExpression(factory.createIdentifier('conn'), 'query'),
//                 undefined,
//                 [
//                     factory.createObjectLiteralExpression([
//                         factory.createPropertyAssignment('rowMode', factory.createStringLiteral("array")),
//                         factory.createPropertyAssignment('name', factory.createStringLiteral(runEachQuery.name)),
//                         factory.createPropertyAssignment('text', factory.createStringLiteral(runEachQuery.text)),
//                         // 입력값이 존재하는지 여부에 따라서 존재할수도 존재하지 않을 수 도 있는 ast
//                         ...(runEachQuery.inputs.length > 0 ? [
//                             factory.createPropertyAssignment('values', factory.createArrayLiteralExpression(
//                                 runEachQuery.inputs.map(v => factory.createPropertyAccessExpression(factory.createIdentifier('input'), v.key))
//                             ))
//                         ] : []),
//                         //
//                         factory.createPropertyAssignment('types', factory.createIdentifier('_SQLFN_EP')),
//                     ])
//                 ]
//             ))
//         )
//     ], ts.NodeFlags.Const)))
//     switch (runEachQuery.mode) {
//         case "first":
//             // if(result.rowCount < 1) return undefined
//             functionBlock.push(factory.createIfStatement(
//                 factory.createLessThan(helpIdentifier(factory, "result", "rowCount"), factory.createNumericLiteral(1)),
//                 factory.createReturnStatement(factory.createIdentifier("undefined"))
//             ))
//             functionBlock.push(factory.createReturnStatement(factory.createObjectLiteralExpression(Object.entries(eachinto).map(([name, idx]) => {
//                 return factory.createPropertyAssignment(
//                     factory.createStringLiteral(name),
//                     Array.isArray(idx)
//                         ? factory.createArrayLiteralExpression(idx.map((i) => helpIdentifier(factory, "result", "rows", i)))
//                         : helpIdentifier(factory, "result", "rows", 0, idx)
//                 )
//             }))))
//             break
//         case "option":
//             // if(result.rowCount > 1) throw Error("must be 0 or 1 row count")
//             functionBlock.push(factory.createIfStatement(
//                 factory.createGreaterThan(helpIdentifier(factory, "result", "rowCount"), factory.createNumericLiteral(1)),
//                 factory.createThrowStatement(factory.createCallExpression(factory.createIdentifier("Error"), undefined, [factory.createStringLiteral(`must be 0 or 1 row count`)]))
//             ))
//             // if(result.rowCount < 1) return undefined
//             functionBlock.push(factory.createIfStatement(
//                 factory.createLessThan(helpIdentifier(factory, "result", "rowCount"), factory.createNumericLiteral(1)),
//                 factory.createReturnStatement(factory.createIdentifier("undefined"))
//             ))
//             functionBlock.push(factory.createReturnStatement(factory.createObjectLiteralExpression(Object.entries(eachinto).map(([name, idx]) => {
//                 return factory.createPropertyAssignment(
//                     factory.createStringLiteral(name),
//                     Array.isArray(idx)
//                         ? factory.createArrayLiteralExpression(idx.map((i) => helpIdentifier(factory, "result", "rows", i)))
//                         : helpIdentifier(factory, "result", "rows", 0, idx)
//                 )
//             }))))
//             break
//         case "void":
//             // return
//             functionBlock.push(factory.createReturnStatement())
//             break
//         default:
//             if (Number.isFinite(runEachQuery.mode)) {
//                 // if(result.rowCount !== <mode>) throw Error("not expected row count <mode>")
//                 functionBlock.push(factory.createIfStatement(
//                     factory.createStrictInequality(helpIdentifier(factory, "result", "rowCount"), factory.createNumericLiteral(runEachQuery.mode)),
//                     factory.createThrowStatement(factory.createCallExpression(factory.createIdentifier("Error"), undefined, [factory.createStringLiteral(`not expected row count ${runEachQuery.mode}`)]))
//                 ))
//             }
//             // const transformedRows: any = result.rows.map($1)
//             functionBlock.push(factory.createVariableStatement(undefined, factory.createVariableDeclarationList([
//                 factory.createVariableDeclaration(
//                     'transformedRows',
//                     undefined,
//                     factory.createToken(ts.SyntaxKind.AnyKeyword),
//                     factory.createCallExpression(
//                         helpIdentifier(factory, "result", "rows", "map"),
//                         undefined,
//                         [
//                             // $1 : (raw)=>{ ... }
//                             factory.createArrowFunction(
//                                 undefined,
//                                 undefined,
//                                 [factory.createParameterDeclaration(undefined, undefined, 'raw')],
//                                 undefined,
//                                 factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
//                                 factory.createBlock([
//                                     factory.createReturnStatement(factory.createObjectLiteralExpression(Object.entries(eachinto).map(([name, idx]) => {
//                                         return factory.createPropertyAssignment(
//                                             factory.createStringLiteral(name),
//                                             Array.isArray(idx)
//                                                 ? factory.createArrayLiteralExpression(idx.map((i) => helpIdentifier(factory, "raw", i)))
//                                                 : helpIdentifier(factory, "raw", idx)
//                                         )
//                                     })))
//                                 ]),
//                             ),
//                         ]
//                     ))
//             ], ts.NodeFlags.Const)))
//             // return transformedRows
//             functionBlock.push(factory.createReturnStatement(factory.createIdentifier('transformedRows')))
//             break
//     }
//     // ====================================================================
//     // export namespace <name> { ... }
//     const namespaceBlock: ts.Statement[] = []
//     if (runEachQuery.inputs.length > 0) {
//         // export interface Input { ... }
//         namespaceBlock.push(factory.createInterfaceDeclaration([factory.createModifier(ts.SyntaxKind.ExportKeyword)], 'Input', undefined, undefined,
//             runEachQuery.inputs.map(({ key, type }) => {
//                 return factory.createPropertySignature(undefined, key, undefined, type)
//             })
//         ))
//     }

//     // export interface Output { ... }
//     namespaceBlock.push(factory.createInterfaceDeclaration([factory.createModifier(ts.SyntaxKind.ExportKeyword)], 'Output', undefined, undefined,
//         [
//             ...Object.entries(fieldsGroupByName).map(([name, eaches]) => {
//                 if (name === "?column?") {
//                     return eaches.map((each, i) => {
//                         return factory.createPropertySignature(
//                             undefined,
//                             factory.createStringLiteral(i.toString()),
//                             undefined,
//                             nullableType(ctx, each.notNull ?? false, factory.createImportTypeNode(
//                                 factory.createLiteralTypeNode(factory.createStringLiteral("@egoavara/sqlfn")),
//                                 undefined,
//                                 factory.createIdentifier("TypeParser"),
//                                 [
//                                     factory.createIndexedAccessTypeNode(
//                                         factory.createImportTypeNode(factory.createLiteralTypeNode(factory.createStringLiteral(ep)), undefined, undefined, undefined, true),
//                                         factory.createLiteralTypeNode(factory.createStringLiteral('default')),
//                                     ),
//                                     factory.createLiteralTypeNode(factory.createStringLiteral(each.type.namespace)),
//                                     factory.createLiteralTypeNode(factory.createStringLiteral(each.type.name)),
//                                 ]
//                             )),
//                             // pgToTsTuple(eaches.map((v) => {
//                             //     return [v.type, v.notNull ?? false]
//                             // }), { pgNullToTs: 'null', mapping })(ctx)
//                         )
//                     })
//                 }
//                 if (eaches.length > 1) {
//                     return [factory.createPropertySignature(
//                         undefined,
//                         factory.createStringLiteral(name),
//                         undefined,
//                         factory.createTupleTypeNode(eaches.map(each => {
//                             return nullableType(ctx, each.notNull ?? false, factory.createImportTypeNode(
//                                 factory.createLiteralTypeNode(factory.createStringLiteral("@egoavara/sqlfn")),
//                                 undefined,
//                                 factory.createIdentifier("TypeParser"),
//                                 [
//                                     factory.createIndexedAccessTypeNode(
//                                         factory.createImportTypeNode(factory.createLiteralTypeNode(factory.createStringLiteral(ep)), undefined, undefined, undefined, true),
//                                         factory.createLiteralTypeNode(factory.createStringLiteral('default')),
//                                     ),
//                                     factory.createLiteralTypeNode(factory.createStringLiteral(each.type.namespace)),
//                                     factory.createLiteralTypeNode(factory.createStringLiteral(each.type.name)),
//                                 ]
//                             ))
//                         }))
//                         // pgToTsTuple(eaches.map((v) => {
//                         //     return [v.type, v.notNull ?? false]
//                         // }), { pgNullToTs: 'null', mapping })(ctx)
//                     )]
//                 }
//                 return [factory.createPropertySignature(
//                     undefined,
//                     factory.createStringLiteral(name),
//                     undefined,
//                     nullableType(ctx, eaches[0].notNull ?? false, factory.createImportTypeNode(
//                         factory.createLiteralTypeNode(factory.createStringLiteral("@egoavara/sqlfn")),
//                         undefined,
//                         factory.createIdentifier("TypeParser"),
//                         [
//                             factory.createIndexedAccessTypeNode(
//                                 factory.createImportTypeNode(factory.createLiteralTypeNode(factory.createStringLiteral(ep)), undefined, undefined, undefined, true),
//                                 factory.createLiteralTypeNode(factory.createStringLiteral('default')),
//                             ),
//                             factory.createLiteralTypeNode(factory.createStringLiteral(eaches[0].type.namespace)),
//                             factory.createLiteralTypeNode(factory.createStringLiteral(eaches[0].type.name)),
//                         ]
//                     )),
//                     // pgToTsTuple(eaches.map((v) => {
//                     //     return [v.type, v.notNull ?? false]
//                     // }), { pgNullToTs: 'null', mapping })(ctx)
//                 )]
//             }).flat(),
//         ]
//     ))
//     // 
//     const inputType = factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier(runEachQuery.name), "Input"))
//     const outputTypeElem = () => factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier(runEachQuery.name), "Output"))
//     let outputType: ts.TypeNode
//     switch (runEachQuery.mode) {
//         case "first":
//             outputType = factory.createUnionTypeNode([outputTypeElem(), factory.createToken(ts.SyntaxKind.UndefinedKeyword)])
//             break
//         case "option":
//             outputType = factory.createUnionTypeNode([outputTypeElem(), factory.createToken(ts.SyntaxKind.UndefinedKeyword)])
//             break
//         case "void":
//             outputType = factory.createToken(ts.SyntaxKind.VoidKeyword)
//             break
//         default:
//             if (Number.isFinite(runEachQuery.mode)) {
//                 outputType = factory.createTypeReferenceNode("FixedArray", [factory.createTupleTypeNode(Array.from(Array(runEachQuery.mode)).map((v) => outputTypeElem()))])
//             } else {
//                 outputType = factory.createTypeReferenceNode("Array", [outputTypeElem()])
//             }
//             break
//     }
//     // 
//     // export async function ${runEachQuery.name}(conn: ${connCompatible}, input: {...}):Promise<{...}[]>{$body}
//     return [
//         factory.createModuleDeclaration([factory.createModifier(ts.SyntaxKind.ExportKeyword)], factory.createIdentifier(runEachQuery.name), factory.createModuleBlock(namespaceBlock)),
//         factory.createFunctionDeclaration(
//             [factory.createModifier(ts.SyntaxKind.ExportKeyword), factory.createModifier(ts.SyntaxKind.AsyncKeyword)], // export
//             undefined, // no asterisk(aka. generator syntax)
//             runEachQuery.name,
//             [],
//             [
//                 // conn : Pick<pg.Client, "query">
//                 factory.createParameterDeclaration([], undefined, 'conn', undefined, connCompatible, undefined),
//                 // 입력값 존재 여부에 따라서 존재하지 않을 수도 있는 ast 요소
//                 // input : {...}
//                 ...(
//                     runEachQuery.inputs.length > 0
//                         ? [factory.createParameterDeclaration([], undefined, 'input', undefined, inputType, undefined),]
//                         : []
//                 )
//             ],
//             factory.createTypeReferenceNode("Promise", [outputType]),
//             // $body : { ... }
//             factory.createBlock(functionBlock, true),
//         ),

//     ]
// }




export const QueryHeader = (ep: string) => {
    return l.LangFile(
        l.StatementImport("_SQLFN_EP", ep),
        l.StatementImportType(["FixedArray"], "@egoavara/sqlfn"),
        l.StatementImportType("pg", "pg"),
    )
}

export module QuerySource {
    export const Header = (ep: string) => {
        return l.LangFile(
            l.StatementImport("_SQLFN_EP", ep),
            l.StatementImportType(["FixedArray"], "@egoavara/sqlfn"),
            l.StatementImportType("pg", "pg"),
        )
    }
    export const Define = (ep: string, e: RunEachQueryOutput) => {
        // 각 필드를 이름단위로 묶음
        const fieldsGroupByName: Record<string, RunEachQueryField[]> = {}
        for (const field of e.fields) {
            if (!Array.isArray(fieldsGroupByName[field.name])) {
                fieldsGroupByName[field.name] = []
            }
            fieldsGroupByName[field.name].push(field)
        }
        if (Array.isArray(fieldsGroupByName['?column?'])) {
            for (const [i, v] of fieldsGroupByName['?column?'].entries()) {
                fieldsGroupByName[i.toString()] = [v]
            }
            delete fieldsGroupByName['?column?']
        }
        return l.LangFile(l.StatementModule(["export"], e.name, l.Block(
            l.StatementInterface(["export"], "Input", e.inputs.map(({ key, type }) => {
                return [key, type]
            })),
            l.StatementInterface(["export"], "Output", Object.entries(fieldsGroupByName).map(([name, eaches]): [string, l.ExprType][] => {
                if (eaches.length > 1) {
                    return [
                        [name, l.ExprTypeTuple(...eaches.map((each) => {
                            return nullableType(each.notNull ?? false,
                                l.ExprTypeReference(
                                    l.ExprTypeAccess(l.ExprTypeImport("@egoavara/sqlfn"), "TypeParser"),
                                    [
                                        l.ExprTypeAccess(
                                            l.ExprTypeTypeof(l.ExprTypeImport(ep)),
                                            l.ExprTypeLiteral("default"),
                                        ),
                                        l.ExprTypeLiteral(each.type.namespace),
                                        l.ExprTypeLiteral(each.type.name),
                                    ]
                                ),
                            )
                        }))]
                    ]
                }
                return [
                    [name, nullableType(eaches[0].notNull ?? false,
                        l.ExprTypeReference(
                            l.ExprTypeAccess(l.ExprTypeImport("@egoavara/sqlfn"), "TypeParser"),
                            [
                                l.ExprTypeAccess(
                                    l.ExprTypeTypeof(l.ExprTypeImport(ep)),
                                    l.ExprTypeLiteral("default"),
                                ),
                                l.ExprTypeLiteral(eaches[0].type.namespace),
                                l.ExprTypeLiteral(eaches[0].type.name),
                            ]
                        ),
                    )]
                ]
            }).flat()),
        )))
    }
    export const OutputType = (m: RunEachQueryOutput["mode"], each: l.ExprType) => {
        switch (m) {
            case "first":
                return l.ExprTypeUnion(each, l.ExprTypeLiteral(undefined))
            case "option":
                return l.ExprTypeUnion(each, l.ExprTypeLiteral(undefined))
            case "void":
                return l.ExprTypeKeyword("void")
            default:
                if (Number.isFinite(m)) {
                    return l.ExprTypeTuple(...Array.from(Array(m)).map(() => each))
                }
                return l.ExprTypeReference(l.ExprTypeAccess("Array"), [each])
        }

    }
    export const Implement = (e: RunEachQueryOutput) => {
        const fieldsGroupByName: Record<string, RunEachQueryField[]> = {}
        for (const field of e.fields) {
            if (!Array.isArray(fieldsGroupByName[field.name])) {
                fieldsGroupByName[field.name] = []
            }
            fieldsGroupByName[field.name].push(field)
        }
        if (Array.isArray(fieldsGroupByName['?column?'])) {
            for (const [i, v] of fieldsGroupByName['?column?'].entries()) {
                fieldsGroupByName[i.toString()] = [v]
            }
            delete fieldsGroupByName['?column?']
        }

        return l.LangFile(
            l.StatementFunction(["export", "async"], e.name,
                l.ExprTypeFunction(
                    l.ExprTypeReference(l.ExprTypeAccess("Promise"), [
                        OutputType(e.mode, l.ExprTypeAccess(e.name, 'Output'))
                    ]),
                    [
                        ["conn", l.ExprTypeReference(l.ExprTypeAccess("Pick"), [l.ExprTypeAccess("pg", "Client"), l.ExprTypeLiteral("query")])],
                        ["input", l.ExprTypeAccess(e.name, "Input")],
                    ],
                ),
                l.Block(
                    "run",
                    l.StatementVariable("const", "result", undefined,
                        l.ExprValueAwait(l.ExprValueCall(l.ExprValueIdentifier("conn", "query"), [
                            l.ExprValueObject([
                                ["rowMode", l.ExprValueLiteral("array")],
                                ["name", l.ExprValueLiteral(e.name)],
                                ["text", l.ExprValueLiteral(e.text)],
                                ["types", l.ExprValueIdentifier("_SQLFN_EP")],
                            ])
                        ]))
                    ),
                    // 조건부 체크
                    ...([
                        e.mode === 'first' ? [
                            l.StatementIf(l.ExprValueBinaryOp(l.ExprValueIdentifier("result", "rowCount"), "<", l.ExprValueLiteral(1)), l.Block(
                                l.StatementReturn(l.ExprValueLiteral(undefined)),
                            )),
                            l.StatementReturn(l.ExprValueObject(
                                Object.entries(fieldsGroupByName).map(([k, v]) => {
                                    if (v.length === 1) {
                                        return [k, l.ExprValueIdentifier(l.ExprValueIdentifier('result', 'rows', 0, v[0].index))]
                                    }

                                    return [
                                        k,
                                        l.ExprValueArray(v.map(v2 => {
                                            return l.ExprValueIdentifier(l.ExprValueIdentifier('result', 'rows', 0, v2.index))
                                        }))
                                    ]
                                })
                            ))
                        ] : [],
                        e.mode === 'option' ? [
                            l.StatementIf(l.ExprValueBinaryOp(l.ExprValueIdentifier("result", "rowCount"), ">", l.ExprValueLiteral(1)), l.Block(
                                l.StatementThrow(l.ExprValueCall(l.ExprValueIdentifier("Error"), [l.ExprValueLiteral(`not expected more than 1 row`)]))
                            )),
                            l.StatementIf(l.ExprValueBinaryOp(l.ExprValueIdentifier("result", "rowCount"), "===", l.ExprValueLiteral(0)), l.Block(
                                l.StatementReturn(l.ExprValueLiteral(undefined)),
                            )),
                            l.StatementReturn(l.ExprValueObject(
                                Object.entries(fieldsGroupByName).map(([k, v]) => {
                                    if (v.length === 1) {
                                        return [k, l.ExprValueIdentifier(l.ExprValueIdentifier('result', 'rows', 0, v[0].index))]
                                    }
                                    return [
                                        k,
                                        l.ExprValueArray(v.map(v2 => {
                                            return l.ExprValueIdentifier(l.ExprValueIdentifier('result', 'rows', 0, v2.index))
                                        }))
                                    ]
                                })
                            )),
                        ] : [],
                        e.mode === 'void' ? [l.StatementReturn()] : [],
                        Number.isFinite(e.mode) ? [
                            l.StatementIf(l.ExprValueBinaryOp(l.ExprValueIdentifier("result", "rowCount"), "!==", l.ExprValueLiteral(e.mode)), l.Block(
                                l.StatementThrow(l.ExprValueCall(l.ExprValueIdentifier("Error"), [l.ExprValueLiteral(`not expected row count ${e.mode}`)]))
                            ))] : [],
                        // 
                        typeof e.mode === 'number' ? [
                            l.StatementVariable("const", "transformed", l.ExprTypeKeyword("any"),
                                l.ExprValueCall(
                                    l.ExprValueIdentifier("result", "rows", "map"),
                                    [
                                        l.ExprValueArrowFunction(['raw'], l.Block(
                                            l.StatementReturn(l.ExprValueObject(
                                                Object.entries(fieldsGroupByName).map(([k, v]) => {
                                                    if (v.length === 1) {
                                                        return [k, l.ExprValueIdentifier(l.ExprValueIdentifier('raw', v[0].index))]
                                                    }

                                                    return [
                                                        k,
                                                        l.ExprValueArray(v.map(v2 => {
                                                            return l.ExprValueIdentifier(l.ExprValueIdentifier('raw', v2.index))
                                                        }))
                                                    ]
                                                })
                                            )),
                                        ))
                                    ]
                                )
                            ),
                            l.StatementReturn(
                                l.ExprValueIdentifier("transformed")
                            )
                        ] : [],
                    ]).flat(),
                    // 

                )
            ),
        )
    }
}