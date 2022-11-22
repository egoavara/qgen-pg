import pg from "pg"
import { hello3 } from "./query/test.qgout.js"
(async () => {
    const pool = new pg.Pool({
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "test",
        database: "postgres",
    })
    try {
        const [temp] = await hello3(pool)
        console.log(temp[0])
    } finally {
        await pool.end()
    }
})();