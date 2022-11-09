#!/usr/bin/env node
const { Program } = require("../lib/index.js");
const program = new Program({
    pgPassword: 'test'
});
(async () => {
    console.log("q", await program.sources())
    const [
        runSource,
        pgTypes,
        pgTables,
    ] = await Promise.all([
        program.runSource(),
        program.runPgType(),
        program.runPgTable(),
    ])
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
// export type foo = { "?hello?" : null, b : 'world'}
// `, ts.ScriptTarget.ESNext)
// const printer = ts.createPrinter({})

// // ts.parseJsonConfigFileContent()
// // host.writeFile()
// const result = ts.transform(src, [
//     (ctx) => {
//         const { factory } = ctx
//         return node => {
//             if (!ts.isSourceFile(node)) {
//                 throw new Error("unreachable")
//             }
//             console.log(node.statements[0].type.members[0])
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