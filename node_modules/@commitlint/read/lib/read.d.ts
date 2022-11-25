interface GetCommitMessageOptions {
    cwd?: string;
    from?: string;
    to?: string;
    edit?: boolean | string;
}
export default function getCommitMessages(settings: GetCommitMessageOptions): Promise<string[]>;
export {};
//# sourceMappingURL=read.d.ts.map