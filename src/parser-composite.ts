export class CompositeParser {
    #source: string
    #pair: [string, (value: string) => any][]
    #position: number
    #index: number
    #output: any
    constructor(source: string, transform: [string, (value: string) => any][]) {
        this.#source = source
        this.#pair = transform
        this.#position = 0
        this.#output = null
        this.#index = 0
    }
    static create(transform: [string, (value: string) => any][]): (raw: string) => any {
        return (raw) => {
            return new CompositeParser(raw, transform).parse()
        }
    }

    isEof() {
        return this.#position >= this.#source.length
    }

    nextCharacter() {
        const character = this.#source[this.#position++]
        if (character === '\\') {
            return {
                value: this.#source[this.#position++],
                escaped: true
            }
        }
        return {
            value: character,
            escaped: false
        }
    }

    parse() {
        let character: { value: string, escaped: boolean }
        let quoted = false
        let quotedChar: '' | "'" | '"' = ''
        let buffer = ''
        while (!this.isEof()) {
            character = this.nextCharacter()
            if (quoted) {
                if (character.escaped === false && character.value === quotedChar) {
                    quoted = false
                    continue
                }
                buffer += character.value
                continue
            }
            switch (character.value) {
                case '(':
                    if (this.#output !== null) {
                        throw new Error("parse failed")
                    }
                    this.#output = {}
                    break
                case ' ':
                    break
                case "'":
                case '"':
                    if (buffer.length !== 0) {
                        throw new Error("quoted before finished")
                    }
                    quoted = true
                    quotedChar = character.value
                    break
                case ')':
                case ',':
                    const [key, parser] = this.#pair[this.#index++]

                    if (quotedChar === '' && buffer === 'null') {
                        // TODO : null safe
                        // @ts-ignore
                        this.#output[key] = parser(null)
                    } else {
                        this.#output[key] = parser(buffer)
                    }
                    quoted = false
                    quotedChar = ''
                    buffer = ''
                    break
                default:
                    if (quotedChar !== '') {
                        throw new Error("push after quote end")
                    }
                    buffer += character.value
                    break
            }
        }
        return this.#output
    }
}