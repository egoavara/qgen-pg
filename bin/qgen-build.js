#!/usr/bin/env node
const { program: commander } = require('commander')
const { Program } = require("../cjs/program.js");
const fsp = require("fs/promises");
// ============================================================================
// 패러미터 등록 및 초기 작업
const args = commander
    .option('-b, --base <dirpath>', 'base file path', '.')
    .option('-e, --entrypoint <filepath>', 'output entrypoint file path, relative form output path', './qgen.ep.ts')
    .option('-o, --output <dirpath>', 'output dir path', '.')
    .option('-i, --input <patterns...>', 'input pattern', ['./**/*.qg.ts', './**/*.qg.js',])
    .option('-t, --tsconfig <tsconfigpath>', 'tsconfig.json file path', './tsconfig.json')
    .option('-x, --config-extension <extension...>', 'extension select', [])
    .option('--config-unsafe-array', 'unsafe array, (T | null)[] to T[]', false)
    .option('--config-ts-null-type <type>', 'typescript null type, it can be null or undefined', "null")
    .option('--pg-host <host>', 'postgres database host, default : localhost', 'localhost')
    .option('--pg-port <port>', 'postgres database port, default : 5432', 5432)
    .option('--pg-username <username>', 'postgres database username, default : postgres', 'postgres')
    .option('--pg-password <password>', 'postgres database password', null)
    .option('--pg-database <database>', 'postgres database password, default : postgres', 'postgres')
    .parse()
const opts = args.opts()
// ============================================================================
const path = require("path");
const program = new Program({
    cwd: process.cwd(),
    base: opts.base,
    entrypoint: opts.entrypoint,
    output: opts.output,
    input: opts.input,
    tsconfig: opts.tsconfig,
    pgHost: opts.pgHost,
    pgPort: opts.pgPort,
    pgUsername: opts.pgUsername,
    pgPassword: opts.pgPassword,
    pgDatabase: opts.pgDatabase,
    config: {
        extension: opts.configExtension,
        tsNullType: opts.configTsNullType,
        unsafeArray: opts.configUnsafeArray,
    }
});
console.log(`extension : ${opts.configExtension}`);
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
    const runBuild = await program.runBuild(runQuery, pgTypes)
    await Promise.all(Object.entries(runBuild).map(async ([filepath, text]) => {
        console.log(filepath)
        await fsp.mkdir(path.dirname(filepath), { recursive: true })
        await fsp.writeFile(filepath, text)
    }))
    program.exit()
})();