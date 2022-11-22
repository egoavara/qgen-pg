import pg from "pg"
import { AssignDepth2 } from "./utils.js"

export class TypeBuilder<Type> implements pg.CustomTypesConfig {
    #mapping: Record<number, [string, string]>
    #parser: Record<string, Record<string, (raw: string) => any>>
    constructor(mapping: Record<number, [string, string]>, parser: Record<string, Record<string, (raw: string) => any>>) {
        this.#mapping = mapping
        this.#parser = parser
    }
    // oid, namespace, name, parser
    setup<NewType>(set: [number, string, string, (raw: string) => any][]): TypeBuilder<NewType> {
        this.#mapping = {}
        this.#parser = {}
        for (const [oid, namespace, name, parser] of set) {
            this.#mapping[oid] = [namespace, name]
            if (!(namespace in this.#parser)) {
                this.#parser[namespace] = {}
            }
            this.#parser[namespace][name] = parser
        }
        return this
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
export type TypeParser<T, NS, NM> = T extends TypeBuilder<infer Parser>
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
