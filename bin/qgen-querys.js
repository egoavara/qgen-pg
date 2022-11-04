#!/usr/bin/env node
import { program } from 'commander'
import glob from 'glob'
import path from 'path'
import pg from 'pg'
import { clearDefine, getDefine } from '../lib/index.js'

// ============================================================================
const qgen = program
    .option('-o, --output <dir>', 'output base directory, default : ./query', './query')
    .option('-b, --base <dir>', 'base path for input, default : .', '.')
    .option('-b, --base <dir>', '', '.')
    .option('--pg-host <host>', 'postgres database host, default : localhost', 'localhost')
    .option('--pg-port <port>', 'postgres database port, default : 5432', '5432')
    .option('--pg-username <username>', 'postgres database username, default : postgres', 'postgres')
    .option('--pg-password <password>', 'postgres database password, default : ', '')
    .option('--pg-database <database>', 'postgres database password, default : postgres', 'postgres')
    .argument('[patterns...]', 'mode and input file pattern, default : [./**/*.qr.js]')
    .parse()
const patterns = qgen.args.length === 0 ? ['./**/*.qr.js'] : qgen.args
const opts = qgen.opts()
// ============================================================================
const inputs = (await Promise.all(patterns.map((pattern)=>{
    return new Promise((resolve, reject) => {
        glob.glob(pattern, (err, matches) => {
            if (err === null || err === undefined) {
                return resolve(matches)
            }
            return reject(err)
        })
    })
}))).flat()
// ============================================================================
// 데이터베이스 접속
const dboption = {
    host: opts.pgHost,
    port: opts.pgPort,
    user: opts.pgUsername,
    password: opts.pgPassword,
    database: opts.pgDatabase,
}
const pool = new pg.Pool(dboption)
console.log('데이터베이스 값', { ...dboption, password: '***' })
try {
    console.log('데이터베이스 접속 시도중...')
    // 데이터베이스 접속 가능여부 검증
    const conn = await pool.connect()
    conn.release()
    console.log('데이터베이스 접속 성공')
} catch (err) {
    console.error("데이터베이스 접속 실패\n", err)
    process.exit(1)
}
// ============================================================================
console.log(`입력 파일 인식`)
const srcs = []
console.log(`base : ${opts.base}`)
for (const qrjsfile of inputs) {
    const relPath = path.posix.relative(opts.base, qrjsfile)
    const srcPath = path.posix.join(opts.base, relPath)
    const dstPath = path.posix.join(opts.output, relPath)
    const importTarget = `file:///${path.posix.join(path.posix.join(...process.cwd().split(path.sep), qrjsfile))}`
    await import(importTarget)
    console.log(`쿼리 변환 : ${srcPath} => ${dstPath}`)
    srcs.push({
        rel: relPath,
        src: srcPath,
        dst: dstPath,
        importUrl: importTarget,
        defines: getDefine(),
    })
    clearDefine()
}
// ============================================================================
console.log(`쿼리 테스트중...`)
await Promise.all(srcs.map(async ({ importUrl, defines }) => {
    for (const { query, name, inputs, testValues } of defines) {
        const check = (await pool.query({
            rowMode: 'array',
            name: name,
            text: query,
            values: testValues,
        }))
        console.log('query : ', query)
        console.log(check)
    }
}))
// ============================================================================
await pool.end()