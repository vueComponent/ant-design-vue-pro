/// <reference types="node" />
export declare type DetectedInfoType = 'browser' | 'node' | 'bot-device' | 'bot' | 'react-native';
interface DetectedInfo<T extends DetectedInfoType, N extends string, O, V = null> {
    readonly type: T;
    readonly name: N;
    readonly version: V;
    readonly os: O;
}
export declare class BrowserInfo implements DetectedInfo<'browser', Browser, OperatingSystem | null, string> {
    readonly name: Browser;
    readonly version: string;
    readonly os: OperatingSystem | null;
    readonly type = "browser";
    constructor(name: Browser, version: string, os: OperatingSystem | null);
}
export declare class NodeInfo implements DetectedInfo<'node', 'node', NodeJS.Platform, string> {
    readonly version: string;
    readonly type = "node";
    readonly name: 'node';
    readonly os: NodeJS.Platform;
    constructor(version: string);
}
export declare class SearchBotDeviceInfo implements DetectedInfo<'bot-device', Browser, OperatingSystem | null, string> {
    readonly name: Browser;
    readonly version: string;
    readonly os: OperatingSystem | null;
    readonly bot: string;
    readonly type = "bot-device";
    constructor(name: Browser, version: string, os: OperatingSystem | null, bot: string);
}
export declare class BotInfo implements DetectedInfo<'bot', 'bot', null, null> {
    readonly type = "bot";
    readonly bot: true;
    readonly name: 'bot';
    readonly version: null;
    readonly os: null;
}
export declare class ReactNativeInfo implements DetectedInfo<'react-native', 'react-native', null, null> {
    readonly type = "react-native";
    readonly name: 'react-native';
    readonly version: null;
    readonly os: null;
}
export declare type Browser = 'aol' | 'edge' | 'edge-ios' | 'yandexbrowser' | 'kakaotalk' | 'samsung' | 'silk' | 'miui' | 'beaker' | 'edge-chromium' | 'chrome' | 'chromium-webview' | 'phantomjs' | 'crios' | 'firefox' | 'fxios' | 'opera-mini' | 'opera' | 'pie' | 'netfront' | 'ie' | 'bb10' | 'android' | 'ios' | 'safari' | 'facebook' | 'instagram' | 'ios-webview' | 'curl' | 'searchbot';
export declare type OperatingSystem = 'iOS' | 'Android OS' | 'BlackBerry OS' | 'Windows Mobile' | 'Amazon OS' | 'Windows 3.11' | 'Windows 95' | 'Windows 98' | 'Windows 2000' | 'Windows XP' | 'Windows Server 2003' | 'Windows Vista' | 'Windows 7' | 'Windows 8' | 'Windows 8.1' | 'Windows 10' | 'Windows ME' | 'Windows CE' | 'Open BSD' | 'Sun OS' | 'Linux' | 'Mac OS' | 'QNX' | 'BeOS' | 'OS/2' | 'Chrome OS';
export declare function detect(userAgent?: string): BrowserInfo | SearchBotDeviceInfo | BotInfo | NodeInfo | ReactNativeInfo | null;
export declare function browserName(ua: string): Browser | null;
export declare function parseUserAgent(ua: string): BrowserInfo | SearchBotDeviceInfo | BotInfo | null;
export declare function detectOS(ua: string): OperatingSystem | null;
export declare function getNodeVersion(): NodeInfo | null;
export {};
