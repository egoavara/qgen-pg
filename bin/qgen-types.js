#!/usr/bin/env node
import { program } from 'commander'
import pg from 'pg'
import fs from 'fs/promises'
import { clearDefine, getDefine, loadPgtypeAllOids, loadPgtypeByOid, QgenTypeParser } from '../lib/index.js'
import path from 'path'
// ============================================================================
// 패러미터 등록 및 초기 작업
const qgen = program
    .option('-o, --output <filepath>', 'output file path, default : ./query/parser.ts', './query/parser.ts')
    .option('--filter-namespace <...namespaces>', 'output file path, default : [pg_catalog]', ['pg_catalog'])
    .option('--pg-host <host>', 'postgres database host, default : localhost', 'localhost')
    .option('--pg-port <port>', 'postgres database port, default : 5432', '5432')
    .option('--pg-username <username>', 'postgres database username, default : postgres', 'postgres')
    .option('--pg-password <password>', 'postgres database password, default : ', '')
    .option('--pg-database <database>', 'postgres database password, default : postgres', 'postgres')
    .parse()
const opts = qgen.opts()
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
const oids = await loadPgtypeAllOids(pool)
const totalOids = oids.length
console.log(`대상 oid 개수 총 ${totalOids}개`)
let pgTypes = await Promise.all(oids.map(async (oid) => {
    const typ = await loadPgtypeByOid(pool, oid)
    return typ
}))
console.log(`제외할 네임스페이스 : `, opts.filterNamespace)
pgTypes = pgTypes.filter(v=>!opts.filterNamespace.includes(v.namespace))
console.log(`제외 후 타입 개수 ${pgTypes.length}개`)
await fs.mkdir(path.dirname(opts.output), { recursive: true })
console.log(`타입 파서 파일 생성 완료`)
await fs.writeFile(opts.output, QgenTypeParser)
await Promise.all(pgTypes.map(async (typ) => {
    await fs.appendFile(opts.output, `
// oid : ${typ.oid}, type : ${typ.type}, namespace : ${typ.namespace}, name : ${typ.name}
if(builtinOids.findIndex(v=>v === ${typ.oid})) { pg.types.setTypeParser(${typ.oid}, 'text', (v)=>{}); }
`)


}))


// ============================================================================
// 데이터베이스 정리
await pool.end()