// qgen TypeParser
import pg from 'pg';
const builtinOids: number[] = Object.values(pg.types.builtins);

// oid : 13405, type : alias, namespace : information_schema, name : cardinal_number
if(builtinOids.findIndex(v=>v === 13405)) { pg.types.setTypeParser(13405, 'text', (v)=>{}); }

// oid : 13404, type : array, namespace : information_schema, name : _cardinal_number
if(builtinOids.findIndex(v=>v === 13404)) { pg.types.setTypeParser(13404, 'text', (v)=>{}); }

// oid : 13407, type : array, namespace : information_schema, name : _character_data
if(builtinOids.findIndex(v=>v === 13407)) { pg.types.setTypeParser(13407, 'text', (v)=>{}); }

// oid : 13408, type : alias, namespace : information_schema, name : character_data
if(builtinOids.findIndex(v=>v === 13408)) { pg.types.setTypeParser(13408, 'text', (v)=>{}); }

// oid : 13410, type : alias, namespace : information_schema, name : sql_identifier
if(builtinOids.findIndex(v=>v === 13410)) { pg.types.setTypeParser(13410, 'text', (v)=>{}); }

// oid : 13409, type : array, namespace : information_schema, name : _sql_identifier
if(builtinOids.findIndex(v=>v === 13409)) { pg.types.setTypeParser(13409, 'text', (v)=>{}); }

// oid : 13416, type : alias, namespace : information_schema, name : time_stamp
if(builtinOids.findIndex(v=>v === 13416)) { pg.types.setTypeParser(13416, 'text', (v)=>{}); }

// oid : 13412, type : array, namespace : information_schema, name : _information_schema_catalog_name
if(builtinOids.findIndex(v=>v === 13412)) { pg.types.setTypeParser(13412, 'text', (v)=>{}); }

// oid : 13415, type : array, namespace : information_schema, name : _time_stamp
if(builtinOids.findIndex(v=>v === 13415)) { pg.types.setTypeParser(13415, 'text', (v)=>{}); }

// oid : 13413, type : class, namespace : information_schema, name : information_schema_catalog_name
if(builtinOids.findIndex(v=>v === 13413)) { pg.types.setTypeParser(13413, 'text', (v)=>{}); }

// oid : 13418, type : alias, namespace : information_schema, name : yes_or_no
if(builtinOids.findIndex(v=>v === 13418)) { pg.types.setTypeParser(13418, 'text', (v)=>{}); }

// oid : 13417, type : array, namespace : information_schema, name : _yes_or_no
if(builtinOids.findIndex(v=>v === 13417)) { pg.types.setTypeParser(13417, 'text', (v)=>{}); }

// oid : 13422, type : class, namespace : information_schema, name : applicable_roles
if(builtinOids.findIndex(v=>v === 13422)) { pg.types.setTypeParser(13422, 'text', (v)=>{}); }

// oid : 13427, type : class, namespace : information_schema, name : administrable_role_authorizations
if(builtinOids.findIndex(v=>v === 13427)) { pg.types.setTypeParser(13427, 'text', (v)=>{}); }

// oid : 13421, type : array, namespace : information_schema, name : _applicable_roles
if(builtinOids.findIndex(v=>v === 13421)) { pg.types.setTypeParser(13421, 'text', (v)=>{}); }

// oid : 13426, type : array, namespace : information_schema, name : _administrable_role_authorizations
if(builtinOids.findIndex(v=>v === 13426)) { pg.types.setTypeParser(13426, 'text', (v)=>{}); }

// oid : 13435, type : array, namespace : information_schema, name : _character_sets
if(builtinOids.findIndex(v=>v === 13435)) { pg.types.setTypeParser(13435, 'text', (v)=>{}); }

// oid : 13441, type : class, namespace : information_schema, name : check_constraint_routine_usage
if(builtinOids.findIndex(v=>v === 13441)) { pg.types.setTypeParser(13441, 'text', (v)=>{}); }

// oid : 13431, type : class, namespace : information_schema, name : attributes
if(builtinOids.findIndex(v=>v === 13431)) { pg.types.setTypeParser(13431, 'text', (v)=>{}); }

// oid : 13436, type : class, namespace : information_schema, name : character_sets
if(builtinOids.findIndex(v=>v === 13436)) { pg.types.setTypeParser(13436, 'text', (v)=>{}); }

// oid : 13430, type : array, namespace : information_schema, name : _attributes
if(builtinOids.findIndex(v=>v === 13430)) { pg.types.setTypeParser(13430, 'text', (v)=>{}); }

// oid : 13440, type : array, namespace : information_schema, name : _check_constraint_routine_usage
if(builtinOids.findIndex(v=>v === 13440)) { pg.types.setTypeParser(13440, 'text', (v)=>{}); }

// oid : 13446, type : class, namespace : information_schema, name : check_constraints
if(builtinOids.findIndex(v=>v === 13446)) { pg.types.setTypeParser(13446, 'text', (v)=>{}); }

// oid : 13445, type : array, namespace : information_schema, name : _check_constraints
if(builtinOids.findIndex(v=>v === 13445)) { pg.types.setTypeParser(13445, 'text', (v)=>{}); }

// oid : 13451, type : class, namespace : information_schema, name : collations
if(builtinOids.findIndex(v=>v === 13451)) { pg.types.setTypeParser(13451, 'text', (v)=>{}); }

// oid : 13456, type : class, namespace : information_schema, name : collation_character_set_applicability
if(builtinOids.findIndex(v=>v === 13456)) { pg.types.setTypeParser(13456, 'text', (v)=>{}); }

// oid : 13450, type : array, namespace : information_schema, name : _collations
if(builtinOids.findIndex(v=>v === 13450)) { pg.types.setTypeParser(13450, 'text', (v)=>{}); }

// oid : 13461, type : class, namespace : information_schema, name : column_column_usage
if(builtinOids.findIndex(v=>v === 13461)) { pg.types.setTypeParser(13461, 'text', (v)=>{}); }

// oid : 13455, type : array, namespace : information_schema, name : _collation_character_set_applicability
if(builtinOids.findIndex(v=>v === 13455)) { pg.types.setTypeParser(13455, 'text', (v)=>{}); }

// oid : 13466, type : class, namespace : information_schema, name : column_domain_usage
if(builtinOids.findIndex(v=>v === 13466)) { pg.types.setTypeParser(13466, 'text', (v)=>{}); }

// oid : 13471, type : class, namespace : information_schema, name : column_privileges
if(builtinOids.findIndex(v=>v === 13471)) { pg.types.setTypeParser(13471, 'text', (v)=>{}); }

// oid : 13460, type : array, namespace : information_schema, name : _column_column_usage
if(builtinOids.findIndex(v=>v === 13460)) { pg.types.setTypeParser(13460, 'text', (v)=>{}); }

// oid : 13476, type : class, namespace : information_schema, name : column_udt_usage
if(builtinOids.findIndex(v=>v === 13476)) { pg.types.setTypeParser(13476, 'text', (v)=>{}); }

// oid : 13465, type : array, namespace : information_schema, name : _column_domain_usage
if(builtinOids.findIndex(v=>v === 13465)) { pg.types.setTypeParser(13465, 'text', (v)=>{}); }

// oid : 13475, type : array, namespace : information_schema, name : _column_udt_usage
if(builtinOids.findIndex(v=>v === 13475)) { pg.types.setTypeParser(13475, 'text', (v)=>{}); }

// oid : 13470, type : array, namespace : information_schema, name : _column_privileges
if(builtinOids.findIndex(v=>v === 13470)) { pg.types.setTypeParser(13470, 'text', (v)=>{}); }

// oid : 13485, type : array, namespace : information_schema, name : _constraint_column_usage
if(builtinOids.findIndex(v=>v === 13485)) { pg.types.setTypeParser(13485, 'text', (v)=>{}); }

// oid : 13481, type : class, namespace : information_schema, name : columns
if(builtinOids.findIndex(v=>v === 13481)) { pg.types.setTypeParser(13481, 'text', (v)=>{}); }

// oid : 13486, type : class, namespace : information_schema, name : constraint_column_usage
if(builtinOids.findIndex(v=>v === 13486)) { pg.types.setTypeParser(13486, 'text', (v)=>{}); }

// oid : 13491, type : class, namespace : information_schema, name : constraint_table_usage
if(builtinOids.findIndex(v=>v === 13491)) { pg.types.setTypeParser(13491, 'text', (v)=>{}); }

// oid : 13490, type : array, namespace : information_schema, name : _constraint_table_usage
if(builtinOids.findIndex(v=>v === 13490)) { pg.types.setTypeParser(13490, 'text', (v)=>{}); }

// oid : 13480, type : array, namespace : information_schema, name : _columns
if(builtinOids.findIndex(v=>v === 13480)) { pg.types.setTypeParser(13480, 'text', (v)=>{}); }

// oid : 13496, type : class, namespace : information_schema, name : domain_constraints
if(builtinOids.findIndex(v=>v === 13496)) { pg.types.setTypeParser(13496, 'text', (v)=>{}); }

// oid : 13495, type : array, namespace : information_schema, name : _domain_constraints
if(builtinOids.findIndex(v=>v === 13495)) { pg.types.setTypeParser(13495, 'text', (v)=>{}); }

