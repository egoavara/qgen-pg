import pg from "pg"
import { ArrayParser } from "./parser-array.js"
import { CompositeParser } from "./parser-composite.js"
/**
 * select jsonb_pretty(jsonb_object_agg(pt.typname, pt.oid::int8)) from pg_catalog.pg_type pt
 * inner join pg_namespace pn on pn.oid = pt.typnamespace
 * where pn.nspname = 'pg_catalog';
 */
const builtins = {
    "any": 2276,
    "bit": 1560,
    "box": 603,
    "cid": 29,
    "oid": 26,
    "tid": 27,
    "xid": 28,
    "xml": 142,
    "_bit": 1561,
    "_box": 1020,
    "_cid": 1012,
    "_oid": 1028,
    "_tid": 1010,
    "_xid": 1011,
    "_xml": 143,
    "bool": 16,
    "char": 18,
    "cidr": 650,
    "date": 1082,
    "inet": 869,
    "int2": 21,
    "int4": 23,
    "int8": 20,
    "json": 114,
    "line": 628,
    "lseg": 601,
    "name": 19,
    "path": 602,
    "text": 25,
    "time": 1083,
    "uuid": 2950,
    "void": 2278,
    "xid8": 5069,
    "_bool": 1000,
    "_char": 1002,
    "_cidr": 651,
    "_date": 1182,
    "_inet": 1041,
    "_int2": 1005,
    "_int4": 1007,
    "_int8": 1016,
    "_json": 199,
    "_line": 629,
    "_lseg": 1018,
    "_name": 1003,
    "_path": 1019,
    "_text": 1009,
    "_time": 1183,
    "_uuid": 2951,
    "_xid8": 271,
    "bytea": 17,
    "jsonb": 3802,
    "money": 790,
    "pg_am": 12015,
    "point": 600,
    "_bytea": 1001,
    "_jsonb": 3807,
    "_money": 791,
    "_pg_am": 12014,
    "_point": 1017,
    "bpchar": 1042,
    "circle": 718,
    "float4": 700,
    "float8": 701,
    "pg_lsn": 3220,
    "record": 2249,
    "timetz": 1266,
    "varbit": 1562,
    "_bpchar": 1014,
    "_circle": 719,
    "_float4": 1021,
    "_float8": 1022,
    "_pg_lsn": 3221,
    "_record": 2287,
    "_timetz": 1270,
    "_varbit": 1563,
    "aclitem": 1033,
    "anyenum": 3500,
    "cstring": 2275,
    "macaddr": 829,
    "numeric": 1700,
    "pg_amop": 12017,
    "pg_cast": 12043,
    "pg_enum": 12045,
    "pg_proc": 81,
    "pg_type": 71,
    "pg_user": 12233,
    "polygon": 604,
    "regoper": 2203,
    "regproc": 24,
    "regrole": 4096,
    "regtype": 2206,
    "trigger": 2279,
    "tsquery": 3615,
    "tsrange": 3908,
    "unknown": 705,
    "varchar": 1043,
    "_aclitem": 1034,
    "_cstring": 1263,
    "_macaddr": 1040,
    "_numeric": 1231,
    "_pg_amop": 12016,
    "_pg_cast": 12042,
    "_pg_enum": 12044,
    "_pg_proc": 272,
    "_pg_type": 210,
    "_pg_user": 12232,
    "_polygon": 1027,
    "_regoper": 2208,
    "_regproc": 1008,
    "_regrole": 4097,
    "_regtype": 2211,
    "_tsquery": 3645,
    "_tsrange": 3909,
    "_varchar": 1015,
    "anyarray": 2277,
    "anyrange": 3831,
    "internal": 2281,
    "interval": 1186,
    "jsonpath": 4072,
    "macaddr8": 774,
    "numrange": 3906,
    "pg_class": 83,
    "pg_group": 12229,
    "pg_index": 12007,
    "pg_locks": 12292,
    "pg_range": 12099,
    "pg_roles": 12219,
    "pg_rules": 12242,
    "pg_stats": 12272,
    "pg_views": 12247,
    "regclass": 2205,
    "tsvector": 3614,
    "_interval": 1187,
    "_jsonpath": 4073,
    "_macaddr8": 775,
    "_numrange": 3907,
    "_pg_class": 273,
    "_pg_group": 12228,
    "_pg_index": 12006,
    "_pg_locks": 12291,
    "_pg_range": 12098,
    "_pg_roles": 12218,
    "_pg_rules": 12241,
    "_pg_stats": 12271,
    "_pg_views": 12246,
    "_regclass": 2210,
    "_tsvector": 3643,
    "daterange": 3912,
    "gtsvector": 3642,
    "int4range": 3904,
    "int8range": 3926,
    "oidvector": 30,
    "pg_amproc": 12019,
    "pg_authid": 2842,
    "pg_config": 12345,
    "pg_depend": 12051,
    "pg_policy": 12084,
    "pg_shadow": 12224,
    "pg_tables": 12252,
    "refcursor": 1790,
    "regconfig": 3734,
    "timestamp": 1114,
    "tstzrange": 3910,
    "_daterange": 3913,
    "_gtsvector": 3644,
    "_int4range": 3905,
    "_int8range": 3927,
    "_oidvector": 1013,
    "_pg_amproc": 12018,
    "_pg_authid": 12057,
    "_pg_config": 12344,
    "_pg_depend": 12050,
    "_pg_policy": 12083,
    "_pg_shadow": 12223,
    "_pg_tables": 12251,
    "_refcursor": 2201,
    "_regconfig": 3735,
    "_timestamp": 1115,
    "_tstzrange": 3911,
    "anyelement": 2283,
    "int2vector": 22,
    "pg_attrdef": 12001,
    "pg_cursors": 12296,
    "pg_indexes": 12262,
    "pg_opclass": 12013,
    "pg_rewrite": 12035,
    "pg_trigger": 12037,
    "pg_ts_dict": 12068,
    "_int2vector": 1006,
    "_pg_attrdef": 12000,
    "_pg_cursors": 12295,
    "_pg_indexes": 12261,
    "_pg_opclass": 12012,
    "_pg_rewrite": 12034,
    "_pg_trigger": 12036,
    "_pg_ts_dict": 12067,
    "anynonarray": 2776,
    "fdw_handler": 3115,
    "pg_database": 1248,
    "pg_inherits": 12005,
    "pg_language": 12021,
    "pg_matviews": 12257,
    "pg_mcv_list": 5017,
    "pg_operator": 12009,
    "pg_opfamily": 12011,
    "pg_policies": 12237,
    "pg_seclabel": 12092,
    "pg_sequence": 12103,
    "pg_settings": 12323,
    "pg_shdepend": 12060,
    "pg_snapshot": 5038,
    "pg_stat_ssl": 12460,
    "pg_stat_wal": 12504,
    "regoperator": 2204,
    "timestamptz": 1184,
    "tsm_handler": 3310,
    "_pg_database": 12052,
    "_pg_inherits": 12004,
    "_pg_language": 12020,
    "_pg_matviews": 12256,
    "_pg_operator": 12008,
    "_pg_opfamily": 12010,
    "_pg_policies": 12236,
    "_pg_seclabel": 12091,
    "_pg_sequence": 12102,
    "_pg_settings": 12322,
    "_pg_shdepend": 12059,
    "_pg_snapshot": 5039,
    "_pg_stat_ssl": 12459,
    "_pg_stat_wal": 12503,
    "_regoperator": 2209,
    "_timestamptz": 1185,
    "pg_aggregate": 12027,
    "pg_attribute": 75,
    "pg_collation": 12095,
    "pg_extension": 12074,
    "pg_namespace": 12047,
    "pg_ndistinct": 3361,
    "pg_node_tree": 194,
    "pg_seclabels": 12318,
    "pg_sequences": 12267,
    "pg_stat_slru": 12447,
    "pg_statistic": 12029,
    "pg_stats_ext": 12277,
    "pg_transform": 12101,
    "pg_ts_config": 12064,
    "pg_ts_parser": 12070,
    "regcollation": 4191,
    "regnamespace": 4089,
    "regprocedure": 2202,
    "tsmultirange": 4533,
    "_pg_aggregate": 12026,
    "_pg_attribute": 270,
    "_pg_collation": 12094,
    "_pg_extension": 12073,
    "_pg_namespace": 12046,
    "_pg_seclabels": 12317,
    "_pg_sequences": 12266,
    "_pg_stat_slru": 12446,
    "_pg_statistic": 12028,
    "_pg_stats_ext": 12276,
    "_pg_transform": 12100,
    "_pg_ts_config": 12063,
    "_pg_ts_parser": 12069,
    "_regcollation": 4192,
    "_regnamespace": 4090,
    "_regprocedure": 2207,
    "_tsmultirange": 6152,
    "anycompatible": 5077,
    "anymultirange": 4537,
    "event_trigger": 3838,
    "nummultirange": 4532,
    "pg_constraint": 12003,
    "pg_conversion": 12049,
    "pg_init_privs": 12090,
    "pg_shseclabel": 4066,
    "pg_tablespace": 12056,
    "regdictionary": 3769,
    "txid_snapshot": 2970,
    "_nummultirange": 6151,
    "_pg_constraint": 12002,
    "_pg_conversion": 12048,
    "_pg_init_privs": 12089,
    "_pg_shseclabel": 12093,
    "_pg_tablespace": 12055,
    "_regdictionary": 3770,
    "_txid_snapshot": 2949,
    "datemultirange": 4535,
    "int4multirange": 4451,
    "int8multirange": 4536,
    "pg_ddl_command": 32,
    "pg_default_acl": 12088,
    "pg_description": 12041,
    "pg_largeobject": 12025,
    "pg_publication": 12105,
    "pg_stat_gssapi": 12464,
    "pg_ts_template": 12072,
    "tstzmultirange": 4534,
    "_datemultirange": 6155,
    "_int4multirange": 6150,
    "_int8multirange": 6157,
    "_pg_default_acl": 12087,
    "_pg_description": 12040,
    "_pg_largeobject": 12024,
    "_pg_publication": 12104,
    "_pg_stat_gssapi": 12463,
    "_pg_ts_template": 12071,
    "_tstzmultirange": 6153,
    "pg_auth_members": 2843,
    "pg_dependencies": 3402,
    "pg_subscription": 6101,
    "pg_user_mapping": 12080,
    "_pg_auth_members": 12058,
    "_pg_subscription": 12108,
    "_pg_user_mapping": 12079,
    "index_am_handler": 325,
    "language_handler": 2280,
    "pg_event_trigger": 12039,
    "pg_file_settings": 12329,
    "pg_foreign_table": 12082,
    "pg_shdescription": 12062,
    "pg_stat_activity": 12437,
    "pg_stat_archiver": 12496,
    "pg_stat_bgwriter": 12500,
    "pg_stat_database": 12477,
    "pg_statistic_ext": 12031,
    "pg_ts_config_map": 12066,
    "pg_user_mappings": 12538,
    "table_am_handler": 269,
    "_pg_event_trigger": 12038,
    "_pg_file_settings": 12328,
    "_pg_foreign_table": 12081,
    "_pg_shdescription": 12061,
    "_pg_stat_activity": 12436,
    "_pg_stat_archiver": 12495,
    "_pg_stat_bgwriter": 12499,
    "_pg_stat_database": 12476,
    "_pg_statistic_ext": 12030,
    "_pg_ts_config_map": 12065,
    "_pg_user_mappings": 12537,
    "pg_foreign_server": 12078,
    "pg_hba_file_rules": 12333,
    "pg_prepared_xacts": 12309,
    "pg_timezone_names": 12341,
    "_pg_foreign_server": 12077,
    "_pg_hba_file_rules": 12332,
    "_pg_prepared_xacts": 12308,
    "_pg_timezone_names": 12340,
    "anycompatiblearray": 5078,
    "anycompatiblerange": 5080,
    "pg_db_role_setting": 12054,
    "pg_publication_rel": 12107,
    "pg_stat_all_tables": 12357,
    "pg_stat_sys_tables": 12367,
    "pg_stats_ext_exprs": 12282,
    "_pg_db_role_setting": 12053,
    "_pg_publication_rel": 12106,
    "_pg_stat_all_tables": 12356,
    "_pg_stat_sys_tables": 12366,
    "_pg_stats_ext_exprs": 12281,
    "pg_stat_all_indexes": 12398,
    "pg_stat_replication": 12442,
    "pg_stat_sys_indexes": 12403,
    "pg_stat_user_tables": 12376,
    "pg_subscription_rel": 12110,
    "pg_timezone_abbrevs": 12337,
    "_pg_stat_all_indexes": 12397,
    "_pg_stat_replication": 12441,
    "_pg_stat_sys_indexes": 12402,
    "_pg_stat_user_tables": 12375,
    "_pg_subscription_rel": 12109,
    "_pg_timezone_abbrevs": 12336,
    "pg_partitioned_table": 12097,
    "pg_replication_slots": 12468,
    "pg_shmem_allocations": 12349,
    "pg_stat_subscription": 12455,
    "pg_stat_user_indexes": 12407,
    "pg_stat_wal_receiver": 12451,
    "pg_statio_all_tables": 12385,
    "pg_statio_sys_tables": 12390,
    "_pg_partitioned_table": 12096,
    "_pg_replication_slots": 12467,
    "_pg_shmem_allocations": 12348,
    "_pg_stat_subscription": 12454,
    "_pg_stat_user_indexes": 12406,
    "_pg_stat_wal_receiver": 12450,
    "_pg_statio_all_tables": 12384,
    "_pg_statio_sys_tables": 12389,
    "anycompatiblenonarray": 5079,
    "pg_brin_bloom_summary": 4600,
    "pg_publication_tables": 12287,
    "pg_replication_origin": 12086,
    "pg_stat_progress_copy": 12533,
    "pg_statio_all_indexes": 12411,
    "pg_statio_sys_indexes": 12416,
    "pg_statio_user_tables": 12394,
    "pg_statistic_ext_data": 12033,
    "_pg_publication_tables": 12286,
    "_pg_replication_origin": 12085,
    "_pg_stat_progress_copy": 12532,
    "_pg_statio_all_indexes": 12410,
    "_pg_statio_sys_indexes": 12415,
    "_pg_statio_user_tables": 12393,
    "_pg_statistic_ext_data": 12032,
    "pg_prepared_statements": 12314,
    "pg_stat_user_functions": 12486,
    "pg_statio_user_indexes": 12420,
    "_pg_prepared_statements": 12313,
    "_pg_stat_user_functions": 12485,
    "_pg_statio_user_indexes": 12419,
    "anycompatiblemultirange": 4538,
    "pg_available_extensions": 12300,
    "pg_foreign_data_wrapper": 12076,
    "pg_largeobject_metadata": 12023,
    "pg_stat_progress_vacuum": 12513,
    "pg_stat_xact_all_tables": 12362,
    "pg_stat_xact_sys_tables": 12372,
    "pg_statio_all_sequences": 12424,
    "pg_statio_sys_sequences": 12429,
    "_pg_available_extensions": 12299,
    "_pg_foreign_data_wrapper": 12075,
    "_pg_largeobject_metadata": 12022,
    "_pg_stat_progress_vacuum": 12512,
    "_pg_stat_xact_all_tables": 12361,
    "_pg_stat_xact_sys_tables": 12371,
    "_pg_statio_all_sequences": 12423,
    "_pg_statio_sys_sequences": 12428,
    "pg_stat_progress_analyze": 12508,
    "pg_stat_progress_cluster": 12518,
    "pg_stat_xact_user_tables": 12381,
    "pg_statio_user_sequences": 12433,
    "_pg_stat_progress_analyze": 12507,
    "_pg_stat_progress_cluster": 12517,
    "_pg_stat_xact_user_tables": 12380,
    "_pg_statio_user_sequences": 12432,
    "pg_stat_replication_slots": 12473,
    "_pg_stat_replication_slots": 12472,
    "pg_backend_memory_contexts": 12353,
    "pg_stat_database_conflicts": 12482,
    "_pg_backend_memory_contexts": 12352,
    "_pg_stat_database_conflicts": 12481,
    "pg_stat_progress_basebackup": 12528,
    "pg_stat_xact_user_functions": 12491,
    "_pg_stat_progress_basebackup": 12527,
    "_pg_stat_xact_user_functions": 12490,
    "pg_brin_minmax_multi_summary": 4601,
    "pg_replication_origin_status": 12543,
    "_pg_replication_origin_status": 12542,
    "pg_stat_progress_create_index": 12523,
    "_pg_stat_progress_create_index": 12522,
    "pg_available_extension_versions": 12304,
    "_pg_available_extension_versions": 12303
}
const parseFloat8 = pg.types.getTypeParser(builtins.float8, 'text')

