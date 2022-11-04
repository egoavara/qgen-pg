import { qgen } from 'qgen'
qgen('hello')
    .query('select * from bzc.user_info where real_name = {{ realName }}')
qgen('hello2')
    .query(`select row('00', 10, null)::types.price from bzc.user_info`)
