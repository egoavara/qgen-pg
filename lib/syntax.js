import { addDefine } from "./storage.js";
const RE_NAMED_ARGS = /\{\{\s*([a-zA-Z_-][a-zA-Z0-9_-]*)\s*\}\}/g;
export class QgenBuilder {
    #name;
    #query;
    #inputs;
    constructor(name, query, inputs) {
        this.#name = name;
        this.#query = query;
        this.#inputs = inputs;
    }
    static create(name) {
        return new QgenBuilder(name, '', {});
    }
    query(query) {
        let idx = 1;
        let qStartAt = 0;
        this.#inputs = {};
        this.#query = '';
        for (const field of query.matchAll(RE_NAMED_ARGS)) {
            if (field[1] in this.#inputs) {
                continue;
            }
            this.#query += query.slice(qStartAt, field.index) + `$${idx}`;
            this.#inputs[field[1]] = { index: idx++, value: null };
            qStartAt = field.index + field[0].length;
        }
        this.#query += query.slice(qStartAt);
        return this;
    }
    inputType(partitial) {
        for (const [k, v] of Object.entries(partitial)) {
            this.#inputs[k].typeSnippet = v;
        }
        return this;
    }
    inputs(partitial) {
        for (const [k, v] of Object.entries(partitial)) {
            this.#inputs[k].value = v;
        }
        return this;
    }
    end() {
        return {
            name: this.#name,
            query: this.#query,
            inputs: this.#inputs,
            testValues: Object.entries(this.#inputs).sort(([k, v]) => { return v.index; }).reduce((acc, [k, v]) => { acc.push(v.value); return acc; }, [])
        };
    }
}
export const qgen = (name) => {
    const temp = QgenBuilder.create(name);
    addDefine(temp);
    return temp;
};
