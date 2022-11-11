

import { qgen } from "qgen";



qgen('hello')
    .query('select count(*) from bzc.user_info where real_name = {{ realName }}')
    .input<string>('realName')
// qgen('hello2')
//     .query(`select * from bzc.buy_info`)
