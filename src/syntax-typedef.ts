export type Typedef =
    | { type: "expression", expr: string }
    | { type: "module", namespace: string, name: string, expr: string }
    | { type: "internal", symbol: string }
    | { type: "external", pkg: string, symbol: string }