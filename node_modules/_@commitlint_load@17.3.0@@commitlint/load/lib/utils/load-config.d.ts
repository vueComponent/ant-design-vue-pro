export interface LoadConfigResult {
    config: unknown;
    filepath: string;
    isEmpty?: boolean;
}
export declare function loadConfig(cwd: string, configPath?: string): Promise<LoadConfigResult | null>;
//# sourceMappingURL=load-config.d.ts.map