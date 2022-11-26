export declare class TypeScriptCompileError extends Error {
    constructor(message: string);
    static fromError(error: Error): TypeScriptCompileError;
}