// oid : 13506, type : class, namespace : information_schema, name : domains
if(builtinOids.findIndex(v=>v === 13506)) { pg.types.setTypeParser(13506, 'text', (v)=>{}); }

// oid : 13500, type : array, namespace : information_schema, name : _domain_udt_usage
if(builtinOids.findIndex(v=>v === 13500)) { pg.types.setTypeParser(13500, 'text', (v)=>{}); }

// oid : 13501, type : class, namespace : information_schema, name : domain_udt_usage
if(builtinOids.findIndex(v=>v === 13501)) { pg.types.setTypeParser(13501, 'text', (v)=>{}); }

// oid : 13505, type : array, namespace : information_schema, name : _domains
if(builtinOids.findIndex(v=>v === 13505)) { pg.types.setTypeParser(13505, 'text', (v)=>{}); }

// oid : 13511, type : class, namespace : information_schema, name : enabled_roles
if(builtinOids.findIndex(v=>v === 13511)) { pg.types.setTypeParser(13511, 'text', (v)=>{}); }

// oid : 13510, type : array, namespace : information_schema, name : _enabled_roles
if(builtinOids.findIndex(v=>v === 13510)) { pg.types.setTypeParser(13510, 'text', (v)=>{}); }

// oid : 13514, type : array, namespace : information_schema, name : _key_column_usage
if(builtinOids.findIndex(v=>v === 13514)) { pg.types.setTypeParser(13514, 'text', (v)=>{}); }

// oid : 13519, type : array, namespace : information_schema, name : _parameters
if(builtinOids.findIndex(v=>v === 13519)) { pg.types.setTypeParser(13519, 'text', (v)=>{}); }

// oid : 13515, type : class, namespace : information_schema, name : key_column_usage
if(builtinOids.findIndex(v=>v === 13515)) { pg.types.setTypeParser(13515, 'text', (v)=>{}); }

// oid : 13525, type : class, namespace : information_schema, name : referential_constraints
if(builtinOids.findIndex(v=>v === 13525)) { pg.types.setTypeParser(13525, 'text', (v)=>{}); }

// oid : 13520, type : class, namespace : information_schema, name : parameters
if(builtinOids.findIndex(v=>v === 13520)) { pg.types.setTypeParser(13520, 'text', (v)=>{}); }

// oid : 13524, type : array, namespace : information_schema, name : _referential_constraints
if(builtinOids.findIndex(v=>v === 13524)) { pg.types.setTypeParser(13524, 'text', (v)=>{}); }

// oid : 13530, type : class, namespace : information_schema, name : role_column_grants
if(builtinOids.findIndex(v=>v === 13530)) { pg.types.setTypeParser(13530, 'text', (v)=>{}); }

// oid : 13529, type : array, namespace : information_schema, name : _role_column_grants
if(builtinOids.findIndex(v=>v === 13529)) { pg.types.setTypeParser(13529, 'text', (v)=>{}); }

// oid : 13533, type : array, namespace : information_schema, name : _routine_column_usage
if(builtinOids.findIndex(v=>v === 13533)) { pg.types.setTypeParser(13533, 'text', (v)=>{}); }

// oid : 13538, type : array, namespace : information_schema, name : _routine_privileges
if(builtinOids.findIndex(v=>v === 13538)) { pg.types.setTypeParser(13538, 'text', (v)=>{}); }

// oid : 13544, type : class, namespace : information_schema, name : role_routine_grants
if(builtinOids.findIndex(v=>v === 13544)) { pg.types.setTypeParser(13544, 'text', (v)=>{}); }

// oid : 13534, type : class, namespace : information_schema, name : routine_column_usage
if(builtinOids.findIndex(v=>v === 13534)) { pg.types.setTypeParser(13534, 'text', (v)=>{}); }

// oid : 13548, type : class, namespace : information_schema, name : routine_routine_usage
if(builtinOids.findIndex(v=>v === 13548)) { pg.types.setTypeParser(13548, 'text', (v)=>{}); }

// oid : 13539, type : class, namespace : information_schema, name : routine_privileges
if(builtinOids.findIndex(v=>v === 13539)) { pg.types.setTypeParser(13539, 'text', (v)=>{}); }

// oid : 13547, type : array, namespace : information_schema, name : _routine_routine_usage
if(builtinOids.findIndex(v=>v === 13547)) { pg.types.setTypeParser(13547, 'text', (v)=>{}); }

// oid : 13552, type : array, namespace : information_schema, name : _routine_sequence_usage
if(builtinOids.findIndex(v=>v === 13552)) { pg.types.setTypeParser(13552, 'text', (v)=>{}); }

// oid : 13553, type : class, namespace : information_schema, name : routine_sequence_usage
if(builtinOids.findIndex(v=>v === 13553)) { pg.types.setTypeParser(13553, 'text', (v)=>{}); }

// oid : 13558, type : class, namespace : information_schema, name : routine_table_usage
if(builtinOids.findIndex(v=>v === 13558)) { pg.types.setTypeParser(13558, 'text', (v)=>{}); }

// oid : 13543, type : array, namespace : information_schema, name : _role_routine_grants
if(builtinOids.findIndex(v=>v === 13543)) { pg.types.setTypeParser(13543, 'text', (v)=>{}); }

// oid : 13563, type : class, namespace : information_schema, name : routines
if(builtinOids.findIndex(v=>v === 13563)) { pg.types.setTypeParser(13563, 'text', (v)=>{}); }

// oid : 13557, type : array, namespace : information_schema, name : _routine_table_usage
if(builtinOids.findIndex(v=>v === 13557)) { pg.types.setTypeParser(13557, 'text', (v)=>{}); }

// oid : 13568, type : class, namespace : information_schema, name : schemata
if(builtinOids.findIndex(v=>v === 13568)) { pg.types.setTypeParser(13568, 'text', (v)=>{}); }

// oid : 13562, type : array, namespace : information_schema, name : _routines
if(builtinOids.findIndex(v=>v === 13562)) { pg.types.setTypeParser(13562, 'text', (v)=>{}); }

// oid : 13567, type : array, namespace : information_schema, name : _schemata
if(builtinOids.findIndex(v=>v === 13567)) { pg.types.setTypeParser(13567, 'text', (v)=>{}); }

// oid : 13572, type : class, namespace : information_schema, name : sequences
if(builtinOids.findIndex(v=>v === 13572)) { pg.types.setTypeParser(13572, 'text', (v)=>{}); }

// oid : 13571, type : array, namespace : information_schema, name : _sequences
if(builtinOids.findIndex(v=>v === 13571)) { pg.types.setTypeParser(13571, 'text', (v)=>{}); }

// oid : 13576, type : array, namespace : information_schema, name : _sql_features
if(builtinOids.findIndex(v=>v === 13576)) { pg.types.setTypeParser(13576, 'text', (v)=>{}); }

// oid : 13582, type : class, namespace : information_schema, name : sql_implementation_info
if(builtinOids.findIndex(v=>v === 13582)) { pg.types.setTypeParser(13582, 'text', (v)=>{}); }

// oid : 13581, type : array, namespace : information_schema, name : _sql_implementation_info
if(builtinOids.findIndex(v=>v === 13581)) { pg.types.setTypeParser(13581, 'text', (v)=>{}); }

// oid : 13586, type : array, namespace : information_schema, name : _sql_parts
if(builtinOids.findIndex(v=>v === 13586)) { pg.types.setTypeParser(13586, 'text', (v)=>{}); }

// oid : 13577, type : class, namespace : information_schema, name : sql_features
if(builtinOids.findIndex(v=>v === 13577)) { pg.types.setTypeParser(13577, 'text', (v)=>{}); }

// oid : 13587, type : class, namespace : information_schema, name : sql_parts
if(builtinOids.findIndex(v=>v === 13587)) { pg.types.setTypeParser(13587, 'text', (v)=>{}); }

// oid : 13591, type : array, namespace : information_schema, name : _sql_sizing
if(builtinOids.findIndex(v=>v === 13591)) { pg.types.setTypeParser(13591, 'text', (v)=>{}); }

// oid : 13597, type : class, namespace : information_schema, name : table_constraints
if(builtinOids.findIndex(v=>v === 13597)) { pg.types.setTypeParser(13597, 'text', (v)=>{}); }

// oid : 13592, type : class, namespace : information_schema, name : sql_sizing
if(builtinOids.findIndex(v=>v === 13592)) { pg.types.setTypeParser(13592, 'text', (v)=>{}); }

// oid : 13602, type : class, namespace : information_schema, name : table_privileges
if(builtinOids.findIndex(v=>v === 13602)) { pg.types.setTypeParser(13602, 'text', (v)=>{}); }

// oid : 13601, type : array, namespace : information_schema, name : _table_privileges
if(builtinOids.findIndex(v=>v === 13601)) { pg.types.setTypeParser(13601, 'text', (v)=>{}); }

// oid : 13596, type : array, namespace : information_schema, name : _table_constraints
if(builtinOids.findIndex(v=>v === 13596)) { pg.types.setTypeParser(13596, 'text', (v)=>{}); }

