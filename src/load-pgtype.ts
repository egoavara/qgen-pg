import pg from 'pg'
export type BaseType = Pick<pg.ClientBase, 'query'>

export interface PgTypeCatalog {
    oid: number
    namespace: string
    name: string
    typcategory:string
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
    orders: string[]
    fields: Record<string, PgType & { notNull: boolean }>
}
export type PgType = PgTypePrimitive | PgTypeAlias | PgTypeArray | PgTypeClass;

export async function loadPgtypeAllOids(tx: BaseType): Promise<number[]> {
    const temp = await tx.query(`
select pt."oid" as "oid" from pg_catalog.pg_type pt
order by coalesce(nullif(pt.typelem, 0), nullif(pt.typrelid, 0), nullif(pt.typbasetype, 0), pt."oid"), pt."oid"
`)
    return temp.rows.map((v) => v.oid)
}


export async function loadPgtableAllPgtypeOids(tx: BaseType): Promise<{ pgTypeOid: number, pgTableOid: number }[]> {
    const temp = await tx.query(`
select pt."oid" as "pgTypeOid", pc."oid" as "pgTableOid" from pg_catalog.pg_class pc
inner join pg_catalog.pg_type pt on pt.typrelid = pc."oid"    
`)
    return temp.rows
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
  , pt.typcategory      as "typcategory"
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
            typcategory: temp.rows[0].typcategory,
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
            typcategory: temp.rows[0].typcategory,
            typbasetype: temp.rows[0].typbasetype,
            typelem: temp.rows[0].typelem,
            typrelid: temp.rows[0].typrelid,
            type: 'array',
            elem,
        }
    }
    if (temp.rows[0].typrelid !== 0) {
        const rawFields = await tx.query(`
select pa.attname as "attname", pa.atttypid as "atttypid"
from pg_catalog.pg_attribute pa
inner join pg_catalog.pg_class pc on pc."oid" = pa.attrelid
inner join pg_catalog.pg_type pt on pt."oid" = pc.reltype
where pa.attnum > 0 and pc."oid" = $1
        `, [temp.rows[0].typrelid]);
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
        //
        const rawFieldsNullCheck = rawPgclass.rows[0].relkind === 'v'
            // postgres는 view의 모든 필드를 nullable 추론하기에 원본 테이블 레퍼런스로 찾아가 이 필드가 null인지 체크하는 과정이 필요하다.
            ? await tx.query(`
select vcu.column_name as "columnName", c.is_nullable = 'NO' as "isNullable"
from information_schema.view_column_usage vcu 
join information_schema."columns" c 
    on c.column_name = vcu.column_name 
    and c.table_name  = vcu.table_name 
    and c.table_schema  = vcu.table_schema 
    and c.table_catalog = vcu.table_catalog 
where 
    view_schema = all(select pn.nspname from pg_catalog.pg_namespace pn inner join pg_catalog.pg_class pc on pc.relnamespace = pn."oid"  where pc."oid" = $1)
    and view_name = all(select pc.relname from pg_catalog.pg_class pc where pc."oid" = $1)
                    `, [temp.rows[0].typrelid])
            // postgres view가 아니라면 레퍼런스가 없으므로 아래와 같이 사용해야 한다.
            : await tx.query(`
select pa.attname as "columnName", pa.attnotnull as "isNullable"
from pg_catalog.pg_attribute pa
inner join pg_catalog.pg_class pc on pc."oid" = pa.attrelid
inner join pg_catalog.pg_type pt on pt."oid" = pc.reltype
where pa.attnum > 0 and pc."oid" = $1
                                `, [temp.rows[0].typrelid])
        const nullableFields: Record<string, boolean> = Object.fromEntries(rawFieldsNullCheck.rows.map(v => [v.columnName, v.isNullable]))
        return {
            oid: temp.rows[0].oid,
            namespace: temp.rows[0].namespace,
            name: temp.rows[0].name,
            typcategory: temp.rows[0].typcategory,
            typbasetype: temp.rows[0].typbasetype,
            typelem: temp.rows[0].typelem,
            typrelid: temp.rows[0].typrelid,
            type: 'class',
            relkind: rawPgclass.rows[0].relkind,
            orders: rawFieldsOrder.rows.map(v => v.fieldname),
            fields: Object.fromEntries(await Promise.all(rawFields.rows.map(async ({ attname, atttypid }) => {
                const pgtype = await loadPgtypeByOid(tx, atttypid)
                if (pgtype === undefined) {
                    throw new Error(`${temp.rows[0].namespace}.${temp.rows[0].name} class의 요소 ${attname}의 타입(${atttypid})을 찾을 수 없습니다.`)
                }
                return [attname, {
                    ...pgtype,
                    notNull: nullableFields[attname]
                }]
            })))
        }
    }
    return {
        oid: temp.rows[0].oid,
        namespace: temp.rows[0].namespace,
        name: temp.rows[0].name,
        typcategory: temp.rows[0].typcategory,
        typbasetype: temp.rows[0].typbasetype,
        typelem: temp.rows[0].typelem,
        typrelid: temp.rows[0].typrelid,
        type: 'primitive',
    }
}