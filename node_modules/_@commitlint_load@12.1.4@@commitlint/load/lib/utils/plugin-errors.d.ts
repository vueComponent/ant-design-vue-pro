export declare class WhitespacePluginError extends Error {
    __proto__: ErrorConstructor;
    messageTemplate: string;
    messageData: any;
    constructor(pluginName?: string, data?: any);
}
export declare class MissingPluginError extends Error {
    __proto__: ErrorConstructor;
    messageTemplate: string;
    messageData: any;
    constructor(pluginName?: string, errorMessage?: string, data?: any);
}
//# sourceMappingURL=plugin-errors.d.ts.map