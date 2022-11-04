const defines = [];
export function addDefine(builder) {
    defines.push(builder);
}
export function clearDefine() {
    while (defines.pop() === undefined) { }
}
export function getDefine() {
    return defines.map((v) => v.end());
}
