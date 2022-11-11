import { qgen } from "qgen"

export default qgen()
    .type('public', 'yn', (raw) => raw === 'y')
    .type('public', 'test', (raw) => new Date(raw))