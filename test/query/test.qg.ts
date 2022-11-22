

import { qgen } from "qgen";



qgen('hello')
    .query('select * from test')
// qgen('hello2')
//     .query(`select * from bzc.buy_info`)
qgen('hello3')
    .query(`select $$('null',1,1)$$::inventory_item`)
