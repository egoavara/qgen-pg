

import { qgen } from "qgen";



qgen('hello')
    .query('select * from test where name = {{ name }}')
// qgen('hello2')
//     .query(`select * from bzc.buy_info`)