// oid : 13607, type : class, namespace : information_schema, name : role_table_grants
if(builtinOids.findIndex(v=>v === 13607)) { pg.types.setTypeParser(13607, 'text', (v)=>{}); }

// oid : 13606, type : array, namespace : information_schema, name : _role_table_grants
if(builtinOids.findIndex(v=>v === 13606)) { pg.types.setTypeParser(13606, 'text', (v)=>{}); }

// oid : 13616, type : class, namespace : information_schema, name : transforms
if(builtinOids.findIndex(v=>v === 13616)) { pg.types.setTypeParser(13616, 'text', (v)=>{}); }

// oid : 13610, type : array, namespace : information_schema, name : _tables
if(builtinOids.findIndex(v=>v === 13610)) { pg.types.setTypeParser(13610, 'text', (v)=>{}); }

// oid : 13611, type : class, namespace : information_schema, name : tables
if(builtinOids.findIndex(v=>v === 13611)) { pg.types.setTypeParser(13611, 'text', (v)=>{}); }

// oid : 13615, type : array, namespace : information_schema, name : _transforms
if(builtinOids.findIndex(v=>v === 13615)) { pg.types.setTypeParser(13615, 'text', (v)=>{}); }

// oid : 13621, type : class, namespace : information_schema, name : triggered_update_columns
if(builtinOids.findIndex(v=>v === 13621)) { pg.types.setTypeParser(13621, 'text', (v)=>{}); }

// oid : 13620, type : array, namespace : information_schema, name : _triggered_update_columns
if(builtinOids.findIndex(v=>v === 13620)) { pg.types.setTypeParser(13620, 'text', (v)=>{}); }

// oid : 13626, type : class, namespace : information_schema, name : triggers
if(builtinOids.findIndex(v=>v === 13626)) { pg.types.setTypeParser(13626, 'text', (v)=>{}); }

// oid : 13631, type : class, namespace : information_schema, name : udt_privileges
if(builtinOids.findIndex(v=>v === 13631)) { pg.types.setTypeParser(13631, 'text', (v)=>{}); }

// oid : 13630, type : array, namespace : information_schema, name : _udt_privileges
if(builtinOids.findIndex(v=>v === 13630)) { pg.types.setTypeParser(13630, 'text', (v)=>{}); }

// oid : 13625, type : array, namespace : information_schema, name : _triggers
if(builtinOids.findIndex(v=>v === 13625)) { pg.types.setTypeParser(13625, 'text', (v)=>{}); }

// oid : 13640, type : class, namespace : information_schema, name : usage_privileges
if(builtinOids.findIndex(v=>v === 13640)) { pg.types.setTypeParser(13640, 'text', (v)=>{}); }

// oid : 13639, type : array, namespace : information_schema, name : _usage_privileges
if(builtinOids.findIndex(v=>v === 13639)) { pg.types.setTypeParser(13639, 'text', (v)=>{}); }

// oid : 13645, type : class, namespace : information_schema, name : role_usage_grants
if(builtinOids.findIndex(v=>v === 13645)) { pg.types.setTypeParser(13645, 'text', (v)=>{}); }

// oid : 13644, type : array, namespace : information_schema, name : _role_usage_grants
if(builtinOids.findIndex(v=>v === 13644)) { pg.types.setTypeParser(13644, 'text', (v)=>{}); }

// oid : 13636, type : class, namespace : information_schema, name : role_udt_grants
if(builtinOids.findIndex(v=>v === 13636)) { pg.types.setTypeParser(13636, 'text', (v)=>{}); }

// oid : 13648, type : array, namespace : information_schema, name : _user_defined_types
if(builtinOids.findIndex(v=>v === 13648)) { pg.types.setTypeParser(13648, 'text', (v)=>{}); }

// oid : 13654, type : class, namespace : information_schema, name : view_column_usage
if(builtinOids.findIndex(v=>v === 13654)) { pg.types.setTypeParser(13654, 'text', (v)=>{}); }

// oid : 13649, type : class, namespace : information_schema, name : user_defined_types
if(builtinOids.findIndex(v=>v === 13649)) { pg.types.setTypeParser(13649, 'text', (v)=>{}); }

// oid : 13653, type : array, namespace : information_schema, name : _view_column_usage
if(builtinOids.findIndex(v=>v === 13653)) { pg.types.setTypeParser(13653, 'text', (v)=>{}); }

// oid : 13635, type : array, namespace : information_schema, name : _role_udt_grants
if(builtinOids.findIndex(v=>v === 13635)) { pg.types.setTypeParser(13635, 'text', (v)=>{}); }

// oid : 13658, type : array, namespace : information_schema, name : _view_routine_usage
if(builtinOids.findIndex(v=>v === 13658)) { pg.types.setTypeParser(13658, 'text', (v)=>{}); }

// oid : 13659, type : class, namespace : information_schema, name : view_routine_usage
if(builtinOids.findIndex(v=>v === 13659)) { pg.types.setTypeParser(13659, 'text', (v)=>{}); }

// oid : 13663, type : array, namespace : information_schema, name : _view_table_usage
if(builtinOids.findIndex(v=>v === 13663)) { pg.types.setTypeParser(13663, 'text', (v)=>{}); }

// oid : 13668, type : array, namespace : information_schema, name : _views
if(builtinOids.findIndex(v=>v === 13668)) { pg.types.setTypeParser(13668, 'text', (v)=>{}); }

// oid : 13664, type : class, namespace : information_schema, name : view_table_usage
if(builtinOids.findIndex(v=>v === 13664)) { pg.types.setTypeParser(13664, 'text', (v)=>{}); }

// oid : 13674, type : class, namespace : information_schema, name : data_type_privileges
if(builtinOids.findIndex(v=>v === 13674)) { pg.types.setTypeParser(13674, 'text', (v)=>{}); }

// oid : 13673, type : array, namespace : information_schema, name : _data_type_privileges
if(builtinOids.findIndex(v=>v === 13673)) { pg.types.setTypeParser(13673, 'text', (v)=>{}); }

// oid : 13669, type : class, namespace : information_schema, name : views
if(builtinOids.findIndex(v=>v === 13669)) { pg.types.setTypeParser(13669, 'text', (v)=>{}); }

// oid : 13679, type : class, namespace : information_schema, name : element_types
if(builtinOids.findIndex(v=>v === 13679)) { pg.types.setTypeParser(13679, 'text', (v)=>{}); }

// oid : 13684, type : class, namespace : information_schema, name : _pg_foreign_table_columns
if(builtinOids.findIndex(v=>v === 13684)) { pg.types.setTypeParser(13684, 'text', (v)=>{}); }

// oid : 13683, type : array, namespace : information_schema, name : __pg_foreign_table_columns
if(builtinOids.findIndex(v=>v === 13683)) { pg.types.setTypeParser(13683, 'text', (v)=>{}); }

// oid : 13689, type : class, namespace : information_schema, name : column_options
if(builtinOids.findIndex(v=>v === 13689)) { pg.types.setTypeParser(13689, 'text', (v)=>{}); }

// oid : 13688, type : array, namespace : information_schema, name : _column_options
if(builtinOids.findIndex(v=>v === 13688)) { pg.types.setTypeParser(13688, 'text', (v)=>{}); }

// oid : 13693, type : class, namespace : information_schema, name : _pg_foreign_data_wrappers
if(builtinOids.findIndex(v=>v === 13693)) { pg.types.setTypeParser(13693, 'text', (v)=>{}); }

// oid : 13692, type : array, namespace : information_schema, name : __pg_foreign_data_wrappers
if(builtinOids.findIndex(v=>v === 13692)) { pg.types.setTypeParser(13692, 'text', (v)=>{}); }

// oid : 13697, type : class, namespace : information_schema, name : foreign_data_wrapper_options
if(builtinOids.findIndex(v=>v === 13697)) { pg.types.setTypeParser(13697, 'text', (v)=>{}); }

// oid : 13696, type : array, namespace : information_schema, name : _foreign_data_wrapper_options
if(builtinOids.findIndex(v=>v === 13696)) { pg.types.setTypeParser(13696, 'text', (v)=>{}); }

// oid : 13678, type : array, namespace : information_schema, name : _element_types
if(builtinOids.findIndex(v=>v === 13678)) { pg.types.setTypeParser(13678, 'text', (v)=>{}); }

// oid : 13701, type : class, namespace : information_schema, name : foreign_data_wrappers
if(builtinOids.findIndex(v=>v === 13701)) { pg.types.setTypeParser(13701, 'text', (v)=>{}); }

// oid : 13704, type : array, namespace : information_schema, name : __pg_foreign_servers
if(builtinOids.findIndex(v=>v === 13704)) { pg.types.setTypeParser(13704, 'text', (v)=>{}); }

// oid : 13700, type : array, namespace : information_schema, name : _foreign_data_wrappers
if(builtinOids.findIndex(v=>v === 13700)) { pg.types.setTypeParser(13700, 'text', (v)=>{}); }

// oid : 13709, type : array, namespace : information_schema, name : _foreign_server_options
if(builtinOids.findIndex(v=>v === 13709)) { pg.types.setTypeParser(13709, 'text', (v)=>{}); }

