export class ArrayParser {
    #source: string
    #elem: (value: string) => any
    #position: number
    #entries: any[]
    #recorded: string[]
    #dimension: number
    constructor(source: string, transform: (value: string) => any) {
        this.#source = source
        this.#elem = transform
        this.#position = 0
        this.#entries = []
        this.#recorded = []
        this.#dimension = 0
    }
    static create(transform: (value: string) => any): (raw: string) => any {
        return (raw) => {
            return new ArrayParser(raw, transform).parse()
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

    record(character: string) {
        this.#recorded.push(character)
    }

    newEntry(includeEmpty?: boolean) {
        let entry
        if (this.#recorded.length > 0 || includeEmpty) {
            entry = this.#recorded.join('')
            if (entry === 'NULL' && !includeEmpty) {
                entry = null
            }
            if (entry !== null) entry = this.#elem(entry)
            this.#entries.push(entry)
            this.#recorded = []
        }
    }

    consumeDimensions() {
        if (this.#source[0] === '[') {
            while (!this.isEof()) {
                const char = this.nextCharacter()
                if (char.value === '=') break
            }
        }
    }

    parse(nested?: boolean) {
        let character, parser, quote
        this.consumeDimensions()
        while (!this.isEof()) {
            character = this.nextCharacter()
            if (character.value === '{' && !quote) {
                this.#dimension++
                if (this.#dimension > 1) {
                    parser = new ArrayParser(this.#source.substring(this.#position - 1), this.#elem)
                    this.#entries.push(parser.parse(true))
                    this.#position += parser.#position - 2
                }
            } else if (character.value === '}' && !quote) {
                this.#dimension--
                if (!this.#dimension) {
                    this.newEntry()
                    if (nested) return this.#entries
                }
            } else if (character.value === '"' && !character.escaped) {
                if (quote) this.newEntry(true)
                quote = !quote
            } else if (character.value === ',' && !quote) {
                this.newEntry()
            } else {
                this.record(character.value)
            }
        }
        if (this.#dimension !== 0) {
            throw new Error('array dimension not balanced')
        }
        return this.#entries
    }
}