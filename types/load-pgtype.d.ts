import pg from 'pg';
export declare type BaseType = Pick<pg.ClientBase, 'query'>;
export interface PgTypeCatalog {
    oid: number;
    namespace: string;
    name: string;
    typbasetype: number;
    typelem: number;
    typrelid: number;
}
export interface PgTypePrimitive extends PgTypeCatalog {
    type: 'primitive';
}
export interface PgTypeAlias extends PgTypeCatalog {
    type: 'alias';
    basetype: PgType;
}
export interface PgTypeArray extends PgTypeCatalog {
    type: 'array';
    elem: PgType;
}
export interface PgTypeClass extends PgTypeCatalog {
    type: 'class';
    fields: Record<string, PgType>;
}
export declare type PgType = PgTypePrimitive | PgTypeAlias | PgTypeArray | PgTypeClass;
export declare function loadPgtypeAllOids(tx: BaseType, namespace: string, name: string): Promise<number[]>;
export declare function loadPgtypeByName(tx: BaseType, namespace: string, name: string): Promise<PgType>;
export declare function loadPgtypeByOid(tx: BaseType, oid: number): Promise<PgType>;
