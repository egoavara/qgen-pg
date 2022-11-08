import { qgen } from 'qgen'

qgen('hello')
    .query('select * from bzc.user_info where real_name = {{ realName }}')

qgen('hello2')
    .query(`select * from bzc.buy_info`)
