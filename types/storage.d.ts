import { QgenBuilder } from "./syntax-qgen-builder";
import { Typedef } from "./syntax-typedef";
export declare function addDefine(builder: QgenBuilder<any>): void;
export declare function clearDefine(): void;
export declare function getDefine(): {
    name: string;
    query: string;
    inputs: Record<string, {
        name: string;
        index: number;
        value: any;
        typeSnippet?: import("./ts-snippet").TsSnippet | undefined;
    }>;
    testValues: any[];
}[];
export declare function setTypedef(oid: number, def: Typedef): void;
export declare function setTypedef(name: {
    namespace: string;
    name: string;
}, def: Typedef): void;
export declare function getTypedef(...qs: (number | {
    namespace: string;
    name: string;
})[]): Typedef;
export declare function isExistTypedef(...qs: (number | {
    namespace: string;
    name: string;
})[]): boolean;
export declare function totalTypedef(): Typedef[];