export const PgCatalogOid: Record<number, [string, string]> = Object.fromEntries(Object.entries(builtins).map(([k, v]) => {
    return [String(v), ['pg_catalog', k]]
}))

export const PgCatalogParser: Record<string, Record<string, (raw: string) => any>> = {
    'pg_catalog': {
        'bool': pg.types.getTypeParser(builtins.bool, 'text'),
        '_bool': ArrayParser.create(pg.types.getTypeParser(builtins.bool, 'text')),
        'char': pg.types.getTypeParser(builtins.char, 'text'),
        '_char': ArrayParser.create(pg.types.getTypeParser(builtins.char, 'text')),
        'int8': pg.types.getTypeParser(builtins.int8, 'text'),
        '_int8': ArrayParser.create(pg.types.getTypeParser(builtins.int8, 'text')),
        'int2': pg.types.getTypeParser(builtins.int2, 'text'),
        '_int2': ArrayParser.create(pg.types.getTypeParser(builtins.int2, 'text')),
        'int4': pg.types.getTypeParser(builtins.int4, 'text'),
        '_int4': ArrayParser.create(pg.types.getTypeParser(builtins.int4, 'text')),
        'text': pg.types.getTypeParser(builtins.text, 'text'),
        '_text': ArrayParser.create(pg.types.getTypeParser(builtins.text, 'text')),
        'json': pg.types.getTypeParser(builtins.json, 'text'),
        '_json': ArrayParser.create(pg.types.getTypeParser(builtins.json, 'text')),
        'xml': pg.types.getTypeParser(builtins.xml, 'text'),
        '_xml': ArrayParser.create(pg.types.getTypeParser(builtins.xml, 'text')),
        'float4': pg.types.getTypeParser(builtins.float4, 'text'),
        '_float4': ArrayParser.create(pg.types.getTypeParser(builtins.float4, 'text')),
        'float8': pg.types.getTypeParser(builtins.float8, 'text'),
        '_float8': ArrayParser.create(pg.types.getTypeParser(builtins.float8, 'text')),
        'bpchar': pg.types.getTypeParser(builtins.bpchar, 'text'),
        '_bpchar': ArrayParser.create(pg.types.getTypeParser(builtins.bpchar, 'text')),
        'varchar': pg.types.getTypeParser(builtins.varchar, 'text'),
        '_varchar': ArrayParser.create(pg.types.getTypeParser(builtins.varchar, 'text')),
        'date': pg.types.getTypeParser(builtins.date, 'text'),
        '_date': ArrayParser.create(pg.types.getTypeParser(builtins.date, 'text')),
        'timestamp': pg.types.getTypeParser(builtins.timestamp, 'text'),
        '_timestamp': ArrayParser.create(pg.types.getTypeParser(builtins.timestamp, 'text')),
        'timestamptz': pg.types.getTypeParser(builtins.timestamptz, 'text'),
        '_timestamptz': ArrayParser.create(pg.types.getTypeParser(builtins.timestamptz, 'text')),
        'uuid': pg.types.getTypeParser(builtins.uuid, 'text'),
        '_uuid': ArrayParser.create(pg.types.getTypeParser(builtins.uuid, 'text')),
        'jsonb': pg.types.getTypeParser(builtins.jsonb, 'text'),
        '_jsonb': ArrayParser.create(pg.types.getTypeParser(builtins.jsonb, 'text')),
        'point': CompositeParser.create(['x', parseFloat8, 'y', parseFloat8]),
        '_point': ArrayParser.create(CompositeParser.create(['x', parseFloat8, 'y', parseFloat8])),
        'interval': pg.types.getTypeParser(builtins.interval, 'text'),
        '_interval': ArrayParser.create(pg.types.getTypeParser(builtins.interval, 'text'),),
        'bytea': pg.types.getTypeParser(builtins.bytea, 'text'),
        '_bytea': ArrayParser.create(pg.types.getTypeParser(builtins.bytea, 'text'),),
    }
}