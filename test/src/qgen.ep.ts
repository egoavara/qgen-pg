import { qgen } from "qgen"

export default qgen()
    .use("bigint")
    .use("bitnumber.js")
    .use("moment")
    .type('public', 'yn', (raw) => raw === 'y')
    .type('public', 'test', (raw) => new Date(raw))