// sqlfn query ...
import type pg from "pg";
import type { FixedArray } from "sqlfn";
import _SQLFN_EP from "../sqlfn.ep.js";
export module hello3 {
    export interface Output {
        "0": import("sqlfn").TypeParser<typeof import("../sqlfn.ep.js")["default"], "pg_catalog", "text"> | null;
        "1": import("sqlfn").TypeParser<typeof import("../sqlfn.ep.js")["default"], "pg_catalog", "text"> | null;
    }
}
export async function hello3(conn: Pick<pg.Client, "query">): Promise<Array<hello3.Output>> {
    const result = await conn.query({ rowMode: "array", name: "hello3", text: "select 'helloworld', 'hellworld'", types: _SQLFN_EP });
    const transformedRows: any = result.rows.map(raw => { return { "0": raw[0], "1": raw[1] }; });
    return transformedRows;
}
