#!/usr/bin/env node
const { Program } = require("../lib/program.js");
const program = new Program({
    entrypoint : 'src/qgen.ep.ts',
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
    for (const [path, text] of Object.entries(runBuild)) {

        console.log("============================================")
        console.log(`: ${path}`)
        console.log(text)
        console.log()
    }
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