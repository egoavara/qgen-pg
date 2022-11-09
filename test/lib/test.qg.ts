// qgen query ...
import type pg from 'pg';
import { types } from "./_typedef.qg.js"
export async function hello(conn : Pick<pg.ClientBase, 'query'>, input: hello.Input): Promise<hello.Output[]> {
    const inputValues = [input["realName"]]
    const queryResult = await conn.query({
        rowMode: 'array',
        name: "hello",
        text: hello.SQL,
        values: inputValues,
    })
    return queryResult.rows.map((tuple)=>{
        return {
            userId: tuple[1],
            dispName: tuple[2],
            realName: tuple[3],
            email: tuple[4],
            phoneNo: tuple[5],
            gender: tuple[6],
            nation: tuple[7],
            createAt: tuple[8],
            updateAt: tuple[9],
            deleteAt: tuple[10]
        }
    })
}
export namespace hello{
    export interface Input{ 
        realName: any // index = 1
    }
    export interface Output{
        userId: string // index = 1
        dispName: string // index = 2
        realName: string // index = 3
        email: string // index = 4
        phoneNo: string // index = 5
        gender: string // index = 6
        nation: string // index = 7
        createAt: Date // index = 8
        updateAt: Date // index = 9
        deleteAt: Date // index = 10
    }
    export const SQL = "select * from bzc.user_info where real_name = $1"
}
export async function hello2(conn : Pick<pg.ClientBase, 'query'>, input: hello2.Input): Promise<hello2.Output[]> {
    const inputValues = []
    const queryResult = await conn.query({
        rowMode: 'array',
        name: "hello2",
        text: hello2.SQL,
        values: inputValues,
    })
    return queryResult.rows.map((tuple)=>{
        return {
            buyId: tuple[1],
            sellId: tuple[2],
            price: tuple[3],
            createAt: tuple[4],
            updateAt: tuple[5],
            deleteAt: tuple[6]
        }
    })
}
export namespace hello2{
    export interface Input{ 

    }
    export interface Output{
        buyId: string // index = 1
        sellId: string // index = 2
        price: types.price // index = 3
        createAt: Date // index = 4
        updateAt: Date // index = 5
        deleteAt: Date // index = 6
    }
    export const SQL = "select * from bzc.buy_info"
}