// oid : 13714, type : class, namespace : information_schema, name : foreign_servers
if(builtinOids.findIndex(v=>v === 13714)) { pg.types.setTypeParser(13714, 'text', (v)=>{}); }

// oid : 13705, type : class, namespace : information_schema, name : _pg_foreign_servers
if(builtinOids.findIndex(v=>v === 13705)) { pg.types.setTypeParser(13705, 'text', (v)=>{}); }

// oid : 13710, type : class, namespace : information_schema, name : foreign_server_options
if(builtinOids.findIndex(v=>v === 13710)) { pg.types.setTypeParser(13710, 'text', (v)=>{}); }

// oid : 13713, type : array, namespace : information_schema, name : _foreign_servers
if(builtinOids.findIndex(v=>v === 13713)) { pg.types.setTypeParser(13713, 'text', (v)=>{}); }

// oid : 13718, type : class, namespace : information_schema, name : _pg_foreign_tables
if(builtinOids.findIndex(v=>v === 13718)) { pg.types.setTypeParser(13718, 'text', (v)=>{}); }

// oid : 13723, type : class, namespace : information_schema, name : foreign_table_options
if(builtinOids.findIndex(v=>v === 13723)) { pg.types.setTypeParser(13723, 'text', (v)=>{}); }

// oid : 13722, type : array, namespace : information_schema, name : _foreign_table_options
if(builtinOids.findIndex(v=>v === 13722)) { pg.types.setTypeParser(13722, 'text', (v)=>{}); }

// oid : 13726, type : array, namespace : information_schema, name : _foreign_tables
if(builtinOids.findIndex(v=>v === 13726)) { pg.types.setTypeParser(13726, 'text', (v)=>{}); }

// oid : 13717, type : array, namespace : information_schema, name : __pg_foreign_tables
if(builtinOids.findIndex(v=>v === 13717)) { pg.types.setTypeParser(13717, 'text', (v)=>{}); }

// oid : 13730, type : array, namespace : information_schema, name : __pg_user_mappings
if(builtinOids.findIndex(v=>v === 13730)) { pg.types.setTypeParser(13730, 'text', (v)=>{}); }

// oid : 13731, type : class, namespace : information_schema, name : _pg_user_mappings
if(builtinOids.findIndex(v=>v === 13731)) { pg.types.setTypeParser(13731, 'text', (v)=>{}); }

// oid : 13736, type : class, namespace : information_schema, name : user_mapping_options
if(builtinOids.findIndex(v=>v === 13736)) { pg.types.setTypeParser(13736, 'text', (v)=>{}); }

// oid : 13735, type : array, namespace : information_schema, name : _user_mapping_options
if(builtinOids.findIndex(v=>v === 13735)) { pg.types.setTypeParser(13735, 'text', (v)=>{}); }

// oid : 13727, type : class, namespace : information_schema, name : foreign_tables
if(builtinOids.findIndex(v=>v === 13727)) { pg.types.setTypeParser(13727, 'text', (v)=>{}); }

// oid : 13741, type : class, namespace : information_schema, name : user_mappings
if(builtinOids.findIndex(v=>v === 13741)) { pg.types.setTypeParser(13741, 'text', (v)=>{}); }

// oid : 13740, type : array, namespace : information_schema, name : _user_mappings
if(builtinOids.findIndex(v=>v === 13740)) { pg.types.setTypeParser(13740, 'text', (v)=>{}); }

// oid : 16402, type : array, namespace : public, name : _yn
if(builtinOids.findIndex(v=>v === 16402)) { pg.types.setTypeParser(16402, 'text', (v)=>{}); }

// oid : 33726, type : class, namespace : enums, name : error_code
if(builtinOids.findIndex(v=>v === 33726)) { pg.types.setTypeParser(33726, 'text', (v)=>{}); }

// oid : 16405, type : array, namespace : public, name : _text_name
if(builtinOids.findIndex(v=>v === 16405)) { pg.types.setTypeParser(16405, 'text', (v)=>{}); }

// oid : 16406, type : alias, namespace : public, name : text_name
if(builtinOids.findIndex(v=>v === 16406)) { pg.types.setTypeParser(16406, 'text', (v)=>{}); }

// oid : 16408, type : alias, namespace : public, name : text_title
if(builtinOids.findIndex(v=>v === 16408)) { pg.types.setTypeParser(16408, 'text', (v)=>{}); }

// oid : 16407, type : array, namespace : public, name : _text_title
if(builtinOids.findIndex(v=>v === 16407)) { pg.types.setTypeParser(16407, 'text', (v)=>{}); }

// oid : 16409, type : array, namespace : public, name : _text_content
if(builtinOids.findIndex(v=>v === 16409)) { pg.types.setTypeParser(16409, 'text', (v)=>{}); }

// oid : 16412, type : alias, namespace : public, name : text_markdown
if(builtinOids.findIndex(v=>v === 16412)) { pg.types.setTypeParser(16412, 'text', (v)=>{}); }

// oid : 16410, type : alias, namespace : public, name : text_content
if(builtinOids.findIndex(v=>v === 16410)) { pg.types.setTypeParser(16410, 'text', (v)=>{}); }

// oid : 16411, type : array, namespace : public, name : _text_markdown
if(builtinOids.findIndex(v=>v === 16411)) { pg.types.setTypeParser(16411, 'text', (v)=>{}); }

// oid : 16413, type : array, namespace : public, name : _text_short_content
if(builtinOids.findIndex(v=>v === 16413)) { pg.types.setTypeParser(16413, 'text', (v)=>{}); }

// oid : 16416, type : alias, namespace : public, name : text_word
if(builtinOids.findIndex(v=>v === 16416)) { pg.types.setTypeParser(16416, 'text', (v)=>{}); }

// oid : 16414, type : alias, namespace : public, name : text_short_content
if(builtinOids.findIndex(v=>v === 16414)) { pg.types.setTypeParser(16414, 'text', (v)=>{}); }

// oid : 16415, type : array, namespace : public, name : _text_word
if(builtinOids.findIndex(v=>v === 16415)) { pg.types.setTypeParser(16415, 'text', (v)=>{}); }

// oid : 16418, type : alias, namespace : public, name : text_url
if(builtinOids.findIndex(v=>v === 16418)) { pg.types.setTypeParser(16418, 'text', (v)=>{}); }

// oid : 16417, type : array, namespace : public, name : _text_url
if(builtinOids.findIndex(v=>v === 16417)) { pg.types.setTypeParser(16417, 'text', (v)=>{}); }

// oid : 16419, type : array, namespace : public, name : _text_email
if(builtinOids.findIndex(v=>v === 16419)) { pg.types.setTypeParser(16419, 'text', (v)=>{}); }

// oid : 16422, type : alias, namespace : public, name : text_phone_number
if(builtinOids.findIndex(v=>v === 16422)) { pg.types.setTypeParser(16422, 'text', (v)=>{}); }

// oid : 16421, type : array, namespace : public, name : _text_phone_number
if(builtinOids.findIndex(v=>v === 16421)) { pg.types.setTypeParser(16421, 'text', (v)=>{}); }

// oid : 16420, type : alias, namespace : public, name : text_email
if(builtinOids.findIndex(v=>v === 16420)) { pg.types.setTypeParser(16420, 'text', (v)=>{}); }

// oid : 16424, type : alias, namespace : public, name : text_filepath
if(builtinOids.findIndex(v=>v === 16424)) { pg.types.setTypeParser(16424, 'text', (v)=>{}); }

// oid : 16423, type : array, namespace : public, name : _text_filepath
if(builtinOids.findIndex(v=>v === 16423)) { pg.types.setTypeParser(16423, 'text', (v)=>{}); }

// oid : 16425, type : array, namespace : public, name : _text_mime
if(builtinOids.findIndex(v=>v === 16425)) { pg.types.setTypeParser(16425, 'text', (v)=>{}); }

// oid : 16403, type : alias, namespace : public, name : yn
if(builtinOids.findIndex(v=>v === 16403)) { pg.types.setTypeParser(16403, 'text', (v)=>{}); }

// oid : 16426, type : alias, namespace : public, name : text_mime
if(builtinOids.findIndex(v=>v === 16426)) { pg.types.setTypeParser(16426, 'text', (v)=>{}); }

// oid : 33725, type : array, namespace : enums, name : _error_code
if(builtinOids.findIndex(v=>v === 33725)) { pg.types.setTypeParser(33725, 'text', (v)=>{}); }

// oid : 33746, type : class, namespace : enums, name : panlty_cause
if(builtinOids.findIndex(v=>v === 33746)) { pg.types.setTypeParser(33746, 'text', (v)=>{}); }

// oid : 33735, type : array, namespace : enums, name : _gender
if(builtinOids.findIndex(v=>v === 33735)) { pg.types.setTypeParser(33735, 'text', (v)=>{}); }

// oid : 33745, type : array, namespace : enums, name : _panlty_cause
if(builtinOids.findIndex(v=>v === 33745)) { pg.types.setTypeParser(33745, 'text', (v)=>{}); }

// oid : 33756, type : class, namespace : enums, name : movein
if(builtinOids.findIndex(v=>v === 33756)) { pg.types.setTypeParser(33756, 'text', (v)=>{}); }

