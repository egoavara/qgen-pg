

export const QueryHeader = (ep: string) => `// qgen query ...
import type pg from 'pg';
import _QGEN_EP from ${JSON.stringify(ep)}
`
