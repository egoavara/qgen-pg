#!/usr/bin/env node
// await import("data:text/javascript;base64," + Buffer.from('console.log("hello, world")').toString('base64'))
import path from "path"
import ts from "typescript"

const command = {
    output: "./query",
    base: "./src",
    cwd: process.cwd(),
}

const configPath = ts.findConfigFile(command.cwd, ts.sys.fileExists, "tsconfig.json")
if (!configPath) throw Error('tsconfig.json not found')

const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile)
if (config === undefined || error !== undefined) throw Error('tsconfig.json read failed')

config.include = ['./**/*.qg.ts', './**/*.qg.js']
config.compilerOptions = {
    ...(config.compilerOptions ?? {}),
    allowJs: true,
    declaration : false,
    sourceMap : false,
    
}

const { options, fileNames, errors, raw } = ts.parseJsonConfigFileContent(config, ts.sys, command.cwd)
if (errors.length > 0) throw Error('tsconfig.json parse failed')

const host = ts.createCompilerHost(options)
const program = ts.createProgram(fileNames, options)
const targets = program.getSourceFiles().filter(v => v.fileName.endsWith(".qg.ts") || v.fileName.endsWith(".qg.js"))

await Promise.all(targets.map(async (src)=>{
    const [jsfilename, jssrc] = await new Promise((resolve, reject)=>{
        const result = program.emit(src, (filename, text)=>{
            if(filename.endsWith(".js")){
                resolve([filename, text])
            }
        })
        if(result.diagnostics.length> 0){
            reject(result.diagnostics)
        }
    })
    console.log("===================")
    console.log(": ", jsfilename)
    console.log(jssrc)
}))
// 
// const sources = program.getSourceFiles().filter(v => v.fileName.endsWith(".qg.ts"))

// for (const src of sources) {
//     console.log("===================")
//     console.log(": ", src.fileName)
//     const emitResult = program.emit(src, (filename, text,) => {
//         console.log(`: filename : ${filename}`)
//         console.log(`: text     : ${text}`)
//     })

//     console.log(emitResult.diagnostics)
//     console.log(emitResult.emitSkipped)
//     console.log(emitResult.emittedFiles)
// }
// console.log(sources.map(v => v.fileName))

// const src = ts.createSourceFile("./test.ts", "export type a = {};", ts.ScriptTarget.ESNext)
// const printer = ts.createPrinter({})
// const host = ts.createCompilerHost({})
// ts.parseJsonConfigFileContent()
// host.writeFile()
// const result = ts.transform(src, [
//     (ctx) => {
//         const { factory } = ctx
//         return node => {
//             if (!ts.isSourceFile(node)) {
//                 throw new Error("unreachable")
//             }
//             const hello = factory.createInterfaceDeclaration(
//                 [],
//                 [factory.createModifier(ts.SyntaxKind.ExportKeyword,)],
//                 'hello',
//                 [],
//                 [],
//                 [
//                     factory.createPropertySignature(
//                         [],
//                         'hello',
//                         factory.createToken(ts.SyntaxKind.QuestionToken),
//                         factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
//                     )
//                 ],
//             )

//             return factory.updateSourceFile(
//                 node,
//                 [
//                     hello,
//                     ...node.statements,
//                 ],
//             )
//         }
//     }
// ])
// console.log(src)
// console.log(printer.printFile(result.transformed[0]))