// oid : 33766, type : class, namespace : enums, name : mncst_type
if(builtinOids.findIndex(v=>v === 33766)) { pg.types.setTypeParser(33766, 'text', (v)=>{}); }

// oid : 33736, type : class, namespace : enums, name : gender
if(builtinOids.findIndex(v=>v === 33736)) { pg.types.setTypeParser(33736, 'text', (v)=>{}); }

// oid : 33755, type : array, namespace : enums, name : _movein
if(builtinOids.findIndex(v=>v === 33755)) { pg.types.setTypeParser(33755, 'text', (v)=>{}); }

// oid : 33765, type : array, namespace : enums, name : _mncst_type
if(builtinOids.findIndex(v=>v === 33765)) { pg.types.setTypeParser(33765, 'text', (v)=>{}); }

// oid : 33786, type : class, namespace : enums, name : bld_type
if(builtinOids.findIndex(v=>v === 33786)) { pg.types.setTypeParser(33786, 'text', (v)=>{}); }

// oid : 33776, type : class, namespace : enums, name : mncst_kind
if(builtinOids.findIndex(v=>v === 33776)) { pg.types.setTypeParser(33776, 'text', (v)=>{}); }

// oid : 33796, type : class, namespace : enums, name : batch_cause
if(builtinOids.findIndex(v=>v === 33796)) { pg.types.setTypeParser(33796, 'text', (v)=>{}); }

// oid : 33775, type : array, namespace : enums, name : _mncst_kind
if(builtinOids.findIndex(v=>v === 33775)) { pg.types.setTypeParser(33775, 'text', (v)=>{}); }

// oid : 33795, type : array, namespace : enums, name : _batch_cause
if(builtinOids.findIndex(v=>v === 33795)) { pg.types.setTypeParser(33795, 'text', (v)=>{}); }

// oid : 33806, type : class, namespace : enums, name : price_type
if(builtinOids.findIndex(v=>v === 33806)) { pg.types.setTypeParser(33806, 'text', (v)=>{}); }

// oid : 33805, type : array, namespace : enums, name : _price_type
if(builtinOids.findIndex(v=>v === 33805)) { pg.types.setTypeParser(33805, 'text', (v)=>{}); }

// oid : 33815, type : array, namespace : enums, name : _bank
if(builtinOids.findIndex(v=>v === 33815)) { pg.types.setTypeParser(33815, 'text', (v)=>{}); }

// oid : 33785, type : array, namespace : enums, name : _bld_type
if(builtinOids.findIndex(v=>v === 33785)) { pg.types.setTypeParser(33785, 'text', (v)=>{}); }

// oid : 33826, type : class, namespace : enums, name : paymnt_usage
if(builtinOids.findIndex(v=>v === 33826)) { pg.types.setTypeParser(33826, 'text', (v)=>{}); }

// oid : 33825, type : array, namespace : enums, name : _paymnt_usage
if(builtinOids.findIndex(v=>v === 33825)) { pg.types.setTypeParser(33825, 'text', (v)=>{}); }

// oid : 51709, type : array, namespace : bzv, name : _mask_user_info
if(builtinOids.findIndex(v=>v === 51709)) { pg.types.setTypeParser(51709, 'text', (v)=>{}); }

// oid : 33816, type : class, namespace : enums, name : bank
if(builtinOids.findIndex(v=>v === 33816)) { pg.types.setTypeParser(33816, 'text', (v)=>{}); }

// oid : 33856, type : class, namespace : enums, name : cardinal_point
if(builtinOids.findIndex(v=>v === 33856)) { pg.types.setTypeParser(33856, 'text', (v)=>{}); }

// oid : 33855, type : array, namespace : enums, name : _cardinal_point
if(builtinOids.findIndex(v=>v === 33855)) { pg.types.setTypeParser(33855, 'text', (v)=>{}); }

// oid : 33865, type : array, namespace : enums, name : _building_usage
if(builtinOids.findIndex(v=>v === 33865)) { pg.types.setTypeParser(33865, 'text', (v)=>{}); }

// oid : 51710, type : class, namespace : bzv, name : mask_user_info
if(builtinOids.findIndex(v=>v === 51710)) { pg.types.setTypeParser(51710, 'text', (v)=>{}); }

// oid : 33866, type : class, namespace : enums, name : building_usage
if(builtinOids.findIndex(v=>v === 33866)) { pg.types.setTypeParser(33866, 'text', (v)=>{}); }

// oid : 33886, type : class, namespace : enums, name : school_kind
if(builtinOids.findIndex(v=>v === 33886)) { pg.types.setTypeParser(33886, 'text', (v)=>{}); }

// oid : 33876, type : class, namespace : enums, name : template_code
if(builtinOids.findIndex(v=>v === 33876)) { pg.types.setTypeParser(33876, 'text', (v)=>{}); }

// oid : 33875, type : array, namespace : enums, name : _template_code
if(builtinOids.findIndex(v=>v === 33875)) { pg.types.setTypeParser(33875, 'text', (v)=>{}); }

// oid : 16571, type : array, namespace : pde, name : _buld
if(builtinOids.findIndex(v=>v === 16571)) { pg.types.setTypeParser(16571, 'text', (v)=>{}); }

// oid : 33885, type : array, namespace : enums, name : _school_kind
if(builtinOids.findIndex(v=>v === 33885)) { pg.types.setTypeParser(33885, 'text', (v)=>{}); }

// oid : 16578, type : array, namespace : pde, name : _kapt
if(builtinOids.findIndex(v=>v === 16578)) { pg.types.setTypeParser(16578, 'text', (v)=>{}); }

// oid : 16579, type : class, namespace : pde, name : kapt
if(builtinOids.findIndex(v=>v === 16579)) { pg.types.setTypeParser(16579, 'text', (v)=>{}); }

// oid : 16586, type : class, namespace : pde, name : retle
if(builtinOids.findIndex(v=>v === 16586)) { pg.types.setTypeParser(16586, 'text', (v)=>{}); }

// oid : 16585, type : array, namespace : pde, name : _retle
if(builtinOids.findIndex(v=>v === 16585)) { pg.types.setTypeParser(16585, 'text', (v)=>{}); }

// oid : 16593, type : class, namespace : pde, name : title
if(builtinOids.findIndex(v=>v === 16593)) { pg.types.setTypeParser(16593, 'text', (v)=>{}); }

// oid : 16592, type : array, namespace : pde, name : _title
if(builtinOids.findIndex(v=>v === 16592)) { pg.types.setTypeParser(16592, 'text', (v)=>{}); }

// oid : 16599, type : array, namespace : pde, name : _expos
if(builtinOids.findIndex(v=>v === 16599)) { pg.types.setTypeParser(16599, 'text', (v)=>{}); }

// oid : 16607, type : class, namespace : pde, name : reltr_office
if(builtinOids.findIndex(v=>v === 16607)) { pg.types.setTypeParser(16607, 'text', (v)=>{}); }

// oid : 16606, type : array, namespace : pde, name : _reltr_office
if(builtinOids.findIndex(v=>v === 16606)) { pg.types.setTypeParser(16606, 'text', (v)=>{}); }

// oid : 16572, type : class, namespace : pde, name : buld
if(builtinOids.findIndex(v=>v === 16572)) { pg.types.setTypeParser(16572, 'text', (v)=>{}); }

// oid : 16614, type : class, namespace : pde, name : school
if(builtinOids.findIndex(v=>v === 16614)) { pg.types.setTypeParser(16614, 'text', (v)=>{}); }

// oid : 16613, type : array, namespace : pde, name : _school
if(builtinOids.findIndex(v=>v === 16613)) { pg.types.setTypeParser(16613, 'text', (v)=>{}); }

// oid : 16620, type : array, namespace : pde, name : _hakgu
if(builtinOids.findIndex(v=>v === 16620)) { pg.types.setTypeParser(16620, 'text', (v)=>{}); }

// oid : 16600, type : class, namespace : pde, name : expos
if(builtinOids.findIndex(v=>v === 16600)) { pg.types.setTypeParser(16600, 'text', (v)=>{}); }

// oid : 16621, type : class, namespace : pde, name : hakgu
if(builtinOids.findIndex(v=>v === 16621)) { pg.types.setTypeParser(16621, 'text', (v)=>{}); }

// oid : 33896, type : class, namespace : enums, name : nation
if(builtinOids.findIndex(v=>v === 33896)) { pg.types.setTypeParser(33896, 'text', (v)=>{}); }

// oid : 32873, type : array, namespace : types, name : _mncst
if(builtinOids.findIndex(v=>v === 32873)) { pg.types.setTypeParser(32873, 'text', (v)=>{}); }

// oid : 33895, type : array, namespace : enums, name : _nation
if(builtinOids.findIndex(v=>v === 33895)) { pg.types.setTypeParser(33895, 'text', (v)=>{}); }

// oid : 32877, type : class, namespace : types, name : movein
if(builtinOids.findIndex(v=>v === 32877)) { pg.types.setTypeParser(32877, 'text', (v)=>{}); }

// oid : 32876, type : array, namespace : types, name : _movein
if(builtinOids.findIndex(v=>v === 32876)) { pg.types.setTypeParser(32876, 'text', (v)=>{}); }

