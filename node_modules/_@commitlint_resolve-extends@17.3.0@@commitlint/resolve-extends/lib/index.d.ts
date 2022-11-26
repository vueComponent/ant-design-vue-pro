import 'resolve-global';
import { UserConfig } from '@commitlint/types';
export interface ResolveExtendsContext {
    cwd?: string;
    parserPreset?: unknown;
    prefix?: string;
    resolve?(id: string, ctx?: {
        prefix?: string;
        cwd?: string;
    }): string;
    resolveGlobal?: (id: string) => string;
    require?<T>(id: string): T;
}
export default function resolveExtends(config?: UserConfig, context?: ResolveExtendsContext): UserConfig;
//# sourceMappingURL=index.d.ts.map