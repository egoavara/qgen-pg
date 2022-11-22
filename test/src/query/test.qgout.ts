// qgen query ...
import type pg from "pg";
import _QGEN_EP from "../qgen.ep.js";
export async function hello(conn: Pick<pg.Client, "query">, input: {}): Promise<{
    "uid": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "int4">;
    "id": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "varchar"> | null;
    "pw": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "bpchar"> | null;
    "name": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "varchar"> | null;
    "wallet": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "money"> | null;
    "birthday": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "date"> | null;
    "bignum": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "int8"> | null;
    "alarm": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "time"> | null;
    "nums": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "_int4"> | null;
}[]> {
    const result = await conn.query({ rowMode: "array", name: "hello", text: "select * from test", values: [], types: _QGEN_EP });
    const transformedRows: any = result.rows.map(raw => { return { "uid": raw[0], "id": raw[1], "pw": raw[2], "name": raw[3], "wallet": raw[4], "birthday": raw[5], "bignum": raw[6], "alarm": raw[7], "nums": raw[8] }; });
    return transformedRows;
}
export async function hello3(conn: Pick<pg.Client, "query">, input: {}): Promise<{
    "inventoryItem": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "public", "inventory_item"> | null;
}[]> {
    const result = await conn.query({ rowMode: "array", name: "hello3", text: "select $$('null',1,1)$$::inventory_item", values: [], types: _QGEN_EP });
    const transformedRows: any = result.rows.map(raw => { return { "inventoryItem": raw[0] }; });
    return transformedRows;
}
