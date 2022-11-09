// import pg from "pg"
// import { QgenBuilder } from "./syntax-qgen-builder"
// import { Typedef } from "./syntax-typedef"

// const defines: QgenBuilder<any>[] = []

// export function addDefine(builder: QgenBuilder<any>) {
//     defines.push(builder)
// }

// export function clearDefine() {
//     while (defines.pop() === undefined) { }
// }

// export function getDefine() {
//     return defines.map((v) => v.end())
// }

// const typedefByOid: Record<number, Typedef> = {
//     [pg.types.builtins.DATE]: { type: 'internal', symbol: "Date" },
//     [pg.types.builtins.BOOL]: { type: 'expression', expr: "boolean" },
//     // [pg.types.builtins.BYTEA]: { type: 'internal', symbol: "string" },
//     [pg.types.builtins.CHAR]: { type: 'expression', expr: "string" },
//     [pg.types.builtins.INT8]: { type: 'expression', expr: "string" },
//     [pg.types.builtins.INT2]: { type: 'expression', expr: "number" },
//     [pg.types.builtins.INT4]: { type: 'expression', expr: "number" },
//     // [pg.types.builtins.REGPROC]: { type: 'internal', symbol: "string" },
//     [pg.types.builtins.TEXT]: { type: 'expression', expr: "string" },
//     [pg.types.builtins.OID]: { type: 'expression', expr: "number" },
//     [pg.types.builtins.TID]: { type: 'expression', expr: "number" },
//     [pg.types.builtins.XID]: { type: 'expression', expr: "number" },
//     [pg.types.builtins.CID]: { type: 'expression', expr: "number" },
//     [pg.types.builtins.JSON]: { type: 'expression', expr: "any" },
//     // [pg.types.builtins.XML]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.PG_NODE_TREE]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.SMGR]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.PATH]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.POLYGON]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.CIDR]: { type: 'internal', symbol: "string" },
//     [pg.types.builtins.FLOAT4]: { type: 'expression', expr: "number" },
//     [pg.types.builtins.FLOAT8]: { type: 'expression', expr: "number" },
//     // [pg.types.builtins.ABSTIME]: { type: 'internal', symbol: "Date" },
//     // [pg.types.builtins.RELTIME]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.TINTERVAL]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.CIRCLE]: { type: 'module', symbol: "Circle", expr : [['x', 'number'], ['y', 'number']] },
//     // [pg.types.builtins.MACADDR8]: { type: 'internal', symbol: "string" },
//     [pg.types.builtins.MONEY]: { type: 'expression', expr: "string" },
//     // [pg.types.builtins.MACADDR]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.INET]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.ACLITEM]: { type: 'internal', symbol: "string" },
//     [pg.types.builtins.BPCHAR]: { type: 'expression', expr: "string" },
//     [pg.types.builtins.VARCHAR]: { type: 'expression', expr: "string" },
//     [pg.types.builtins.DATE]: { type: 'internal', symbol: "Date" },
//     // [pg.types.builtins.TIME]: { type: 'internal', symbol: "string" },
//     [pg.types.builtins.TIMESTAMP]: { type: 'internal', symbol: "Date" },
//     [pg.types.builtins.TIMESTAMPTZ]: { type: 'internal', symbol: "Date" },
//     // [pg.types.builtins.INTERVAL]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.TIMETZ]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.BIT]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.VARBIT]: { type: 'internal', symbol: "string" },
//     [pg.types.builtins.NUMERIC]: { type: 'expression', expr: "string" },
//     // [pg.types.builtins.REFCURSOR]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.REGPROCEDURE]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.REGOPER]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.REGOPERATOR]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.REGCLASS]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.REGTYPE]: { type: 'internal', symbol: "string" },
//     [pg.types.builtins.UUID]: { type: 'expression', expr: "string" },
//     // [pg.types.builtins.TXID_SNAPSHOT]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.PG_LSN]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.PG_NDISTINCT]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.PG_DEPENDENCIES]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.TSVECTOR]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.TSQUERY]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.GTSVECTOR]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.REGCONFIG]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.REGDICTIONARY]: { type: 'internal', symbol: "string" },
//     [pg.types.builtins.JSONB]: { type: 'expression', expr: "any" },
//     // [pg.types.builtins.REGNAMESPACE]: { type: 'internal', symbol: "string" },
//     // [pg.types.builtins.REGROLE]: { type: 'internal', symbol: "string" }
// }
// const typedefByName: Record<string, Record<string, Typedef>> = {}
// export function setTypedef(oid: number, def: Typedef): void;
// export function setTypedef(name: { namespace: string, name: string }, def: Typedef): void;
// export function setTypedef(q: number | { namespace: string, name: string }, def: Typedef): void {
//     if (typeof q === 'number') {
//         typedefByOid[q] = def
//     }
//     if (typeof q === 'object') {
//         if (!(q.namespace in typedefByName)) {
//             typedefByName[q.namespace] = {}
//         }
//         typedefByName[q.namespace][q.name] = def
//     }
// }
// export function getTypedef(...qs: (number | { namespace: string, name: string })[]): Typedef {
//     for (const q of qs) {
//         if (typeof q === 'number' && q in typedefByOid) {
//             return typedefByOid[q]
//         }
//         if (typeof q === 'object' && q.namespace in typedefByName && q.name in typedefByName[q.namespace]) {
//             return typedefByName[q.namespace][q.name]
//         }
//     }
//     return {
//         type: "expression",
//         expr: "any"
//     }

// }
// export function isExistTypedef(...qs: (number | { namespace: string, name: string })[]): boolean {
//     for (const q of qs) {
//         if (typeof q === 'number' && q in typedefByOid) {
//             return true
//         }
//         if (typeof q === 'object' && q.namespace in typedefByName && q.name in typedefByName[q.namespace]) {
//             return true
//         }
//     }
//     return false

// }
// export function totalTypedef(): Typedef[] {
//     return [
//         ...Object.values(typedefByOid),
//         ...Object.values(typedefByName).map(v => Object.values(v)).flat(),
//     ]
// }