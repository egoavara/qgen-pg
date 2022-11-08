import { qgen } from 'qgen'

qgen('ex')
    .query('select * from bzc.user_info where real_name = {{ realName }}')

qgen('ex2')
    .query(`select * from bzc.buy_info`)
