// qgen query ...
import type pg from "pg";
import type { FixedArray } from "qgen";
import _QGEN_EP from "../qgen.ep.js";
export module hello {
    export interface Output {
        "uid": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "int4">;
        "id": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "varchar"> | null;
        "pw": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "bpchar"> | null;
        "name": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "varchar"> | null;
        "wallet": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "money"> | null;
        "birthday": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "date"> | null;
        "bignum": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "int8"> | null;
        "alarm": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "time"> | null;
        "nums": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "_int4"> | null;
    }
}
export async function hello(conn: Pick<pg.Client, "query">): Promise<Array<hello.Output>> {
    const result = await conn.query({ rowMode: "array", name: "hello", text: "select * from test", types: _QGEN_EP });
    const transformedRows: any = result.rows.map(raw => { return { "uid": raw[0], "id": raw[1], "pw": raw[2], "name": raw[3], "wallet": raw[4], "birthday": raw[5], "bignum": raw[6], "alarm": raw[7], "nums": raw[8] }; });
    return transformedRows;
}
export module hello2 {
    export interface Output {
        "buyId": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "uuid">;
        "sellId": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "uuid"> | null;
        "price": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "types", "price">;
        "createAt": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "timestamptz">;
        "updateAt": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "timestamptz">;
        "deleteAt": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "timestamptz"> | null;
        "$SECRETID": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "uuid">;
    }
}
export async function hello2(conn: Pick<pg.Client, "query">): Promise<void> {
    const result = await conn.query({ rowMode: "array", name: "hello2", text: "select * from bzc.buy_info", types: _QGEN_EP });
    return;
}
export module hello3 {
    export interface Output {
        "inventoryItem": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "public", "inventory_item"> | null;
    }
}
export async function hello3(conn: Pick<pg.Client, "query">): Promise<FixedArray<[
    hello3.Output
]>> {
    const result = await conn.query({ rowMode: "array", name: "hello3", text: "select $$('null',1,1)$$::inventory_item", types: _QGEN_EP });
    if (result.rowCount !== 1)
        throw Error("not expected row count 1");
    const transformedRows: any = result.rows.map(raw => { return { "inventoryItem": raw[0] }; });
    return transformedRows;
}
export module hello4 {
    export interface Input {
        id: any;
    }
    export interface Output {
        "buyId": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "uuid">;
        "sellId": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "uuid"> | null;
        "price": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "types", "price">;
        "createAt": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "timestamptz">;
        "updateAt": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "timestamptz">;
        "deleteAt": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "timestamptz"> | null;
        "$SECRETID": import("qgen").QgenTypeParser<typeof import("../qgen.ep.js")["default"], "pg_catalog", "uuid">;
    }
}
export async function hello4(conn: Pick<pg.Client, "query">, input: hello4.Input): Promise<hello4.Output | undefined> {
    const result = await conn.query({ rowMode: "array", name: "hello4", text: "select * from bzc.buy_info where buy_id = $1 ", values: [input.id], types: _QGEN_EP });
    if (result.rowCount > 1)
        throw Error("must be 0 or 1 row count");
    if (result.rowCount < 1)
        return undefined;
    return { "buyId": result.rows[0][0], "sellId": result.rows[0][1], "price": result.rows[0][2], "createAt": result.rows[0][3], "updateAt": result.rows[0][4], "deleteAt": result.rows[0][5], "$SECRETID": result.rows[0][6] };
}
