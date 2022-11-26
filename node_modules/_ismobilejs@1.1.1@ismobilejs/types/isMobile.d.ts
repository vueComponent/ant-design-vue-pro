export declare type UserAgent = string;
export declare type Navigator = {
    userAgent: string;
    platform: string;
    maxTouchPoints?: number;
};
export declare type isMobileResult = {
    apple: {
        phone: boolean;
        ipod: boolean;
        tablet: boolean;
        universal: boolean;
        device: boolean;
    };
    amazon: {
        phone: boolean;
        tablet: boolean;
        device: boolean;
    };
    android: {
        phone: boolean;
        tablet: boolean;
        device: boolean;
    };
    windows: {
        phone: boolean;
        tablet: boolean;
        device: boolean;
    };
    other: {
        blackberry: boolean;
        blackberry10: boolean;
        opera: boolean;
        firefox: boolean;
        chrome: boolean;
        device: boolean;
    };
    phone: boolean;
    tablet: boolean;
    any: boolean;
};
export declare type IsMobileParameter = UserAgent | Navigator;
export default function isMobile(param?: IsMobileParameter): isMobileResult;
//# sourceMappingURL=isMobile.d.ts.map