#!/usr/bin/env node
const ts = require('typescript');
const src = ts.createSourceFile("./test.ts", `
export function test(a : hello.Input): Promise<hello.Output>{
    return undefined
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
            console.log(node.statements[0].body.statements)
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