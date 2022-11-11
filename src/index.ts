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
    
export * from './storage-query.js'
export * from './storage-type.js'
export * from './syntax-qgen.js'

