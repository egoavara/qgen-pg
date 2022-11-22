

import { sqlfn } from "sqlfn"



// sqlfn('hello')
//     .exact(Infinity)
//     .query('select * from test')
// sqlfn('hello2')
//     .void()
//     .query(`select * from bzc.buy_info`)
export const hello3 = sqlfn()
    .exact(1)
    .query(`select 'helloworld', 'hellworld'`)
// sqlfn('hello4')
//     .option()
//     .query(`select * from bzc.buy_info where id = {{ id }}`)