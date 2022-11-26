import { ParserPreset } from '@commitlint/types';
declare type Awaitable<T> = T | PromiseLike<T>;
export declare function loadParserOpts(pendingParser: string | Awaitable<ParserPreset> | (() => Awaitable<ParserPreset>) | undefined): Promise<ParserPreset | undefined>;
export {};
//# sourceMappingURL=load-parser-opts.d.ts.map