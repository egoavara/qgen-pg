export declare const PG_TYPE_CATEGORY: unique symbol;
export declare const PG_CATALOG: unique symbol;
export declare type OID = number;
export declare type PGNamespace = {
    [PG_CATALOG]: 'pg_namespace';
    oid: OID;
    name: string;
    types: Record<OID, PGType>;
    classes: Record<OID, PGClass>;
};
export declare type PGAttribute = {
    [PG_CATALOG]: 'pg_attribute';
    oid: OID;
    name: string;
    type: PGType;
    notNull: boolean;
};
export declare type PGClass = {
    [PG_CATALOG]: 'pg_class';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    attributes: Record<string, PGAttribute>;
};
export declare type PGType = PGTypeArray | PGTypeBoolean | PGTypeComposite | PGTypeDatetime | PGTypeEnum | PGTypeGeometric | PGTypeNetworkAddress | PGTypeNumeric | PGTypePseudo | PGTypeRange | PGTypeString | PGTypeTimespan | PGTypeUserDefined | PGTypeBitString | PGTypeUnknown;
export declare type PGTypeArray = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'A';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
    elem: PGType;
};
export declare type PGTypeBoolean = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'B';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypeComposite = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'C';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
    class: PGClass;
};
export declare type PGTypeDatetime = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'D';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypeEnum = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'E';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypeGeometric = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'G';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypeNetworkAddress = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'I';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypeNumeric = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'N';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypePseudo = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'P';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypeRange = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'R';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypeString = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'S';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypeTimespan = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'T';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypeUserDefined = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'U';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypeBitString = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'V';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
export declare type PGTypeUnknown = {
    [PG_CATALOG]: 'pg_type';
    [PG_TYPE_CATEGORY]: 'X';
    oid: OID;
    name: string;
    namespace: PGNamespace;
    notNull: boolean;
    baseType?: PGType;
};
