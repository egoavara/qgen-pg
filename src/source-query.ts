

export const QueryHeader = (ep: string) => `// sqlfn query ...
import type pg from 'pg';
import type { FixedArray } from 'sqlfn';
import _SQLFN_EP from ${JSON.stringify(ep)}
`
