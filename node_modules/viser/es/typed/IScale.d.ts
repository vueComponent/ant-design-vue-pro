declare type formatterFunc = (val: number) => string | number;
interface ICommonScale {
    dataKey: string;
    type?: string;
    formatter?: string | formatterFunc;
    range?: number[];
    alias?: string;
    tickCount?: number;
    ticks?: number[];
}
interface ILinearCommonScale {
    nice?: boolean;
    min?: number;
    max?: number;
    minLimit?: number;
    maxLimit?: number;
    tickInterval?: number;
}
export declare type ILinearScale = ICommonScale & ILinearCommonScale;
interface ISCatScale {
    values?: string;
}
export declare type ICatScale = ILinearCommonScale & ISCatScale;
interface ISLogScale {
    base?: number;
}
export declare type ILogScale = ICommonScale & ILinearCommonScale & ISLogScale;
interface ISPowScale {
    exponent?: number;
}
export declare type IPowScale = ICommonScale & ILinearCommonScale & ISPowScale;
interface ISTimeScale {
    mask?: string;
}
export declare type ITimeScale = ICommonScale & ILinearCommonScale & ISTimeScale;
interface ISTimeCatScale {
    nice?: boolean;
    mask?: string;
    values?: string;
}
export declare type ITimeCatScale = ILinearCommonScale & ISTimeCatScale;
export declare type IScale = ILinearScale | ICatScale | ILogScale | IPowScale | ITimeScale | ITimeCatScale;
declare type IScaleConfig = IScale | IScale[];
export default IScaleConfig;
