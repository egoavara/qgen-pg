import { qgen } from 'qgen'

qgen('hello')
    .query('select *, 4 from bzc.user_info where real_name = {{ realName }}')

// qgen('hello2')
//     .query(`select * from bzc.buy_info`)
