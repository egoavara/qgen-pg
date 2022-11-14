import pg from "pg"
import { hello } from "./query/test.qgout.js"
const pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "test",
    database: "postgres",
})
try {
    const temp = await hello(pool, { name: 'name01' })
    console.log(temp)
} finally {
    await pool.end()
}