
import ts from "typescript"
import { PgType } from "./load-pgtype.js"
import { pgBuiltins } from "./pg-builtins.js"
import { PgToTsConfig, pgToTsParser, pgToTsType } from "./pg-to-ts.js"
import { RunPgTypeOutput } from "./program.js"
// moment()
const EntrypointHeader = `import { qgen, PrimitiveParser as PP, ArrayParser as AP, CompositeParser as CP } from "qgen";`
export const createEntrypointSource = (filepath: string, pgtypes: RunPgTypeOutput, option: PgToTsConfig) => {
    // 
    if (option.extension.includes("bigint")) {
        option.define[pgBuiltins.int8] = { type: (f) => f.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword), parser: (f) => f.createPropertyAccessExpression(f.createIdentifier("PP"), "parseBigInteger") }
    }
    if (option.extension.includes("bignumber.js")) {
        option.define[pgBuiltins.numeric] = { type: (f) => f.createTypeReferenceNode("BigNumber"), parser: (f) => f.createIdentifier("BigNumber") }
    }
    if (option.extension.includes("moment")) {
        option.define[pgBuiltins.date] = {
            type: (f) => f.createTypeReferenceNode("Moment"),
            parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw')], undefined,
                f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createIdentifier("moment"), undefined, [f.createIdentifier("raw"), f.createStringLiteral("YYYY-MM-DD")])
            )
        }
        option.define[pgBuiltins.timestamp] = {
            type: (f) => f.createTypeReferenceNode("Moment"),
            parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw')], undefined,
                f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createIdentifier("moment"), undefined, [f.createIdentifier("raw"), f.createStringLiteral("YYYY-MM-DD hh:mm:ss")])
            )
        }
        option.define[pgBuiltins.timestamptz] = {
            type: (f) => f.createTypeReferenceNode("Moment"),
            parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw')], undefined,
                f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createIdentifier("moment"), undefined, [f.createIdentifier("raw"), f.createStringLiteral("YYYY-MM-DD hh:mm:ssZ")])
            )
        }
        option.define[pgBuiltins.time] = {
            type: (f) => f.createTypeReferenceNode("Moment"),
            parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw')], undefined,
                f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createIdentifier("moment"), undefined, [f.createIdentifier("raw"), f.createStringLiteral("hh:mm:ss")])
            )
        }
        option.define[pgBuiltins.timetz] = {
            type: (f) => f.createTypeReferenceNode("Moment"),
            parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw')], undefined,
                f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createIdentifier("moment"), undefined, [f.createIdentifier("raw"), f.createStringLiteral("hh:mm:ssZ")])
            )
        }
        // TODO : duration 파서 만들 준비
        // option.define[pgBuiltins.internal] = {
        //     type: (f) => f.createTypeReferenceNode("Duration"),
        //     parser: (f) => f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'raw')], undefined,
        //         f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), f.createCallExpression(f.createPropertyAccessExpression(f.createIdentifier("moment"), "duration"), undefined, [f.createIdentifier("raw"), f.createStringLiteral("hh:mm:ssZ")])
        //     )
        // }
    }
    //
    const groupNs: Record<string, Record<string, PgType>> = {}
    const targetPgTypes: PgType[] = []
    for (const ptyp of Object.values(pgtypes)) {
        if (ptyp.namespace === 'pg_catalog' && ptyp.name.startsWith("pg_")) {
            continue
        }
        if (['information_schema'].includes(ptyp.namespace)) {
            continue
        }
        if (ptyp.type === 'class' && ptyp.relkind !== 'c') {
            continue
        }
        if (ptyp.type === 'array' && ptyp.elem.type === 'class' && ptyp.elem.relkind !== 'c') {
            continue
        }
        if (!(ptyp.namespace in groupNs)) {
            groupNs[ptyp.namespace] = {}
        }
        groupNs[ptyp.namespace][ptyp.name] = ptyp
        targetPgTypes.push(ptyp)
    }
    //
    const file = ts.createSourceFile(filepath, EntrypointHeader, ts.ScriptTarget.ESNext)
    const trans = ts.transform(file, [({ factory }) => {
        return (node) => {
            // =====================================================================================================================
            const typEachNamespace = Object.fromEntries(Object.entries(groupNs).map(([ns, nmmap]) => {
                const nodeElem = Object.entries(nmmap).map(([nm, pgtyp]) => {
                    return factory.createPropertySignature(undefined, factory.createStringLiteral(nm), undefined, pgToTsType(factory, pgtyp, true, option))
                })
                return [
                    ns,
                    factory.createTypeAliasDeclaration(undefined, `PgType_${ns}`, undefined, factory.createTypeLiteralNode(nodeElem)),
                ]
            }))
            const typTotal = factory.createTypeAliasDeclaration(undefined, "PgType", undefined, factory.createTypeLiteralNode(Object.keys(typEachNamespace).map((ns) => {
                return factory.createPropertySignature(undefined, factory.createStringLiteral(ns), undefined, factory.createTypeReferenceNode(`PgType_${ns}`))
            })))
            // =====================================================================================================================
            const argElems = Object.values(targetPgTypes).map((pgtyp) => {
                // oid, namespace, name, parser
                return factory.createArrayLiteralExpression([
                    factory.createNumericLiteral(pgtyp.oid),
                    factory.createStringLiteral(pgtyp.namespace),
                    factory.createStringLiteral(pgtyp.name),
                    pgToTsParser(factory, pgtyp, true, option)
                ])
            })
            const arg = factory.createArrayLiteralExpression(argElems)
            const argdef = factory.createVariableStatement(undefined, factory.createVariableDeclarationList([
                factory.createVariableDeclaration("PgParser", undefined, factory.createToken(ts.SyntaxKind.AnyKeyword), arg)
            ], ts.NodeFlags.Const))
            // =====================================================================================================================
            return factory.updateSourceFile(
                node,
                [
                    ...node.statements,
                    // 
                    ...(option.extension.includes("bignumber.js") ? [
                        factory.createImportDeclaration(undefined, factory.createImportClause(false, undefined, factory.createNamedImports([factory.createImportSpecifier(false, undefined, factory.createIdentifier('BigNumber'))])), factory.createStringLiteral("bignumber.js"))
                    ] : []),
                    ...(option.extension.includes("moment") ? [
                        factory.createImportDeclaration(undefined, factory.createImportClause(false, factory.createIdentifier("moment"), factory.createNamedImports([
                            factory.createImportSpecifier(false, undefined, factory.createIdentifier('Moment')),
                            factory.createImportSpecifier(false, undefined, factory.createIdentifier('Duration')),
                        ])), factory.createStringLiteral("moment"))
                    ] : []),
                    // 
                    ...(Object.values(typEachNamespace)),
                    typTotal,
                    argdef,
                    factory.createExportDefault(factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                            factory.createCallExpression(factory.createIdentifier('qgen'), undefined, []),
                            'setup'
                        ),
                        [
                            factory.createTypeReferenceNode("PgType"),
                        ],
                        [
                            factory.createIdentifier("PgParser")
                        ]
                    ))
                ]
            )
        }
    }])
    return trans.transformed[0]

}