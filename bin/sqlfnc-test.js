#!/usr/bin/env node
const ts = require('typescript');
const src = ts.createSourceFile("./test.ts", `
export type a = {
    ["hello"] : string
}
`, ts.ScriptTarget.ESNext)
const printer = ts.createPrinter({})

const result = ts.transform(src, [
    (ctx) => {
        const { factory } = ctx
        return node => {
            if (!ts.isSourceFile(node)) {
                throw new Error("unreachable")
            }
            console.log(node.statements[0].type.members)
            ts.SyntaxKind
            return factory.updateSourceFile(
                node,
                [
                    // hello,
                    ...node.statements,
                ],
            )
        }
    }
])

console.log(printer.printFile(result.transformed[0]))