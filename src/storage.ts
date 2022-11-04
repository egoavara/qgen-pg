import { QgenBuilder } from "./syntax"

const defines: QgenBuilder<any>[] = []
export function addDefine(builder: QgenBuilder<any>) {
    defines.push(builder)
}

export function clearDefine() {
    while (defines.pop() === undefined) { }
}

export function getDefine() {
    return defines.map((v) => v.end())
}
