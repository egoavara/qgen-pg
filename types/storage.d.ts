import { QgenBuilder } from "./syntax";
export declare function addDefine(builder: QgenBuilder<any>): void;
export declare function clearDefine(): void;
export declare function getDefine(): {
    name: string;
    query: string;
    inputs: Record<string, {
        index: number;
        value: any;
        typeSnippet?: import("./ts-snippet").TsSnippet | undefined;
    }>;
    testValues: any[];
}[];
