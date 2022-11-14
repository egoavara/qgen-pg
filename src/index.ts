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


export * from './storage-query.js'
export * from './storage-type.js'
export * from './syntax-qgen.js'

