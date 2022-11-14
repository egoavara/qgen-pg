#!/usr/bin/env node
const { Program } = require("../lib/program.js");
const fsp = require("fs/promises");
const path = require("path");
const program = new Program({
    entrypoint: 'src/qgen.ep.ts',
    output: './src',
    pgPassword: 'test'
});
(async () => {
    const [
        pgTypes,
        pgTables,
    ] = await Promise.all([
        program.runPgType(),
        program.runPgTable(),
    ])
    const runSource = await program.runSource(pgTypes)
    const runQuery = await program.runQuery(pgTypes, pgTables, runSource)
    const runBuild = await program.runBuild(runQuery, runSource)
    await Promise.all(Object.entries(runBuild).map(async ([filepath, text]) => {
        console.log(filepath)
        await fsp.mkdir(path.dirname(filepath), { recursive: true })
        await fsp.writeFile(filepath, text)
    }))
    program.exit()
})();
// const ts = require('typescript');
// const src = ts.createSourceFile("./test.ts", `
// type D = typeof import("qgen")
// `, ts.ScriptTarget.ESNext)
// const printer = ts.createPrinter({})

// const result = ts.transform(src, [
//     (ctx) => {
//         const { factory } = ctx
//         return node => {
//             if (!ts.isSourceFile(node)) {
//                 throw new Error("unreachable")
//             }
//             console.log(node.statements[0].type)
//             ts.SyntaxKind
//             return factory.updateSourceFile(
//                 node,
//                 [
//                     // hello,
//                     ...node.statements,
//                 ],
//             )
//         }
//     }
// ])
// console.log(printer.printFile(result.transformed[0]))