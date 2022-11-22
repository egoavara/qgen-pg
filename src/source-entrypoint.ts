
import ts from "typescript"
import { ExtensionImport } from "./extension.js"
import { PgType } from "./load-pgtype.js"
import { PgToTsConfig, pgToTsParser, pgToTsType } from "./pg-to-ts.js"
import { RunPgTypeOutput } from "./program.js"

const EntrypointHeader = `import { sqlfn, PrimitiveParser as PP, ArrayParser as AP, CompositeParser as CP } from "sqlfn";`
export const createEntrypointSource = (filepath: string, pgtypes: RunPgTypeOutput, option: PgToTsConfig) => {
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
                    ...(option.extension.map(v => { return ExtensionImport[v](factory) }).flat()),
                    // 
                    ...(Object.values(typEachNamespace)),
                    typTotal,
                    argdef,
                    factory.createExportDefault(factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                            factory.createCallExpression(factory.createIdentifier('sqlfn'), undefined, [factory.createStringLiteral("type")]),
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