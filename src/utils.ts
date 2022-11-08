export function snakeToCamel(name: string): string {
    return name.split("_").map((v, i) => {
        if (i === 0) {
            return v
        }
        return v.slice(0, 1).toUpperCase() + v.slice(1)
    }).join("")
}