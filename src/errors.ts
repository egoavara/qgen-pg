import type pg from "pg"
export class QueryError extends Error {
    dbError: pg.DatabaseError
    sql: string
    name: string
    filepath: string
    values: any[]
    constructor(dbError: pg.DatabaseError, filepath: string, name: string, sql: string, values: any[]) {
        super([
            `[!] Query running failed`,
            `    filepath : ${filepath}`,
            `    name     : ${name}`,
            `    sql      : ${sql.replaceAll("\n", "\n               ")}`,
            ...(values.length > 0 ? [`    values   : ${JSON.stringify(values)}`] : []),
            `    error    : `,
            `        message            : ${dbError.message}`,
            `        name               : ${dbError.name}`,
            ...(dbError.severity !== undefined ? [`        severity           : ${dbError.code} `] : []),
            ...(dbError.code !== undefined ? [`        code               : ${dbError.code} `] : []),
            ...(dbError.detail !== undefined ? [`        detail             : ${dbError.detail} `] : []),
            ...(dbError.hint !== undefined ? [`        hint               : ${dbError.hint} `] : []),
            ...(dbError.position !== undefined ? [`        position           : ${dbError.position} `] : []),
            ...(dbError.internalPosition !== undefined ? [`        internalPosition   : ${dbError.internalPosition}`] : []),
            ...(dbError.internalQuery !== undefined ? [`        internalQuery      : ${dbError.internalQuery}`] : []),
            ...(dbError.where !== undefined ? [`        where              : ${dbError.where}`] : []),
            ...(dbError.schema !== undefined ? [`        schema             : ${dbError.schema}`] : []),
            ...(dbError.table !== undefined ? [`        table              : ${dbError.table}`] : []),
            ...(dbError.column !== undefined ? [`        column             : ${dbError.column}`] : []),
            ...(dbError.dataType !== undefined ? [`        dataType           : ${dbError.dataType}`] : []),
            ...(dbError.constraint !== undefined ? [`        constraint         : ${dbError.constraint}`] : []),
            ...(dbError.routine !== undefined ? [`        routine            : ${dbError.routine}`] : []),
        ].join("\n"), { cause: dbError })
        this.dbError = dbError
        this.filepath = filepath
        this.name = name
        this.sql = sql
        this.values = values
    }

}