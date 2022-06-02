import { OID, PG_CATALOG, PG_TYPE_CATEGORY } from "./pg-catalog"

export type RawPGNamespace = {
    [PG_CATALOG]: 'pg_namespace'
    oid: OID
    name: string
    types: OID[]
    classes: OID[]
}
export type RawPGAttribute = {
    [PG_CATALOG]: 'pg_attribute'
    oid: OID
    name: string
    type: OID
    notNull: boolean
}
export type RawPGClass = {
    [PG_CATALOG]: 'pg_class'
    oid: OID
    name: string
    namespace: OID
    attributes: OID[]
}


export type RawPGType =
    | RawPGTypeArray
    | RawPGTypeBoolean
    | RawPGTypeComposite
    | RawPGTypeDatetime
    | RawPGTypeEnum
    | RawPGTypeGeometric
    | RawPGTypeNetworkAddress
    | RawPGTypeNumeric
    | RawPGTypePseudo
    | RawPGTypeRange
    | RawPGTypeString
    | RawPGTypeTimespan
    | RawPGTypeUserDefined
    | RawPGTypeBitString
    | RawPGTypeUnknown

export type RawPGTypeArray = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'A'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
    elem: OID
}
export type RawPGTypeBoolean = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'B'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypeComposite = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'C'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
    class: OID
}
export type RawPGTypeDatetime = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'D'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypeEnum = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'E'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypeGeometric = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'G'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypeNetworkAddress = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'I'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypeNumeric = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'N'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypePseudo = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'P'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypeRange = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'R'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypeString = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'S'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypeTimespan = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'T'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypeUserDefined = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'U'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypeBitString = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'V'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}
export type RawPGTypeUnknown = {
    [PG_CATALOG]: 'pg_type'
    [PG_TYPE_CATEGORY]: 'X'
    oid: OID
    name: string
    namespace: OID
    notNull: boolean
    baseType?: OID
}