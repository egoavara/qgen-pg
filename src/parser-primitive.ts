import pg from "pg"
export namespace PrimitiveParser {
    export class Point {
        x: number
        y: number
        constructor(x: number, y: number) { this.x = x; this.y = y }
        toPostgres(): string {
            return `(${this.x},${this.y})`
        }
    }
    export class Circle {
        x: number
        y: number
        radius: number
        constructor(x: number, y: number, radius: number) { this.x = x; this.y = y; this.radius = radius }
        toPostgres(): string {
            return `<(${this.x},${this.y}),${this.radius}>`
        }
    }
    // ax + by + c = 0
    export class Line {
        a: number
        b: number
        c: number
        constructor(a: number, b: number, c: number) { this.a = a; this.b = b; this.c = c }
        toPostgres(): string {
            return `{${this.a},${this.b},${this.c}}`
        }
    }
    export class Box {
        a: Point
        b: Point
        constructor(a: Point, b: Point) { this.a = a; this.b = b }
        toPostgres(): string {
            return `(${this.a.toPostgres()},${this.b.toPostgres()})`
        }
    }
    export class Path extends Array<Point>{
        constructor(...points: Point[]) {
            super(...points)
        }
        toPostgres(): string {

            return `[${this.map(v => v.toPostgres()).join(",")}]`
        }
    }
    export class Polygon extends Array<Point>{
        constructor(...points: Point[]) {
            super(...points)
        }
        toPostgres(): string {
            return `(${this.map(v => v.toPostgres()).join(",")})`
        }
    }
    export interface IPostgresInterval {
        years?: number
        months?: number
        days?: number
        hours?: number
        minutes?: number
        seconds?: number
        milliseconds?: number

        toPostgres(): string

        toISO(): string
        toISOString(): string
    }
    export type PgParser = (raw: string) => any;
    export const parseNullable = (fn: PgParser, fallback: null | undefined = null): PgParser => {
        if (fallback === null) {
            return (value) => {
                if (value === null) return null;
                return fn(value);
            }
        } else {
            return (value) => {
                if (value === null) return undefined;
                return fn(value);
            }
        }
    };
    export const noParse: PgParser = (value) => String(value);
    export const parseBool: PgParser = (value) => {
        if (value === null) return value;
        return value === 'TRUE' ||
            value === 't' ||
            value === 'true' ||
            value === 'y' ||
            value === 'yes' ||
            value === 'on' ||
            value === '1';
    };
    export const parseInteger: PgParser = (value) => {
        return parseInt(value, 10);
    };
    export const parseNumber: PgParser = (value) => {
        return parseFloat(value);
    };
    export const parseBigInteger: PgParser = (value) => {
        return BigInt(value)
    };
    export const parseJson: PgParser = JSON.parse;
    export const parseXml: PgParser = pg.types.getTypeParser(pg.types.builtins.XML);
    export const parseDate: PgParser = pg.types.getTypeParser(pg.types.builtins.DATE);
    export const parseInterval: PgParser = pg.types.getTypeParser(pg.types.builtins.INTERVAL);
    export const parseBytea: PgParser = pg.types.getTypeParser(pg.types.builtins.BYTEA);
    export const parsePoint: PgParser = (value) => {
        const [rawx, rawy] = value.slice(1, value.length - 1).split(',')
        return new Point(parseNumber(rawx), parseNumber(rawy))
    };
    export const parseCircle: PgParser = (value) => {
        const [rawpt, rawrd] = value.slice(2, value.length - 1).split(')')
        const [rawx, rawy] = rawpt.split(',')
        return new Circle(parseNumber(rawx), parseNumber(rawy), parseNumber(rawrd))
    };
    export const parseLine: PgParser = (value) => {
        const [rawa, rawb, rawc] = value.slice(1, value.length - 1).split(',')
        return new Line(parseNumber(rawa), parseNumber(rawb), parseNumber(rawc))
    };
    export const parseBox: PgParser = (value) => {
        const [rawx1, rawy1, rawx2, rawy2] = value.split(',')
        return new Box(
            new Point(parseNumber(rawx1.slice(2)), parseNumber(rawy1.slice(0, rawy1.length - 1))),
            new Point(parseNumber(rawx2.slice(1)), parseNumber(rawy2.slice(0, rawy2.length - 1))),
        )
    };
    export const parsePath: PgParser = (value) => {
        const rawpoints = value.slice(2, value.length - 2).split('),(').map((v) => {
            const [rawx, rawy] = v.split(',')
            return new Point(parseNumber(rawx), parseNumber(rawy))
        })
        return new Path(...rawpoints)
    };
    export const parsePolygon: PgParser = (value) => {
        const rawpoints = value.slice(2, value.length - 2).split('),(').map((v) => {
            const [rawx, rawy] = v.split(',')
            return new Point(parseNumber(rawx), parseNumber(rawy))
        })
        return new Path(...rawpoints)
    };
}