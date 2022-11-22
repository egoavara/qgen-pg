import ts from "typescript"
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

function nullableType(ctx: ts.TransformationContext, notNull: boolean, ori: ts.TypeNode, nullType?: 'null' | 'undefined'): ts.TypeNode {
    if (!notNull) {
        if (nullType === 'undefined') {
            return ctx.factory.createUnionTypeNode([ori, ctx.factory.createToken(ts.SyntaxKind.UndefinedKeyword)])
        }
        return ctx.factory.createUnionTypeNode([ori, ctx.factory.createLiteralTypeNode(ctx.factory.createNull())])
    }
    return ori
}



export const eachQuery = (ctx: ts.TransformationContext, runEachQuery: RunEachQueryOutput, ep: string): ts.Statement[] => {
    const { factory } = ctx
    // Pick<pg.Client, "query">
    const connCompatible = factory.createTypeReferenceNode("Pick", [
        factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier("pg"), factory.createIdentifier("Client"))),
        factory.createLiteralTypeNode(factory.createStringLiteral('query'))
    ])
    // 각 필드를 이름단위로 묶음
    const fieldsGroupByName = Object.fromEntries(runEachQuery.fields.map(({ name }) => [name, [] as RunEachQueryField[]]))
    for (const field of runEachQuery.fields) {
        fieldsGroupByName[field.name].push(field)
    }
    // 각 필드의 배열상 위치를 집계
    const eachinto: Record<string, number | number[]> = {}
    for (const [name, typs] of Object.entries(fieldsGroupByName)) {
        if(name === "?column?"){
            for(const [i, typ] of typs.entries()){
                eachinto[i.toString()] = typ.index
            }
            continue
        }
        if (typs.length === 1) {
            eachinto[name] = typs[0].index
        } else {
            eachinto[name] = typs.map(v => v.index)
        }
    }
    // ====================================================================
    const functionBlock: ts.Statement[] = []
    // const result = await conn.query({ ... })
    functionBlock.push(factory.createVariableStatement(undefined, factory.createVariableDeclarationList([
        factory.createVariableDeclaration(
            'result', undefined, undefined,
            factory.createAwaitExpression(factory.createCallExpression(
                factory.createPropertyAccessExpression(factory.createIdentifier('conn'), 'query'),
                undefined,
                [
                    factory.createObjectLiteralExpression([
                        factory.createPropertyAssignment('rowMode', factory.createStringLiteral("array")),
                        factory.createPropertyAssignment('name', factory.createStringLiteral(runEachQuery.name)),
                        factory.createPropertyAssignment('text', factory.createStringLiteral(runEachQuery.text)),
                        // 입력값이 존재하는지 여부에 따라서 존재할수도 존재하지 않을 수 도 있는 ast
                        ...(runEachQuery.inputs.length > 0 ? [
                            factory.createPropertyAssignment('values', factory.createArrayLiteralExpression(
                                runEachQuery.inputs.map(v => factory.createPropertyAccessExpression(factory.createIdentifier('input'), v.key))
                            ))
                        ] : []),
                        //
                        factory.createPropertyAssignment('types', factory.createIdentifier('_SQLFN_EP')),
                    ])
                ]
            ))
        )
    ], ts.NodeFlags.Const)))
    switch (runEachQuery.mode) {
        case "first":
            // if(result.rowCount < 1) return undefined
            functionBlock.push(factory.createIfStatement(
                factory.createLessThan(helpIdentifier(factory, "result", "rowCount"), factory.createNumericLiteral(1)),
                factory.createReturnStatement(factory.createIdentifier("undefined"))
            ))
            functionBlock.push(factory.createReturnStatement(factory.createObjectLiteralExpression(Object.entries(eachinto).map(([name, idx]) => {
                return factory.createPropertyAssignment(
                    factory.createStringLiteral(name),
                    Array.isArray(idx)
                        ? factory.createArrayLiteralExpression(idx.map((i) => helpIdentifier(factory, "result", "rows", i)))
                        : helpIdentifier(factory, "result", "rows", 0, idx)
                )
            }))))
            break
        case "option":
            // if(result.rowCount > 1) throw Error("must be 0 or 1 row count")
            functionBlock.push(factory.createIfStatement(
                factory.createGreaterThan(helpIdentifier(factory, "result", "rowCount"), factory.createNumericLiteral(1)),
                factory.createThrowStatement(factory.createCallExpression(factory.createIdentifier("Error"), undefined, [factory.createStringLiteral(`must be 0 or 1 row count`)]))
            ))
            // if(result.rowCount < 1) return undefined
            functionBlock.push(factory.createIfStatement(
                factory.createLessThan(helpIdentifier(factory, "result", "rowCount"), factory.createNumericLiteral(1)),
                factory.createReturnStatement(factory.createIdentifier("undefined"))
            ))
            functionBlock.push(factory.createReturnStatement(factory.createObjectLiteralExpression(Object.entries(eachinto).map(([name, idx]) => {
                return factory.createPropertyAssignment(
                    factory.createStringLiteral(name),
                    Array.isArray(idx)
                        ? factory.createArrayLiteralExpression(idx.map((i) => helpIdentifier(factory, "result", "rows", i)))
                        : helpIdentifier(factory, "result", "rows", 0, idx)
                )
            }))))
            break
        case "void":
            // return
            functionBlock.push(factory.createReturnStatement())
            break
        default:
            if (Number.isFinite(runEachQuery.mode)) {
                // if(result.rowCount !== <mode>) throw Error("not expected row count <mode>")
                functionBlock.push(factory.createIfStatement(
                    factory.createStrictInequality(helpIdentifier(factory, "result", "rowCount"), factory.createNumericLiteral(runEachQuery.mode)),
                    factory.createThrowStatement(factory.createCallExpression(factory.createIdentifier("Error"), undefined, [factory.createStringLiteral(`not expected row count ${runEachQuery.mode}`)]))
                ))
            }
            // const transformedRows: any = result.rows.map($1)
            functionBlock.push(factory.createVariableStatement(undefined, factory.createVariableDeclarationList([
                factory.createVariableDeclaration(
                    'transformedRows',
                    undefined,
                    factory.createToken(ts.SyntaxKind.AnyKeyword),
                    factory.createCallExpression(
                        helpIdentifier(factory, "result", "rows", "map"),
                        undefined,
                        [
                            // $1 : (raw)=>{ ... }
                            factory.createArrowFunction(
                                undefined,
                                undefined,
                                [factory.createParameterDeclaration(undefined, undefined, 'raw')],
                                undefined,
                                factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                factory.createBlock([
                                    factory.createReturnStatement(factory.createObjectLiteralExpression(Object.entries(eachinto).map(([name, idx]) => {
                                        return factory.createPropertyAssignment(
                                            factory.createStringLiteral(name),
                                            Array.isArray(idx)
                                                ? factory.createArrayLiteralExpression(idx.map((i) => helpIdentifier(factory, "raw", i)))
                                                : helpIdentifier(factory, "raw", idx)
                                        )
                                    })))
                                ]),
                            ),
                        ]
                    ))
            ], ts.NodeFlags.Const)))
            // return transformedRows
            functionBlock.push(factory.createReturnStatement(factory.createIdentifier('transformedRows')))
            break
    }
    // ====================================================================
    // export namespace <name> { ... }
    const namespaceBlock: ts.Statement[] = []
    if (runEachQuery.inputs.length > 0) {
        // export interface Input { ... }
        namespaceBlock.push(factory.createInterfaceDeclaration([factory.createModifier(ts.SyntaxKind.ExportKeyword)], 'Input', undefined, undefined,
            runEachQuery.inputs.map(({ key, type }) => {
                return factory.createPropertySignature(undefined, key, undefined, type)
            })
        ))
    }

    // export interface Output { ... }
    namespaceBlock.push(factory.createInterfaceDeclaration([factory.createModifier(ts.SyntaxKind.ExportKeyword)], 'Output', undefined, undefined,
        [
            ...Object.entries(fieldsGroupByName).map(([name, eaches]) => {
                if(name === "?column?"){
                    return eaches.map((each, i)=>{
                        return factory.createPropertySignature(
                            undefined,
                            factory.createStringLiteral(i.toString()),
                            undefined,
                            nullableType(ctx, each.notNull ?? false, factory.createImportTypeNode(
                                factory.createLiteralTypeNode(factory.createStringLiteral('sqlfn')),
                                undefined,
                                factory.createIdentifier("TypeParser"),
                                [
                                    factory.createIndexedAccessTypeNode(
                                        factory.createImportTypeNode(factory.createLiteralTypeNode(factory.createStringLiteral(ep)), undefined, undefined, undefined, true),
                                        factory.createLiteralTypeNode(factory.createStringLiteral('default')),
                                    ),
                                    factory.createLiteralTypeNode(factory.createStringLiteral(each.type.namespace)),
                                    factory.createLiteralTypeNode(factory.createStringLiteral(each.type.name)),
                                ]
                            )),
                            // pgToTsTuple(eaches.map((v) => {
                            //     return [v.type, v.notNull ?? false]
                            // }), { pgNullToTs: 'null', mapping })(ctx)
                        )
                    })
                }
                if (eaches.length > 1) {
                    return [factory.createPropertySignature(
                        undefined,
                        factory.createStringLiteral(name),
                        undefined,
                        factory.createTupleTypeNode(eaches.map(each => {
                            return nullableType(ctx, each.notNull ?? false, factory.createImportTypeNode(
                                factory.createLiteralTypeNode(factory.createStringLiteral('sqlfn')),
                                undefined,
                                factory.createIdentifier("TypeParser"),
                                [
                                    factory.createIndexedAccessTypeNode(
                                        factory.createImportTypeNode(factory.createLiteralTypeNode(factory.createStringLiteral(ep)), undefined, undefined, undefined, true),
                                        factory.createLiteralTypeNode(factory.createStringLiteral('default')),
                                    ),
                                    factory.createLiteralTypeNode(factory.createStringLiteral(each.type.namespace)),
                                    factory.createLiteralTypeNode(factory.createStringLiteral(each.type.name)),
                                ]
                            ))
                        }))
                        // pgToTsTuple(eaches.map((v) => {
                        //     return [v.type, v.notNull ?? false]
                        // }), { pgNullToTs: 'null', mapping })(ctx)
                    )]
                }
                return [factory.createPropertySignature(
                    undefined,
                    factory.createStringLiteral(name),
                    undefined,
                    nullableType(ctx, eaches[0].notNull ?? false, factory.createImportTypeNode(
                        factory.createLiteralTypeNode(factory.createStringLiteral('sqlfn')),
                        undefined,
                        factory.createIdentifier("TypeParser"),
                        [
                            factory.createIndexedAccessTypeNode(
                                factory.createImportTypeNode(factory.createLiteralTypeNode(factory.createStringLiteral(ep)), undefined, undefined, undefined, true),
                                factory.createLiteralTypeNode(factory.createStringLiteral('default')),
                            ),
                            factory.createLiteralTypeNode(factory.createStringLiteral(eaches[0].type.namespace)),
                            factory.createLiteralTypeNode(factory.createStringLiteral(eaches[0].type.name)),
                        ]
                    )),
                    // pgToTsTuple(eaches.map((v) => {
                    //     return [v.type, v.notNull ?? false]
                    // }), { pgNullToTs: 'null', mapping })(ctx)
                )]
            }).flat(),
        ]
    ))
    // 
    const inputType = factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier(runEachQuery.name), "Input"))
    const outputTypeElem = () => factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier(runEachQuery.name), "Output"))
    let outputType: ts.TypeNode
    switch (runEachQuery.mode) {
        case "first":
            outputType = factory.createUnionTypeNode([outputTypeElem(), factory.createToken(ts.SyntaxKind.UndefinedKeyword)])
            break
        case "option":
            outputType = factory.createUnionTypeNode([outputTypeElem(), factory.createToken(ts.SyntaxKind.UndefinedKeyword)])
            break
        case "void":
            outputType = factory.createToken(ts.SyntaxKind.VoidKeyword)
            break
        default:
            if (Number.isFinite(runEachQuery.mode)) {
                outputType = factory.createTypeReferenceNode("FixedArray", [factory.createTupleTypeNode(Array.from(Array(runEachQuery.mode)).map((v) => outputTypeElem()))])
            } else {
                outputType = factory.createTypeReferenceNode("Array", [outputTypeElem()])
            }
            break
    }
    // 
    // export async function ${runEachQuery.name}(conn: ${connCompatible}, input: {...}):Promise<{...}[]>{$body}
    return [
        factory.createModuleDeclaration([factory.createModifier(ts.SyntaxKind.ExportKeyword)], factory.createIdentifier(runEachQuery.name), factory.createModuleBlock(namespaceBlock)),
        factory.createFunctionDeclaration(
            [factory.createModifier(ts.SyntaxKind.ExportKeyword), factory.createModifier(ts.SyntaxKind.AsyncKeyword)], // export
            undefined, // no asterisk(aka. generator syntax)
            runEachQuery.name,
            [],
            [
                // conn : Pick<pg.Client, "query">
                factory.createParameterDeclaration([], undefined, 'conn', undefined, connCompatible, undefined),
                // 입력값 존재 여부에 따라서 존재하지 않을 수도 있는 ast 요소
                // input : {...}
                ...(
                    runEachQuery.inputs.length > 0
                        ? [factory.createParameterDeclaration([], undefined, 'input', undefined, inputType, undefined),]
                        : []
                )
            ],
            factory.createTypeReferenceNode("Promise", [outputType]),
            // $body : { ... }
            factory.createBlock(functionBlock, true),
        ),

    ]
}

