#!/usr/bin/env node
const { program: commander } = require('commander')
const { Program } = require("../cjs/program.js");
// ============================================================================
// 패러미터 등록 및 초기 작업
const args = commander
    .option('-b, --base <dirpath>', 'base file path', '.')
    .option('-e, --entrypoint <filepath>', 'output entrypoint file path, relative form output path', './sqlfn.ep.ts')
    .option('-o, --output <dirpath>', 'output dir path', '.')
    .option('-i, --input <patterns...>', 'input pattern', ['./**/*.qg.ts', './**/*.qg.js',])
    .option('-t, --tsconfig <tsconfigpath>', 'tsconfig.json file path', './tsconfig.json')
    .option('-x, --config-extension <extension...>', 'extension select', [])
    .option('--config-array-elem <mode>', 'global array element nullable configuration : (null | notnull)', 'null')
    .option('--config-ts-null-type <type>', 'typescript null type, it can be null or undefined', "null")
    .option('--pg-host <host>', 'postgres database host, default : localhost', 'localhost')
    .option('--pg-port <port>', 'postgres database port, default : 5432', 5432)
    .option('--pg-username <username>', 'postgres database username, default : postgres', 'postgres')
    .option('--pg-password <password>', 'postgres database password', null)
    .option('--pg-database <database>', 'postgres database password, default : postgres', 'postgres')
    .parse()
const opts = args.opts()
// ============================================================================
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
        arrayElem: opts.configArrayElem,
    }
});
program.begin()
process.on("SIGINT", function(){
    console.log("[#] user close([SIGINT]) detected")
    program.exit().then(()=>{
        process.exit(0);
    })
})