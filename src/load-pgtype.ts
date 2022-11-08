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
    relkind: string
    orders: number[]
    fields: Record<string, PgType>
}
export type PgType = PgTypePrimitive | PgTypeAlias | PgTypeArray | PgTypeClass;

export async function loadPgtypeAllOids(tx: BaseType, namespace: string, name: string): Promise<number[]> {
    const temp = await tx.query(`
select pt."oid" as "oid" from pg_catalog.pg_type pt
order by coalesce(nullif(pt.typelem, 0), nullif(pt.typrelid, 0), nullif(pt.typbasetype, 0), pt."oid"), pt."oid"
`)
    return temp.rows.map((v) => v.oid)
}
export async function loadPgtypeByName(tx: BaseType, namespace: string, name: string): Promise<PgType | undefined> {
    const temp = await tx.query(`select pt."oid" as "oid" from pg_catalog.pg_type pt inner join pg_catalog.pg_namespace pn on pn."oid" = pt.typnamespace where pn.nspname = $1 and pt.typname =$2`, [namespace, name])
    if (temp.rowCount !== 1) {
        throw new Error(`알 수 없는 namespace = '${namespace}', name = ${name}`)
    }
    return loadPgtypeByOid(tx, temp.rows[0].oid)
}
export async function loadPgtypeByOid(tx: BaseType, oid: number): Promise<PgType | undefined> {
    if (typeof oid !== 'number') {
        throw new Error("oid is not nulber");
    }
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
        return undefined
    }
    if (temp.rows[0].typbasetype !== 0) {
        const basetype = await loadPgtypeByOid(tx, temp.rows[0].typbasetype)
        if (basetype === undefined) {
            return undefined
        }
        return {
            oid: temp.rows[0].oid,
            namespace: temp.rows[0].namespace,
            name: temp.rows[0].name,
            typbasetype: temp.rows[0].typbasetype,
            typelem: temp.rows[0].typelem,
            typrelid: temp.rows[0].typrelid,
            type: 'alias',
            basetype,
        }
    }
    if (temp.rows[0].typelem !== 0) {
        const elem = await loadPgtypeByOid(tx, temp.rows[0].typelem)
        if (elem === undefined) {
            return undefined
        }
        return {
            oid: temp.rows[0].oid,
            namespace: temp.rows[0].namespace,
            name: temp.rows[0].name,
            typbasetype: temp.rows[0].typbasetype,
            typelem: temp.rows[0].typelem,
            typrelid: temp.rows[0].typrelid,
            type: 'array',
            elem,
        }
    }
    if (temp.rows[0].typrelid !== 0) {
        const rawFields = await tx.query(`
select (select json_object_agg(pa.attname, pa.atttypid::int)from pg_catalog.pg_attribute pa where pa.attnum > 0 and pa.attrelid  = pc."oid"	) as "fields"
from pg_catalog.pg_class pc
inner join pg_catalog.pg_type pt on pt."oid" = pc.reltype
where pc."oid" = $1`, [temp.rows[0].typrelid]);
        if (rawFields.rowCount !== 1) {
            return undefined
        }
        const rawFieldsOrder = await tx.query(`
        select attname as "fieldname"
        from pg_catalog.pg_attribute pa
        where pa.attrelid = $1 and pa.attnum > 0
        order by pa.attnum
        `, [temp.rows[0].typrelid]);
        const rawPgclass = await tx.query(`
select pc.relkind as "relkind"
from pg_catalog.pg_class pc
inner join pg_catalog.pg_type pt on pt."oid" = pc.reltype
where pc."oid" = $1`, [temp.rows[0].typrelid]);
        if (rawPgclass.rowCount !== 1) {
            return undefined
        }
        return {
            oid: temp.rows[0].oid,
            namespace: temp.rows[0].namespace,
            name: temp.rows[0].name,
            typbasetype: temp.rows[0].typbasetype,
            typelem: temp.rows[0].typelem,
            typrelid: temp.rows[0].typrelid,
            type: 'class',
            relkind: rawPgclass.rows[0].relkind,
            orders: rawFieldsOrder.rows.map(v => v.fieldname),
            fields: Object.fromEntries(await Promise.all(Object.entries(rawFields.rows[0].fields).map(async ([k, v]) => {
                const pgtype = await loadPgtypeByOid(tx, v as any)
                if (pgtype === undefined) {
                    throw new Error(`${temp.rows[0].namespace}.${temp.rows[0].name} class의 요소 ${k} 타입을 찾을 수 없습니다.`)
                }
                return [k, pgtype]
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