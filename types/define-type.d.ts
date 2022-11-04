export declare function DefAny(): DefAny;
export declare function DefPrimitive(type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined"): DefPrimitive;
export declare function DefStdlib(type: string): DefStdlib;
export declare function DefObject(type: Record<string, DefType>): DefObject;
export declare function DefExtern(name: string, type: string): DefExtern;
export declare type DefAny = {
    category: "any";
    type: "any";
};
export declare type DefPrimitive = {
    category: "primitive";
    type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined";
};
export declare type DefStdlib = {
    category: "stdlib";
    type: string;
};
export declare type DefObject = {
    category: "object";
    type: Record<string, DefType>;
};
export declare type DefExtern = {
    category: "extern";
    name: string;
    type: string;
};
export declare type DefTypeInternal = DefAny | DefPrimitive | DefObject | DefStdlib;
export declare type DefTypeExternal = DefExtern;
export declare type DefType = DefTypeInternal | DefTypeExternal;
export declare const TypeIdToDefine: {
    [x: number]: DefAny | DefPrimitive | DefStdlib;
};
