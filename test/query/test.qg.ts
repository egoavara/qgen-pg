

import { qgen } from "qgen";



qgen('hello')
    .exact(Infinity)
    .query('select * from test')
qgen('hello2')
    .void()
    .query(`select * from bzc.buy_info`)
qgen('hello3')
    .exact(1)
    .query(`select $$('null',1,1)$$::inventory_item`)

qgen('hello4')
    .option()
    .query(`select * from bzc.buy_info where buy_id = {{ id }}`)