// oid : 32879, type : array, namespace : types, name : _parkng
if(builtinOids.findIndex(v=>v === 32879)) { pg.types.setTypeParser(32879, 'text', (v)=>{}); }

// oid : 32874, type : class, namespace : types, name : mncst
if(builtinOids.findIndex(v=>v === 32874)) { pg.types.setTypeParser(32874, 'text', (v)=>{}); }

// oid : 32880, type : class, namespace : types, name : parkng
if(builtinOids.findIndex(v=>v === 32880)) { pg.types.setTypeParser(32880, 'text', (v)=>{}); }

// oid : 40973, type : class, namespace : enums, name : contrt_role
if(builtinOids.findIndex(v=>v === 40973)) { pg.types.setTypeParser(40973, 'text', (v)=>{}); }

// oid : 40972, type : array, namespace : enums, name : _contrt_role
if(builtinOids.findIndex(v=>v === 40972)) { pg.types.setTypeParser(40972, 'text', (v)=>{}); }

// oid : 40983, type : array, namespace : enums, name : _contrt_type
if(builtinOids.findIndex(v=>v === 40983)) { pg.types.setTypeParser(40983, 'text', (v)=>{}); }

// oid : 50683, type : class, namespace : bzr, name : user_entity
if(builtinOids.findIndex(v=>v === 50683)) { pg.types.setTypeParser(50683, 'text', (v)=>{}); }

// oid : 40984, type : class, namespace : enums, name : contrt_type
if(builtinOids.findIndex(v=>v === 40984)) { pg.types.setTypeParser(40984, 'text', (v)=>{}); }

// oid : 50694, type : class, namespace : bze, name : user_entity
if(builtinOids.findIndex(v=>v === 50694)) { pg.types.setTypeParser(50694, 'text', (v)=>{}); }

// oid : 50693, type : array, namespace : bze, name : _user_entity
if(builtinOids.findIndex(v=>v === 50693)) { pg.types.setTypeParser(50693, 'text', (v)=>{}); }

// oid : 50682, type : array, namespace : bzr, name : _user_entity
if(builtinOids.findIndex(v=>v === 50682)) { pg.types.setTypeParser(50682, 'text', (v)=>{}); }

// oid : 50701, type : class, namespace : bzr, name : office_entity
if(builtinOids.findIndex(v=>v === 50701)) { pg.types.setTypeParser(50701, 'text', (v)=>{}); }

// oid : 50700, type : array, namespace : bzr, name : _office_entity
if(builtinOids.findIndex(v=>v === 50700)) { pg.types.setTypeParser(50700, 'text', (v)=>{}); }

// oid : 50716, type : array, namespace : bze, name : _office_entity
if(builtinOids.findIndex(v=>v === 50716)) { pg.types.setTypeParser(50716, 'text', (v)=>{}); }

// oid : 50723, type : array, namespace : bzr, name : _reltr_entity
if(builtinOids.findIndex(v=>v === 50723)) { pg.types.setTypeParser(50723, 'text', (v)=>{}); }

// oid : 50735, type : class, namespace : bze, name : reltr_entity
if(builtinOids.findIndex(v=>v === 50735)) { pg.types.setTypeParser(50735, 'text', (v)=>{}); }

// oid : 50717, type : class, namespace : bze, name : office_entity
if(builtinOids.findIndex(v=>v === 50717)) { pg.types.setTypeParser(50717, 'text', (v)=>{}); }

// oid : 50734, type : array, namespace : bze, name : _reltr_entity
if(builtinOids.findIndex(v=>v === 50734)) { pg.types.setTypeParser(50734, 'text', (v)=>{}); }

// oid : 50753, type : class, namespace : bze, name : prdct_entity
if(builtinOids.findIndex(v=>v === 50753)) { pg.types.setTypeParser(50753, 'text', (v)=>{}); }

// oid : 50742, type : class, namespace : bzr, name : prdct_entity
if(builtinOids.findIndex(v=>v === 50742)) { pg.types.setTypeParser(50742, 'text', (v)=>{}); }

// oid : 50741, type : array, namespace : bzr, name : _prdct_entity
if(builtinOids.findIndex(v=>v === 50741)) { pg.types.setTypeParser(50741, 'text', (v)=>{}); }

// oid : 50760, type : class, namespace : bzr, name : sell_entity
if(builtinOids.findIndex(v=>v === 50760)) { pg.types.setTypeParser(50760, 'text', (v)=>{}); }

// oid : 50752, type : array, namespace : bze, name : _prdct_entity
if(builtinOids.findIndex(v=>v === 50752)) { pg.types.setTypeParser(50752, 'text', (v)=>{}); }

// oid : 50783, type : class, namespace : bzr, name : buy_entity
if(builtinOids.findIndex(v=>v === 50783)) { pg.types.setTypeParser(50783, 'text', (v)=>{}); }

// oid : 50724, type : class, namespace : bzr, name : reltr_entity
if(builtinOids.findIndex(v=>v === 50724)) { pg.types.setTypeParser(50724, 'text', (v)=>{}); }

// oid : 50776, type : class, namespace : bze, name : sell_entity
if(builtinOids.findIndex(v=>v === 50776)) { pg.types.setTypeParser(50776, 'text', (v)=>{}); }

// oid : 50759, type : array, namespace : bzr, name : _sell_entity
if(builtinOids.findIndex(v=>v === 50759)) { pg.types.setTypeParser(50759, 'text', (v)=>{}); }

// oid : 50798, type : array, namespace : bze, name : _buy_entity
if(builtinOids.findIndex(v=>v === 50798)) { pg.types.setTypeParser(50798, 'text', (v)=>{}); }

// oid : 50775, type : array, namespace : bze, name : _sell_entity
if(builtinOids.findIndex(v=>v === 50775)) { pg.types.setTypeParser(50775, 'text', (v)=>{}); }

// oid : 50799, type : class, namespace : bze, name : buy_entity
if(builtinOids.findIndex(v=>v === 50799)) { pg.types.setTypeParser(50799, 'text', (v)=>{}); }

// oid : 50782, type : array, namespace : bzr, name : _buy_entity
if(builtinOids.findIndex(v=>v === 50782)) { pg.types.setTypeParser(50782, 'text', (v)=>{}); }

// oid : 50805, type : array, namespace : bzr, name : _paymnt_entity
if(builtinOids.findIndex(v=>v === 50805)) { pg.types.setTypeParser(50805, 'text', (v)=>{}); }

// oid : 50816, type : array, namespace : bze, name : _paymnt_entity
if(builtinOids.findIndex(v=>v === 50816)) { pg.types.setTypeParser(50816, 'text', (v)=>{}); }

// oid : 50806, type : class, namespace : bzr, name : paymnt_entity
if(builtinOids.findIndex(v=>v === 50806)) { pg.types.setTypeParser(50806, 'text', (v)=>{}); }

// oid : 50835, type : class, namespace : bze, name : deal_entity
if(builtinOids.findIndex(v=>v === 50835)) { pg.types.setTypeParser(50835, 'text', (v)=>{}); }

// oid : 50817, type : class, namespace : bze, name : paymnt_entity
if(builtinOids.findIndex(v=>v === 50817)) { pg.types.setTypeParser(50817, 'text', (v)=>{}); }

// oid : 50823, type : array, namespace : bzr, name : _deal_entity
if(builtinOids.findIndex(v=>v === 50823)) { pg.types.setTypeParser(50823, 'text', (v)=>{}); }

// oid : 50841, type : array, namespace : bzr, name : _file_entity
if(builtinOids.findIndex(v=>v === 50841)) { pg.types.setTypeParser(50841, 'text', (v)=>{}); }

// oid : 50824, type : class, namespace : bzr, name : deal_entity
if(builtinOids.findIndex(v=>v === 50824)) { pg.types.setTypeParser(50824, 'text', (v)=>{}); }

// oid : 50834, type : array, namespace : bze, name : _deal_entity
if(builtinOids.findIndex(v=>v === 50834)) { pg.types.setTypeParser(50834, 'text', (v)=>{}); }

// oid : 50852, type : array, namespace : bze, name : _file_entity
if(builtinOids.findIndex(v=>v === 50852)) { pg.types.setTypeParser(50852, 'text', (v)=>{}); }

// oid : 50842, type : class, namespace : bzr, name : file_entity
if(builtinOids.findIndex(v=>v === 50842)) { pg.types.setTypeParser(50842, 'text', (v)=>{}); }

// oid : 50860, type : class, namespace : bzr, name : user_info
if(builtinOids.findIndex(v=>v === 50860)) { pg.types.setTypeParser(50860, 'text', (v)=>{}); }

// oid : 50853, type : class, namespace : bze, name : file_entity
if(builtinOids.findIndex(v=>v === 50853)) { pg.types.setTypeParser(50853, 'text', (v)=>{}); }

// oid : 50859, type : array, namespace : bzr, name : _user_info
if(builtinOids.findIndex(v=>v === 50859)) { pg.types.setTypeParser(50859, 'text', (v)=>{}); }

// oid : 50886, type : array, namespace : bzc, name : _user_info
if(builtinOids.findIndex(v=>v === 50886)) { pg.types.setTypeParser(50886, 'text', (v)=>{}); }

