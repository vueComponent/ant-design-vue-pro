import * as IStyle from './IStyle';
declare type formatterFunc = (val: string | number) => string | number;
declare type eventFunc = (ev: any, chart: any) => void;
interface ITitle {
    autoRotate?: boolean;
    offset?: number;
    position?: string;
    textStyle?: IStyle.ITextStyle;
    text?: string;
}
interface IAxisTick {
    ticks?: number[];
    tickCount?: number;
    tickInterval?: number;
}
interface IAxisGrid {
    zIndex?: number;
    type?: string;
    align?: string;
    lineStyle?: IStyle.ILineStyle;
    line?: IStyle.ILineStyle;
    items?: object[];
    alternateColor?: string | string[];
    matrix?: any;
    hideFirstLine?: boolean;
    hideLastLine?: boolean;
}
interface IAxisLabel {
    density?: number;
    offset?: number | number[];
    formatter?: string | formatterFunc;
    autoRotate?: boolean;
    rotate?: number | string;
    textStyle?: IStyle.ITextStyle;
    htmlTemplate?: (text: any, item: any, index: any) => string;
}
export interface IAxis {
    dataKey?: string;
    show?: boolean;
    position?: string;
    title?: ITitle;
    tick?: IAxisTick;
    subTick?: IAxisTick;
    grid?: IAxisGrid;
    zIndex?: number;
    label?: boolean | IAxisLabel;
    line?: IStyle.ILineStyle;
    tickLine?: IStyle.ILineStyle;
    subTickCount?: number;
    subTickLine?: IStyle.ILineStyle;
    autoPaint?: boolean;
    useHtml?: boolean;
    onTitleMouseDown?: eventFunc;
    onTitleMouseMove?: eventFunc;
    onTitleMouseLeave?: eventFunc;
    onTitleMouseUp?: eventFunc;
    onTitleClick?: eventFunc;
    onTitleDblClick?: eventFunc;
    onTitleTouchStart?: eventFunc;
    onTitleTouchMove?: eventFunc;
    onTitleTouchEnd?: eventFunc;
    onLabelMouseDown?: eventFunc;
    onLabelMouseMove?: eventFunc;
    onLabelMouseLeave?: eventFunc;
    onLabelMouseUp?: eventFunc;
    onLabelClick?: eventFunc;
    onLabelDblClick?: eventFunc;
    onLabelTouchStart?: eventFunc;
    onLabelTouchMove?: eventFunc;
    onLabelTouchEnd?: eventFunc;
    onTicksMouseDown?: eventFunc;
    onTicksMouseMove?: eventFunc;
    onTicksMouseLeave?: eventFunc;
    onTicksMouseUp?: eventFunc;
    onTicksClick?: eventFunc;
    onTicksDblClick?: eventFunc;
    onTicksTouchStart?: eventFunc;
    onTicksTouchMove?: eventFunc;
    onTicksTouchEnd?: eventFunc;
    onLineMouseDown?: eventFunc;
    onLineMouseMove?: eventFunc;
    onLineMouseLeave?: eventFunc;
    onLineMouseUp?: eventFunc;
    onLineClick?: eventFunc;
    onLineDblClick?: eventFunc;
    onLineTouchStart?: eventFunc;
    onLineTouchMove?: eventFunc;
    onLineTouchEnd?: eventFunc;
    onGridMouseDown?: eventFunc;
    onGridMouseMove?: eventFunc;
    onGridMouseLeave?: eventFunc;
    onGridMouseUp?: eventFunc;
    onGridClick?: eventFunc;
    onGridDblClick?: eventFunc;
    onGridTouchStart?: eventFunc;
    onGridTouchMove?: eventFunc;
    onGridTouchEnd?: eventFunc;
}
declare type IAxisConfig = boolean | IAxis | IAxis[];
export default IAxisConfig;
