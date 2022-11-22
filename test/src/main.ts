import pg from "pg"
import { hello2, hello3, hello4 } from "./query/test.qgout.js"
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
        console.log(temp)
    } finally {
        await pool.end()
    }
})();