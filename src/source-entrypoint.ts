
import * as l from "./lang.js"
import { ExtensionImport } from "./extension.js"
import { PgType } from "./load-pgtype.js"
import { PgToTsConfig, pgToLangParser, pgToLangType } from "./pg-to-ts.js"
import { RunPgTypeOutput } from "./program.js"
export module EntrypointSource {
    export const Header = () => {
        return l.LangFile(
            l.StatementImport(["sqlfn", ["PrimitiveParser", "PP"], ["ArrayParser", "AP"], ["CompositeParser", "CP"]], "@egoavara/sqlfn")
        )
    }
    export const Source = (pgtypes: RunPgTypeOutput, option: PgToTsConfig) => {
        const groupNs: Record<string, Record<string, PgType>> = {}
        const targetPgTypes: PgType[] = []
        for (const ptyp of Object.values(pgtypes)) {
            if (ptyp.namespace === 'pg_catalog' && ptyp.name.startsWith("pg_")) {
                continue
            }
            if (['information_schema'].includes(ptyp.namespace)) {
                continue
            }
            if (ptyp.type === 'class' && ptyp.relkind !== 'c') {
                continue
            }
            if (ptyp.type === 'array' && ptyp.elem.type === 'class' && ptyp.elem.relkind !== 'c') {
                continue
            }
            if (!(ptyp.namespace in groupNs)) {
                groupNs[ptyp.namespace] = {}
            }
            groupNs[ptyp.namespace][ptyp.name] = ptyp
            targetPgTypes.push(ptyp)
        }
        //
        // =====================================================================================================================
        const typEachNamespace = Object.fromEntries(Object.entries(groupNs).map(([ns, nmmap]) => {
            return [ns, l.StatementInterface(["export"], `PgType_${ns}`, Object.entries(nmmap).map(([nm, pgtyp]) => {
                return [nm, pgToLangType(pgtyp, true, option)]
            }))]
        }))
        const typTotal = l.StatementInterface(["export"], "PgType", Object.keys(typEachNamespace).map((ns) => {
            return [ns, l.ExprTypeAccess(`PgType_${ns}`)]
        }))
        // =====================================================================================================================
        // ex) const PgParser = [[1, 'pg_catalog', 'bpchar', PP.noParse], ...]
        const varParsers = l.StatementVariable(["export"], "const", "PgParser", l.ExprTypeKeyword("any"), l.ExprValueArray(Object.values(targetPgTypes).map((pgtyp) => {
            // oid, namespace, name, parser
            return l.ExprValueArray([
                l.ExprValueLiteral(pgtyp.oid),
                l.ExprValueLiteral(pgtyp.namespace),
                l.ExprValueLiteral(pgtyp.name),
                pgToLangParser(pgtyp, true, option),
            ])
        })));
        // =====================================================================================================================
        return l.LangFile(
            Header(),
            ...(option.extension.map(v => { return ExtensionImport[v]() }).flat()),
            ...(Object.values(typEachNamespace)),
            typTotal,
            varParsers,
            l.StatementExportDefault(
                // sqlfn("type").setup<PgType>(PgParser)
                l.ExprValueCall(
                    // sqlfn("type").setup
                    l.ExprValueIdentifier(l.ExprValueCall(l.ExprValueIdentifier("sqlfn"), [l.ExprValueLiteral("type")]), "setup"),
                    [l.ExprTypeAccess("PgType"),], [l.ExprValueIdentifier("PgParser"),],
                )
            )
        )
    }
}