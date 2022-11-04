import { types } from 'pg';
export function DefAny() { return { category: 'any', type: 'any' }; }
export function DefPrimitive(type) { return { category: 'primitive', type }; }
export function DefStdlib(type) { return { category: 'stdlib', type }; }
export function DefObject(type) { return { category: 'object', type }; }
export function DefExtern(name, type) { return { category: 'extern', name, type }; }
export const TypeIdToDefine = {
    [types.builtins.BOOL]: DefPrimitive('boolean'),
    [types.builtins.CHAR]: DefPrimitive('string'),
    [types.builtins.INT2]: DefPrimitive('number'),
    [types.builtins.INT4]: DefPrimitive('number'),
    [types.builtins.INT8]: DefPrimitive('bigint'),
    [types.builtins.TEXT]: DefPrimitive('string'),
    [types.builtins.JSON]: DefAny(),
    [types.builtins.PATH]: DefAny(),
    [types.builtins.POLYGON]: DefAny(),
    [types.builtins.CIRCLE]: DefAny(),
    [types.builtins.FLOAT4]: DefPrimitive('number'),
    [types.builtins.FLOAT8]: DefPrimitive('number'),
    [types.builtins.MONEY]: DefPrimitive('string'),
    [types.builtins.BPCHAR]: DefPrimitive('string'),
    [types.builtins.VARCHAR]: DefPrimitive('string'),
    [types.builtins.DATE]: DefStdlib('Date'),
    [types.builtins.TIME]: DefPrimitive('string'),
    [types.builtins.TIMESTAMP]: DefStdlib('Date'),
    [types.builtins.TIMESTAMPTZ]: DefStdlib('Date'),
    [types.builtins.INTERVAL]: DefPrimitive('string'),
    [types.builtins.TIMETZ]: DefPrimitive('string'),
    [types.builtins.NUMERIC]: DefPrimitive('string'),
    [types.builtins.UUID]: DefPrimitive('string'),
    [types.builtins.JSONB]: DefAny(),
};
// export type PgToTs = (typeId: number, pgType: PGType) => DefType | undefined;
// export type TsToPg = (v: any) => { snippet: TsSnippet, type: DefType } | undefined;
// export type TypeInterface = { pg: PgToTs[], ts: TsToPg[] }
// export const TypeTable: TypeInterface = {
//     pg: [(typeId) => { return TypeIdToDefine[typeId] }],
//     ts: [
//         (v) => {
//             if (v === undefined) {
//                 return { snippet: TsInlineSnippet.}
//             }
//             if (v === null) {
//                 return null
//             }
//             switch (typeof v) {
//                 case 'bigint':
//                     return v.toString()
//                 case 'string':
//                 case 'boolean':
//                 case 'number':
//                     return v
//             }
//             if (typeof v.toPostgres === 'function') {
//                 return v.toPostgres()
//             }
//             if (typeof v.toString === 'function') {
//                 return v.toString()
//             }
//             return undefined
//         }
//     ],
// }
