import pg from 'pg'
export type BaseType = Pick<pg.ClientBase, 'query'>

export interface PgTypeCatalog {
    oid: number
    namespace: string
    name: string
    typbasetype: number
    typelem: number
    typrelid: number
}
export interface PgTypePrimitive extends PgTypeCatalog {
    type: 'primitive'
}
export interface PgTypeAlias extends PgTypeCatalog {
    type: 'alias'
    basetype: PgType
}
export interface PgTypeArray extends PgTypeCatalog {
    type: 'array'
    elem: PgType
}
export interface PgTypeClass extends PgTypeCatalog {
    type: 'class'
    fields: Record<string, PgType>
}
export type PgType = PgTypePrimitive | PgTypeAlias | PgTypeArray | PgTypeClass;
export async function loadPgtypeAllOids(tx: BaseType, namespace: string, name: string): Promise<number[]> {
    const temp = await tx.query(`select array_agg(pt."oid") as "oids" from pg_catalog.pg_type pt`)
    return temp.rows[0].oids
}
export async function loadPgtypeByName(tx: BaseType, namespace: string, name: string): Promise<PgType> {
    const temp = await tx.query(`select pt."oid" as "oid" from pg_catalog.pg_type pt inner join pg_catalog.pg_namespace pn on pn."oid" = pt.typnamespace where pn.nspname = $1 and pt.typname =$2`, [namespace, name])
    if (temp.rowCount !== 1) {
        throw new Error(`알 수 없는 namespace = '${namespace}', name = ${name}`)
    }
    return loadPgtypeByOid(tx, temp.rows[0].oid)
}
export async function loadPgtypeByOid(tx: BaseType, oid: number): Promise<PgType> {
    const temp = await tx.query(`select 
    pt."oid"            as "oid"
  , pn.nspname          as "namespace"
  , pt.typname          as "name"
  , pt.typbasetype      as "typbasetype"
  , pt.typelem          as "typelem"
  , pt.typrelid         as "typrelid"
from pg_catalog.pg_type pt
inner join pg_catalog.pg_namespace pn on pn."oid" = pt.typnamespace
where pt."oid" = $1
`, [oid])
    if (temp.rowCount !== 1) {
        throw new Error(`알 수 없는 oid = ${oid}`)
    }
    if (temp.rows[0].typbasetype !== 0) {
        return {
            oid: temp.rows[0].oid,
            namespace: temp.rows[0].namespace,
            name: temp.rows[0].name,
            typbasetype: temp.rows[0].typbasetype,
            typelem: temp.rows[0].typelem,
            typrelid: temp.rows[0].typrelid,
            type: 'alias',
            basetype: await loadPgtypeByOid(tx, temp.rows[0].typbasetype)
        }
    }
    if (temp.rows[0].typelem !== 0) {
        return {
            oid: temp.rows[0].oid,
            namespace: temp.rows[0].namespace,
            name: temp.rows[0].name,
            typbasetype: temp.rows[0].typbasetype,
            typelem: temp.rows[0].typelem,
            typrelid: temp.rows[0].typrelid,
            type: 'array',
            elem: await loadPgtypeByOid(tx, temp.rows[0].typelem)
        }
    }
    if (temp.rows[0].typrelid !== 0) {
        const rawFields = await tx.query(`
select (select json_object_agg(pa.attname, pa.atttypid::int)from pg_catalog.pg_attribute pa where pa.attnum > 0 and pa.attrelid  = pc."oid"	) as "fields"
from pg_catalog.pg_class pc
inner join pg_catalog.pg_type pt on pt."oid" = pc.reltype
where pc.reltype != 0 and pt.typcategory = 'C' and pc."oid" = $1`, [temp.rows[0].typrelid]);
        if (rawFields.rowCount !== 0) {
            throw new Error(`알 수 없는 클래스 oid = ${temp.rows[0].typrelid}`)
        }
        return {
            oid: temp.rows[0].oid,
            namespace: temp.rows[0].namespace,
            name: temp.rows[0].name,
            typbasetype: temp.rows[0].typbasetype,
            typelem: temp.rows[0].typelem,
            typrelid: temp.rows[0].typrelid,
            type: 'class',
            fields: Object.fromEntries(await Promise.all(Object.entries(rawFields.rows[0]).map(async ([k, v]) => {
                return [k, await loadPgtypeByOid(tx, v as any)]
            })))
        }
    }
    return {
        oid: temp.rows[0].oid,
        namespace: temp.rows[0].namespace,
        name: temp.rows[0].name,
        typbasetype: temp.rows[0].typbasetype,
        typelem: temp.rows[0].typelem,
        typrelid: temp.rows[0].typrelid,
        type: 'primitive',
    }
}