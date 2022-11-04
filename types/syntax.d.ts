import { TsSnippet } from "./ts-snippet.js";
export declare type Trim<Q> = Q extends ` ${infer Remain}` ? Trim<Remain> : Q extends `${infer Remain} ` ? Trim<Remain> : Q;
export declare type QueryArgs<Q> = Q extends `${string}{{${infer Name}}}${infer Remain}` ? Trim<Name> | QueryArgs<Remain> : never;
export declare class QgenBuilder<Query extends string = ''> {
    #private;
    private constructor();
    static create(name: string): QgenBuilder;
    query<NewQuery extends string>(query: NewQuery): QgenBuilder<NewQuery>;
    inputType(partitial: Partial<Record<QueryArgs<Query>, TsSnippet>>): QgenBuilder<Query>;
    inputs(partitial: Partial<Record<QueryArgs<Query>, any>>): QgenBuilder<Query>;
    end(): {
        name: string;
        query: string;
        inputs: Record<string, {
            index: number;
            value: any;
            typeSnippet?: TsSnippet | undefined;
        }>;
        testValues: any[];
    };
}
export declare const qgen: (name: string) => QgenBuilder<"">;
