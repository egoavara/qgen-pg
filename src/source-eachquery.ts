import ts from "typescript"
import { RunEachQueryField, RunEachQueryOutput } from "./program.js"

function nullableType(ctx: ts.TransformationContext, notNull: boolean, ori: ts.TypeNode, nullType?: 'null' | 'undefined'): ts.TypeNode {
    if (!notNull) {
        if (nullType === 'undefined') {
            return ctx.factory.createUnionTypeNode([ori, ctx.factory.createToken(ts.SyntaxKind.UndefinedKeyword)])
        }
        return ctx.factory.createUnionTypeNode([ori, ctx.factory.createLiteralTypeNode(ctx.factory.createNull())])
    }
    return ori
}

export const eachQuery = (ctx: ts.TransformationContext, runEachQuery: RunEachQueryOutput, ep: string) => {
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
    const eachinto: Record<string, number | number[]> = Object.fromEntries(runEachQuery.fields.map(({ name }) => [name, -1]))
    for (const [name, typs] of Object.entries(fieldsGroupByName)) {
        if (typs.length === 1) {
            eachinto[name] = typs[0].index
        } else {
            eachinto[name] = typs.map(v => v.index)
        }
    }

    // 
    // export async function ${runEachQuery.name}(conn: ${connCompatible}, input: {...}):Promise<{...}[]>{$body}
    return factory.createFunctionDeclaration(
        [factory.createModifier(ts.SyntaxKind.ExportKeyword), factory.createModifier(ts.SyntaxKind.AsyncKeyword)], // export
        undefined, // no asterisk(aka. generator syntax)
        runEachQuery.name,
        [],
        [
            // conn : Pick<pg.Client, "query">
            factory.createParameterDeclaration([], undefined, 'conn', undefined, connCompatible, undefined),
            // input : {...}
            factory.createParameterDeclaration([], undefined, 'input', undefined,
                factory.createTypeLiteralNode(
                    runEachQuery.inputs.map(({ key, type }) => {
                        return factory.createPropertySignature(undefined, key, factory.createToken(ts.SyntaxKind.QuestionToken), type)
                    })
                ),
                undefined),
        ],
        factory.createTypeReferenceNode("Promise", [
            factory.createArrayTypeNode(
                factory.createTypeLiteralNode(
                    Object.entries(fieldsGroupByName).map(([name, eaches]) => {
                        if (eaches.length !== 1) {
                            throw Error()
                        }
                        return factory.createPropertySignature(
                            undefined,
                            factory.createStringLiteral(name),
                            undefined,
                            nullableType(ctx, eaches[0].notNull ?? false, factory.createImportTypeNode(
                                factory.createLiteralTypeNode(factory.createStringLiteral('qgen')),
                                undefined,
                                factory.createIdentifier("QgenTypeParser"),
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
                        )
                    })
                )
            )
        ]),
        // $body : { ... }
        factory.createBlock([
            // const result = await conn.query({ ... })
            factory.createVariableStatement(undefined, factory.createVariableDeclarationList([
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
                                factory.createPropertyAssignment('values', factory.createArrayLiteralExpression(
                                    runEachQuery.inputs.map(v => factory.createPropertyAccessExpression(factory.createIdentifier('input'), v.key))
                                )),
                                factory.createPropertyAssignment('types', factory.createIdentifier('_QGEN_EP')),
                            ])
                        ]
                    ))
                )
            ], ts.NodeFlags.Const)),
            // const transformedRows: any = result.rows.map($1)
            factory.createVariableStatement(undefined, factory.createVariableDeclarationList([
                factory.createVariableDeclaration(
                    'transformedRows',
                    undefined,
                    factory.createToken(ts.SyntaxKind.AnyKeyword),
                    factory.createCallExpression(
                        factory.createPropertyAccessExpression(factory.createPropertyAccessExpression(factory.createIdentifier('result'), 'rows'), 'map'),
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
                                                ? factory.createArrayLiteralExpression(idx.map((i) => factory.createElementAccessExpression(factory.createIdentifier('raw'), i)))
                                                : factory.createElementAccessExpression(factory.createIdentifier('raw'), idx)
                                        )
                                    })))
                                ]),
                            ),
                        ]
                    ))
            ], ts.NodeFlags.Const)),
            // return transformedRows
            factory.createReturnStatement(factory.createIdentifier('transformedRows'))
        ], true),
    )
}

