export const QueryHeader = `// qgen query ...
import type pg from 'pg';
`;
export const HeaderStart = `// qgen type ...
import pg from 'pg';
const builtinOids: number[] = Object.values(pg.types.builtins);

// 사용자 입력은 반드시 아래의 블럭 사이에서만 작성해야 합니다.
// 그 외의 영역에서 작성된 소스코드는 모두 삭제됩니다.`;
export const LineSep = `// ===================================================================== //`;
export const DefaultUserBlockHint = `// 여기서 소스코드를 작성하세요...`;
export const HeaderEnd = `// 여기 아래부터는 자동 생성된 파서입니다. 건들지 마세요.`;
/**
 *
 */
export const ArrayParser = `
/**
 * Thanks to bendrucker
 * 
 * https://github.com/bendrucker/postgres-array
 * 
 * typescript modified, static function added
 */
class ArrayParser {
    static identity(value: string) { return value }
    source: string
    transform: (value: string) => any
    position: number
    entries: any[]
    recorded: string[]
    dimension: number
    constructor(source: string, transform: (value: string) => any) {
        this.source = source
        this.transform = transform || ArrayParser.identity
        this.position = 0
        this.entries = []
        this.recorded = []
        this.dimension = 0
    }

    isEof() {
        return this.position >= this.source.length
    }

    nextCharacter() {
        const character = this.source[this.position++]
        if (character === '\\\\') {
            return {
                value: this.source[this.position++],
                escaped: true
            }
        }
        return {
            value: character,
            escaped: false
        }
    }

    record(character: string) {
        this.recorded.push(character)
    }

    newEntry(includeEmpty?: boolean) {
        let entry
        if (this.recorded.length > 0 || includeEmpty) {
            entry = this.recorded.join('')
            if (entry === 'NULL' && !includeEmpty) {
                entry = null
            }
            if (entry !== null) entry = this.transform(entry)
            this.entries.push(entry)
            this.recorded = []
        }
    }

    consumeDimensions() {
        if (this.source[0] === '[') {
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
                this.dimension++
                if (this.dimension > 1) {
                    parser = new ArrayParser(this.source.substring(this.position - 1), this.transform)
                    this.entries.push(parser.parse(true))
                    this.position += parser.position - 2
                }
            } else if (character.value === '}' && !quote) {
                this.dimension--
                if (!this.dimension) {
                    this.newEntry()
                    if (nested) return this.entries
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
        if (this.dimension !== 0) {
            throw new Error('array dimension not balanced')
        }
        return this.entries
    }
}
`;
export const ClassParser = `
class ClassParser {
    source: string
    transform: [string, (value: string) => any][]
    position: number
    index: number
    output: any
    constructor(source: string, transform: [string, (value: string) => any][]) {
        this.source = source
        this.transform = transform
        this.position = 0
        this.output = null
        this.index = 0
    }

    isEof() {
        return this.position >= this.source.length
    }

    nextCharacter() {
        const character = this.source[this.position++]
        if (character === '\\\\') {
            return {
                value: this.source[this.position++],
                escaped: true
            }
        }
        return {
            value: character,
            escaped: false
        }
    }

    parse() {
        let character: { value: string, escaped: boolean };
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
                    if (this.output !== null) {
                        throw new Error("parse failed")
                    }
                    this.output = {}
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
                    const [key, parser] = this.transform[this.index++]
                    this.output[key] = parser(buffer)
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
        return this.output
    }
}
`;
//# sourceMappingURL=source.js.map