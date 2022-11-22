export type Trim<Q> =
    Q extends ` ${infer Remain}`
    ? Trim<Remain>
    : Q extends `${infer Remain} `
    ? Trim<Remain>
    : Q
export type QueryArgs<Q> =
    Q extends `${string}{{${infer Name}}}${infer Remain}`
    ? Trim<Name> | QueryArgs<Remain>
    : never

export type AssignDepth1<A, B> = {
    [K in keyof A | keyof B]:
    K extends keyof A
    ? A[K]
    : K extends keyof B
    ? B[K]
    : never
}
export type AssignDepth2<A, B> = {
    [K in keyof A | keyof B]:
    K extends keyof A & keyof B
    ? AssignDepth1<A[K], B[K]>
    : K extends keyof A
    ? A[K]
    : K extends keyof B
    ? B[K]
    : never
}
export function snakeToCamel(name: string): string {
    return name.split("_").map((v, i) => {
        if (i === 0) {
            return v
        }
        return v.slice(0, 1).toUpperCase() + v.slice(1)
    }).join("")
}


export type FixedArray<T extends Array<any>> =
    & Omit<T, 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number>
    & { [Symbol.iterator]: () => IterableIterator<T extends Array<infer TItems> ? TItems : never> }
