export declare type RuleField = 'header' | 'type' | 'scope' | 'subject' | 'body' | 'footer';
export declare type PromptName = RuleField | 'isBreaking' | 'breakingBody' | 'breaking' | 'isIssueAffected' | 'issuesBody' | 'issues';
export declare type PromptConfig = {
    settings: {
        scopeEnumSeparator: string;
        enableMultipleScopes: boolean;
    };
    messages: PromptMessages;
    questions: Partial<Record<PromptName, {
        description?: string;
        messages?: {
            [K: string]: string;
        };
        enum?: {
            [enumName: string]: {
                description?: string;
                title?: string;
                emoji?: string;
            };
        };
    }>>;
};
export declare type PromptMessages = {
    skip: string;
    max: string;
    min: string;
    emptyWarning: string;
    upperLimitWarning: string;
    lowerLimitWarning: string;
    [_key: string]: string;
};
export declare type UserPromptConfig = DeepPartial<PromptConfig>;
declare type DeepPartial<T> = {
    [P in keyof T]?: {
        [K in keyof T[P]]?: T[P][K];
    };
};
export {};
//# sourceMappingURL=prompt.d.ts.map