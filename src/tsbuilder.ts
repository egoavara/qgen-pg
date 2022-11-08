
import ts from "typescript"

const src = ts.createSourceFile("./test.ts", "", ts.ScriptTarget.ESNext)
const printer = ts.createPrinter({})
const result = ts.transform(src, [
    (ctx) => {
        const { factory } = ctx
        return node => {
            factory.createInterfaceDeclaration(
                [],
                [factory.createModifier(ts.SyntaxKind.ExportKeyword,)],
                'hello',
                [],
                [],
                [
                    factory.createPropertySignature(
                        [],
                        '',
                        factory.createToken(ts.SyntaxKind.QuestionToken),
                        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                    )
                ],
            )
            return node
        }
    }
])
printer.printFile(result.transformed[0])