// oid : 50904, type : class, namespace : bzr, name : user_config
if(builtinOids.findIndex(v=>v === 50904)) { pg.types.setTypeParser(50904, 'text', (v)=>{}); }

// oid : 50903, type : array, namespace : bzr, name : _user_config
if(builtinOids.findIndex(v=>v === 50903)) { pg.types.setTypeParser(50903, 'text', (v)=>{}); }

// oid : 50931, type : array, namespace : bzc, name : _user_config
if(builtinOids.findIndex(v=>v === 50931)) { pg.types.setTypeParser(50931, 'text', (v)=>{}); }

// oid : 50932, type : class, namespace : bzc, name : user_config
if(builtinOids.findIndex(v=>v === 50932)) { pg.types.setTypeParser(50932, 'text', (v)=>{}); }

// oid : 50939, type : class, namespace : bzr, name : user_hist
if(builtinOids.findIndex(v=>v === 50939)) { pg.types.setTypeParser(50939, 'text', (v)=>{}); }

// oid : 50938, type : array, namespace : bzr, name : _user_hist
if(builtinOids.findIndex(v=>v === 50938)) { pg.types.setTypeParser(50938, 'text', (v)=>{}); }

// oid : 50962, type : array, namespace : bzc, name : _user_hist
if(builtinOids.findIndex(v=>v === 50962)) { pg.types.setTypeParser(50962, 'text', (v)=>{}); }

// oid : 50963, type : class, namespace : bzc, name : user_hist
if(builtinOids.findIndex(v=>v === 50963)) { pg.types.setTypeParser(50963, 'text', (v)=>{}); }

// oid : 50969, type : array, namespace : bzr, name : _user_panlty
if(builtinOids.findIndex(v=>v === 50969)) { pg.types.setTypeParser(50969, 'text', (v)=>{}); }

// oid : 50887, type : class, namespace : bzc, name : user_info
if(builtinOids.findIndex(v=>v === 50887)) { pg.types.setTypeParser(50887, 'text', (v)=>{}); }

// oid : 50994, type : class, namespace : bzc, name : user_panlty
if(builtinOids.findIndex(v=>v === 50994)) { pg.types.setTypeParser(50994, 'text', (v)=>{}); }

// oid : 51006, type : class, namespace : bzr, name : user_login
if(builtinOids.findIndex(v=>v === 51006)) { pg.types.setTypeParser(51006, 'text', (v)=>{}); }

// oid : 50970, type : class, namespace : bzr, name : user_panlty
if(builtinOids.findIndex(v=>v === 50970)) { pg.types.setTypeParser(50970, 'text', (v)=>{}); }

// oid : 50993, type : array, namespace : bzc, name : _user_panlty
if(builtinOids.findIndex(v=>v === 50993)) { pg.types.setTypeParser(50993, 'text', (v)=>{}); }

// oid : 51029, type : class, namespace : bzc, name : user_login
if(builtinOids.findIndex(v=>v === 51029)) { pg.types.setTypeParser(51029, 'text', (v)=>{}); }

// oid : 51028, type : array, namespace : bzc, name : _user_login
if(builtinOids.findIndex(v=>v === 51028)) { pg.types.setTypeParser(51028, 'text', (v)=>{}); }

// oid : 51035, type : array, namespace : bzr, name : _user_reltr
if(builtinOids.findIndex(v=>v === 51035)) { pg.types.setTypeParser(51035, 'text', (v)=>{}); }

// oid : 51005, type : array, namespace : bzr, name : _user_login
if(builtinOids.findIndex(v=>v === 51005)) { pg.types.setTypeParser(51005, 'text', (v)=>{}); }

// oid : 51064, type : class, namespace : bzc, name : user_reltr
if(builtinOids.findIndex(v=>v === 51064)) { pg.types.setTypeParser(51064, 'text', (v)=>{}); }

// oid : 51071, type : class, namespace : bzr, name : office_info
if(builtinOids.findIndex(v=>v === 51071)) { pg.types.setTypeParser(51071, 'text', (v)=>{}); }

// oid : 51070, type : array, namespace : bzr, name : _office_info
if(builtinOids.findIndex(v=>v === 51070)) { pg.types.setTypeParser(51070, 'text', (v)=>{}); }

// oid : 51099, type : class, namespace : bzc, name : office_info
if(builtinOids.findIndex(v=>v === 51099)) { pg.types.setTypeParser(51099, 'text', (v)=>{}); }

// oid : 51036, type : class, namespace : bzr, name : user_reltr
if(builtinOids.findIndex(v=>v === 51036)) { pg.types.setTypeParser(51036, 'text', (v)=>{}); }

// oid : 51063, type : array, namespace : bzc, name : _user_reltr
if(builtinOids.findIndex(v=>v === 51063)) { pg.types.setTypeParser(51063, 'text', (v)=>{}); }

// oid : 51134, type : class, namespace : bzc, name : office_reltr
if(builtinOids.findIndex(v=>v === 51134)) { pg.types.setTypeParser(51134, 'text', (v)=>{}); }

// oid : 51106, type : class, namespace : bzr, name : office_reltr
if(builtinOids.findIndex(v=>v === 51106)) { pg.types.setTypeParser(51106, 'text', (v)=>{}); }

// oid : 51098, type : array, namespace : bzc, name : _office_info
if(builtinOids.findIndex(v=>v === 51098)) { pg.types.setTypeParser(51098, 'text', (v)=>{}); }

// oid : 51133, type : array, namespace : bzc, name : _office_reltr
if(builtinOids.findIndex(v=>v === 51133)) { pg.types.setTypeParser(51133, 'text', (v)=>{}); }

// oid : 51105, type : array, namespace : bzr, name : _office_reltr
if(builtinOids.findIndex(v=>v === 51105)) { pg.types.setTypeParser(51105, 'text', (v)=>{}); }

// oid : 51140, type : array, namespace : bzr, name : _office_alba
if(builtinOids.findIndex(v=>v === 51140)) { pg.types.setTypeParser(51140, 'text', (v)=>{}); }

// oid : 51169, type : class, namespace : bzc, name : office_alba
if(builtinOids.findIndex(v=>v === 51169)) { pg.types.setTypeParser(51169, 'text', (v)=>{}); }

// oid : 51168, type : array, namespace : bzc, name : _office_alba
if(builtinOids.findIndex(v=>v === 51168)) { pg.types.setTypeParser(51168, 'text', (v)=>{}); }

// oid : 51175, type : array, namespace : bzr, name : _office_rank
if(builtinOids.findIndex(v=>v === 51175)) { pg.types.setTypeParser(51175, 'text', (v)=>{}); }

// oid : 51176, type : class, namespace : bzr, name : office_rank
if(builtinOids.findIndex(v=>v === 51176)) { pg.types.setTypeParser(51176, 'text', (v)=>{}); }

// oid : 51195, type : array, namespace : bzc, name : _office_rank
if(builtinOids.findIndex(v=>v === 51195)) { pg.types.setTypeParser(51195, 'text', (v)=>{}); }

// oid : 51141, type : class, namespace : bzr, name : office_alba
if(builtinOids.findIndex(v=>v === 51141)) { pg.types.setTypeParser(51141, 'text', (v)=>{}); }

// oid : 51196, type : class, namespace : bzc, name : office_rank
if(builtinOids.findIndex(v=>v === 51196)) { pg.types.setTypeParser(51196, 'text', (v)=>{}); }

// oid : 51230, type : class, namespace : bzc, name : prdct_info
if(builtinOids.findIndex(v=>v === 51230)) { pg.types.setTypeParser(51230, 'text', (v)=>{}); }

// oid : 51202, type : array, namespace : bzr, name : _prdct_info
if(builtinOids.findIndex(v=>v === 51202)) { pg.types.setTypeParser(51202, 'text', (v)=>{}); }

// oid : 50191, type : array, namespace : types, name : _price
if(builtinOids.findIndex(v=>v === 50191)) { pg.types.setTypeParser(50191, 'text', (v)=>{}); }

// oid : 51203, type : class, namespace : bzr, name : prdct_info
if(builtinOids.findIndex(v=>v === 51203)) { pg.types.setTypeParser(51203, 'text', (v)=>{}); }

// oid : 51242, type : class, namespace : bzr, name : prdct_reltr
if(builtinOids.findIndex(v=>v === 51242)) { pg.types.setTypeParser(51242, 'text', (v)=>{}); }

// oid : 51241, type : array, namespace : bzr, name : _prdct_reltr
if(builtinOids.findIndex(v=>v === 51241)) { pg.types.setTypeParser(51241, 'text', (v)=>{}); }

// oid : 51280, type : class, namespace : bzc, name : prdct_reltr
if(builtinOids.findIndex(v=>v === 51280)) { pg.types.setTypeParser(51280, 'text', (v)=>{}); }

// oid : 51229, type : array, namespace : bzc, name : _prdct_info
if(builtinOids.findIndex(v=>v === 51229)) { pg.types.setTypeParser(51229, 'text', (v)=>{}); }

// oid : 51287, type : class, namespace : bzr, name : prdct_owner
if(builtinOids.findIndex(v=>v === 51287)) { pg.types.setTypeParser(51287, 'text', (v)=>{}); }

