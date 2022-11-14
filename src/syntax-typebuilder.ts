import pg from "pg"
import { ArrayParser } from "./parser-array.js"
import { pg_catalog_ext } from "./pg-builtins-types.js"
import { AssignDepth2 } from "./utils.js"

export class TypeBuilder<Type> implements pg.CustomTypesConfig {
    #mapping: Record<number, [string, string]>
    #parser: Record<string, Record<string, (raw: string) => any>>
    constructor(mapping: Record<number, [string, string]>, parser: Record<string, Record<string, (raw: string) => any>>) {
        this.#mapping = mapping
        this.#parser = parser
    }
    // oid, namespace, name, parser
    setup(set: [number, string, string, (raw: string) => any][]) {
        for (const [oid, ns, nm, parser] of set) {
            this.#mapping[oid] = [ns, nm]
            if (!(ns in this.#parser)) {
                this.#parser[ns] = {}
            }
            this.#parser[ns][nm] = parser
        }
    }
    use(ext: "bigint"): TypeBuilder<AssignDepth2<Record<'pg_catalog', pg_catalog_ext['bigint']>, Type>>
    use(ext: "bitnumber.js"): TypeBuilder<AssignDepth2<Record<'pg_catalog', pg_catalog_ext['bitnumber.js']>, Type>>
    use(ext: "moment"): TypeBuilder<AssignDepth2<Record<'pg_catalog', pg_catalog_ext['moment']>, Type>>
    use(ext: string, ...args: any[]): any {
        switch (ext) {
            case "bigint":
                this.#parser['pg_catalog']['int8'] = (raw: string) => { return BigInt(raw) }
                this.#parser['pg_catalog']['_int8'] = ArrayParser.create((raw: string) => { return BigInt(raw) })
                return this
            case "bitnumber.js":
                import('bignumber.js').then(bn => {
                    this.#parser['pg_catalog']['numeric'] = (raw: string) => { return bn.BigNumber(raw) }
                    this.#parser['pg_catalog']['_numeric'] = ArrayParser.create((raw: string) => { return bn.BigNumber(raw) })
                }).catch(() => {
                    console.error(`must install 'bignumber.js' for your package
npm  : npm i bignumber.js
yarn : yarn add bignumber.js
pnpm : pnpm add bignumber.js`)
                    process.exit(1)
                })
                return this
            case "moment":
                import('moment').then(moment => {
                    this.#parser['pg_catalog']['date'] = (raw: string) => {
                        return moment.default(raw, "YYYY-MM-DD")
                    }
                    this.#parser['pg_catalog']['time'] = (raw: string) => {
                        return moment.default(raw, "hh:mm:ss")
                    }
                }).catch(() => {
                    console.error(`must install 'moment' for your package
npm  : npm i moment
yarn : yarn add moment
pnpm : pnpm add momentj`)
                    process.exit(1)
                })
                return this
            default:
                throw Error(`unknown extension ${ext}`)
        }
    }
    find(type: 'oid', namespace: string, name: string): number | undefined {
        const temp = Object.entries(this.#mapping).find(([k, [ns, nm]]) => {
            if (ns === namespace && nm === name) {
                return true
            }
            return false
        })
        if (temp === undefined) {
            return undefined
        }
        return Number(temp[0])
    }
    type<NS extends string, NM extends string, T>(namespace: NS, name: NM, parser: (raw: string) => T): TypeBuilder<AssignDepth2<Record<NS, Record<NM, T>>, Type>> {
        if (!(namespace in this.#parser)) {
            this.#parser[namespace] = {}
        }
        this.#parser[namespace][name] = parser
        return this as any
    }
    getTypeParser(id: number, format?: any): any {
        if (format === 'binary') {
            throw new Error(`binary not support`)
        }
        if (id in this.#mapping) {
            const [ns, nm] = this.#mapping[id]
            return this.#parser[ns]?.[nm] ?? pg.types.getTypeParser(id, format)
        }
        return pg.types.getTypeParser(id, format)
    }
}
export type QgenTypeParser<T, NS, NM> = T extends TypeBuilder<infer Parser>
    ? (
        NS extends keyof Parser
        ? (
            NM extends keyof Parser[NS]
            ? Parser[NS][NM]
            : any
        )
        : any
    )
    : unknown
