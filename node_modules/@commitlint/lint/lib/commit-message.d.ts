export interface CommitMessageData {
    header: string;
    body?: string | null;
    footer?: string | null;
}
export declare const buildCommitMesage: ({ header, body, footer, }: CommitMessageData) => string;
//# sourceMappingURL=commit-message.d.ts.map