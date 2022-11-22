

import { sqlfn } from "sqlfn"



sqlfn('hello')
    .exact(Infinity)
    .query('select * from test')
sqlfn('hello2')
    .void()
    .query(`select * from bzc.buy_info`)
sqlfn('hello3')
    .exact(1)
    .query(`select $$('null',1,1)$$::inventory_item`)
sqlfn('hello4')
    .option()
    .query(`select * from bzc.buy_info where id = {{ id }}`)