// oid : 51279, type : array, namespace : bzc, name : _prdct_reltr
if(builtinOids.findIndex(v=>v === 51279)) { pg.types.setTypeParser(51279, 'text', (v)=>{}); }

// oid : 50192, type : class, namespace : types, name : price
if(builtinOids.findIndex(v=>v === 50192)) { pg.types.setTypeParser(50192, 'text', (v)=>{}); }

// oid : 51286, type : array, namespace : bzr, name : _prdct_owner
if(builtinOids.findIndex(v=>v === 51286)) { pg.types.setTypeParser(51286, 'text', (v)=>{}); }

// oid : 51322, type : class, namespace : bzr, name : prdct_batch_hist
if(builtinOids.findIndex(v=>v === 51322)) { pg.types.setTypeParser(51322, 'text', (v)=>{}); }

// oid : 51315, type : class, namespace : bzc, name : prdct_owner
if(builtinOids.findIndex(v=>v === 51315)) { pg.types.setTypeParser(51315, 'text', (v)=>{}); }

// oid : 51314, type : array, namespace : bzc, name : _prdct_owner
if(builtinOids.findIndex(v=>v === 51314)) { pg.types.setTypeParser(51314, 'text', (v)=>{}); }

// oid : 51321, type : array, namespace : bzr, name : _prdct_batch_hist
if(builtinOids.findIndex(v=>v === 51321)) { pg.types.setTypeParser(51321, 'text', (v)=>{}); }

// oid : 51358, type : class, namespace : bzr, name : sell_info
if(builtinOids.findIndex(v=>v === 51358)) { pg.types.setTypeParser(51358, 'text', (v)=>{}); }

// oid : 51346, type : class, namespace : bzc, name : prdct_batch_hist
if(builtinOids.findIndex(v=>v === 51346)) { pg.types.setTypeParser(51346, 'text', (v)=>{}); }

// oid : 51345, type : array, namespace : bzc, name : _prdct_batch_hist
if(builtinOids.findIndex(v=>v === 51345)) { pg.types.setTypeParser(51345, 'text', (v)=>{}); }

// oid : 51384, type : array, namespace : bze, name : _sell_info
if(builtinOids.findIndex(v=>v === 51384)) { pg.types.setTypeParser(51384, 'text', (v)=>{}); }

// oid : 51357, type : array, namespace : bzr, name : _sell_info
if(builtinOids.findIndex(v=>v === 51357)) { pg.types.setTypeParser(51357, 'text', (v)=>{}); }

// oid : 51391, type : array, namespace : bzr, name : _buy_info
if(builtinOids.findIndex(v=>v === 51391)) { pg.types.setTypeParser(51391, 'text', (v)=>{}); }

// oid : 51424, type : class, namespace : bzc, name : buy_info
if(builtinOids.findIndex(v=>v === 51424)) { pg.types.setTypeParser(51424, 'text', (v)=>{}); }

// oid : 51385, type : class, namespace : bze, name : sell_info
if(builtinOids.findIndex(v=>v === 51385)) { pg.types.setTypeParser(51385, 'text', (v)=>{}); }

// oid : 51392, type : class, namespace : bzr, name : buy_info
if(builtinOids.findIndex(v=>v === 51392)) { pg.types.setTypeParser(51392, 'text', (v)=>{}); }

// oid : 51431, type : class, namespace : bzr, name : paymnt_info
if(builtinOids.findIndex(v=>v === 51431)) { pg.types.setTypeParser(51431, 'text', (v)=>{}); }

// oid : 51430, type : array, namespace : bzr, name : _paymnt_info
if(builtinOids.findIndex(v=>v === 51430)) { pg.types.setTypeParser(51430, 'text', (v)=>{}); }

// oid : 51466, type : class, namespace : bzr, name : paymnt_calbck
if(builtinOids.findIndex(v=>v === 51466)) { pg.types.setTypeParser(51466, 'text', (v)=>{}); }

// oid : 51423, type : array, namespace : bzc, name : _buy_info
if(builtinOids.findIndex(v=>v === 51423)) { pg.types.setTypeParser(51423, 'text', (v)=>{}); }

// oid : 51454, type : class, namespace : bzc, name : paymnt_info
if(builtinOids.findIndex(v=>v === 51454)) { pg.types.setTypeParser(51454, 'text', (v)=>{}); }

// oid : 51465, type : array, namespace : bzr, name : _paymnt_calbck
if(builtinOids.findIndex(v=>v === 51465)) { pg.types.setTypeParser(51465, 'text', (v)=>{}); }

// oid : 51493, type : class, namespace : bzc, name : paymnt_calbck
if(builtinOids.findIndex(v=>v === 51493)) { pg.types.setTypeParser(51493, 'text', (v)=>{}); }

// oid : 51492, type : array, namespace : bzc, name : _paymnt_calbck
if(builtinOids.findIndex(v=>v === 51492)) { pg.types.setTypeParser(51492, 'text', (v)=>{}); }

// oid : 51453, type : array, namespace : bzc, name : _paymnt_info
if(builtinOids.findIndex(v=>v === 51453)) { pg.types.setTypeParser(51453, 'text', (v)=>{}); }

// oid : 51536, type : class, namespace : bzc, name : deal_info
if(builtinOids.findIndex(v=>v === 51536)) { pg.types.setTypeParser(51536, 'text', (v)=>{}); }

// oid : 51499, type : array, namespace : bzr, name : _deal_info
if(builtinOids.findIndex(v=>v === 51499)) { pg.types.setTypeParser(51499, 'text', (v)=>{}); }

// oid : 51543, type : class, namespace : bzr, name : deal_contrt
if(builtinOids.findIndex(v=>v === 51543)) { pg.types.setTypeParser(51543, 'text', (v)=>{}); }

// oid : 51535, type : array, namespace : bzc, name : _deal_info
if(builtinOids.findIndex(v=>v === 51535)) { pg.types.setTypeParser(51535, 'text', (v)=>{}); }

// oid : 51542, type : array, namespace : bzr, name : _deal_contrt
if(builtinOids.findIndex(v=>v === 51542)) { pg.types.setTypeParser(51542, 'text', (v)=>{}); }

// oid : 51572, type : array, namespace : bzc, name : _deal_contrt
if(builtinOids.findIndex(v=>v === 51572)) { pg.types.setTypeParser(51572, 'text', (v)=>{}); }

// oid : 51500, type : class, namespace : bzr, name : deal_info
if(builtinOids.findIndex(v=>v === 51500)) { pg.types.setTypeParser(51500, 'text', (v)=>{}); }

// oid : 51585, type : class, namespace : bzr, name : deal_contrt_sign
if(builtinOids.findIndex(v=>v === 51585)) { pg.types.setTypeParser(51585, 'text', (v)=>{}); }

// oid : 51620, type : class, namespace : bzc, name : deal_contrt_sign
if(builtinOids.findIndex(v=>v === 51620)) { pg.types.setTypeParser(51620, 'text', (v)=>{}); }

// oid : 51573, type : class, namespace : bzc, name : deal_contrt
if(builtinOids.findIndex(v=>v === 51573)) { pg.types.setTypeParser(51573, 'text', (v)=>{}); }

// oid : 51584, type : array, namespace : bzr, name : _deal_contrt_sign
if(builtinOids.findIndex(v=>v === 51584)) { pg.types.setTypeParser(51584, 'text', (v)=>{}); }

// oid : 51636, type : array, namespace : bzr, name : _deal_paymnt
if(builtinOids.findIndex(v=>v === 51636)) { pg.types.setTypeParser(51636, 'text', (v)=>{}); }

// oid : 51619, type : array, namespace : bzc, name : _deal_contrt_sign
if(builtinOids.findIndex(v=>v === 51619)) { pg.types.setTypeParser(51619, 'text', (v)=>{}); }

// oid : 51659, type : array, namespace : bzc, name : _deal_paymnt
if(builtinOids.findIndex(v=>v === 51659)) { pg.types.setTypeParser(51659, 'text', (v)=>{}); }

// oid : 51672, type : class, namespace : bzr, name : file_info
if(builtinOids.findIndex(v=>v === 51672)) { pg.types.setTypeParser(51672, 'text', (v)=>{}); }

// oid : 51660, type : class, namespace : bzc, name : deal_paymnt
if(builtinOids.findIndex(v=>v === 51660)) { pg.types.setTypeParser(51660, 'text', (v)=>{}); }

// oid : 51671, type : array, namespace : bzr, name : _file_info
if(builtinOids.findIndex(v=>v === 51671)) { pg.types.setTypeParser(51671, 'text', (v)=>{}); }

// oid : 51637, type : class, namespace : bzr, name : deal_paymnt
if(builtinOids.findIndex(v=>v === 51637)) { pg.types.setTypeParser(51637, 'text', (v)=>{}); }

// oid : 51699, type : class, namespace : bzc, name : file_info
if(builtinOids.findIndex(v=>v === 51699)) { pg.types.setTypeParser(51699, 'text', (v)=>{}); }

// oid : 51698, type : array, namespace : bzc, name : _file_info
if(builtinOids.findIndex(v=>v === 51698)) { pg.types.setTypeParser(51698, 'text', (v)=>{}); }
