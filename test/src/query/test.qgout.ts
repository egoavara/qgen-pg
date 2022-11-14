// qgen query ...
import type pg from "pg";
import _QGEN_EP from "../qgen.ep.js";
export async function hello(conn: Pick<pg.Client, "query">, input: {
    name?: any;
}): Promise<{
    "uid": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "int4">;
    "id": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "varchar"> | null;
    "pw": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "bpchar"> | null;
    "name": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "varchar"> | null;
    "wallet": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "money"> | null;
    "birthday": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "date"> | null;
    "bignum": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "int8"> | null;
    "alarm": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "time"> | null;
}[]> {
    const result = await conn.query({ rowMode: "array", name: "hello", text: "select * from test where name = $1 ", values: [input.name], types: _QGEN_EP });
    const transformedRows: any = result.rows.map(raw => { return { "uid": raw[0], "id": raw[1], "pw": raw[2], "name": raw[3], "wallet": raw[4], "birthday": raw[5], "bignum": raw[6], "alarm": raw[7] }; });
    return transformedRows;
}
