import * as IStyle from './IStyle';
declare type func = () => void;
declare type eventFunc = (ev: any, chart: any) => void;
interface IGuideEvent {
    onMouseDown?: eventFunc;
    onMouseMove?: eventFunc;
    onMouseLeave?: eventFunc;
    onMouseUp?: eventFunc;
    onClick?: eventFunc;
    onDblClick?: eventFunc;
    onTouchStart?: eventFunc;
    onTouchMove?: eventFunc;
    onTouchEnd?: eventFunc;
}
interface ILineText {
    position?: string | number;
    autoRotate?: boolean;
    style?: IStyle.ITextStyle;
    content?: string;
    offsetX?: number;
    offsetY?: number;
}
export interface ILineGuide {
    type?: 'line';
    top?: boolean;
    zIndex?: number;
    start?: object | Array<number | string> | func;
    end?: object | Array<number | string> | func;
    lineStyle?: IStyle.ILineStyle;
    text?: ILineText;
}
export interface ITextGuide {
    type?: 'text';
    top?: boolean;
    zIndex?: number;
    position?: object | Array<number | string> | func;
    content?: string;
    style?: IStyle.ITextStyle;
    offsetX?: number;
    offsetY?: number;
}
export interface IImageGuide {
    type?: 'image';
    top?: boolean;
    zIndex?: number;
    start?: object | Array<number | string> | func;
    end?: object | Array<number | string> | func;
    src?: string;
    width?: number;
    height?: number;
    offsetX?: number;
    offsetY?: number;
}
interface IRegionStyle {
    lineWidth?: number;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
}
export interface IRegionGuide {
    type?: 'region';
    top?: boolean;
    start?: object | Array<number | string> | func;
    end?: object | Array<number | string> | func;
    style?: IRegionStyle;
}
export interface IHtmlGuide {
    type?: 'html';
    position?: object | Array<number | string> | func;
    alignX?: string;
    alignY?: string;
    offsetX?: number;
    offsetY?: number;
    html?: string;
    zIndex?: number;
}
export interface IArcGuide {
    type?: 'arc';
    top?: boolean;
    start?: object | Array<number | string> | func;
    end?: object | Array<number | string> | func;
    style?: object;
}
export interface IDataRegionGuide {
    type?: 'dataRegion';
    top?: boolean;
    start?: object | Array<number | string> | func;
    end?: object | Array<number | string> | func;
    content?: string;
    style?: object;
    display?: object;
    lineLength?: number;
    direction?: 'upward' | 'downward';
}
export interface IDataMarkerGuide {
    type?: 'dataMarker';
    top?: boolean;
    position?: object | Array<number | string> | func;
    content?: string;
    style?: object;
    display?: object;
    lineLength?: number;
    direction?: 'upward' | 'downward';
}
export interface IRegionFilter {
    type?: 'regionFilter';
    top?: boolean;
    start?: object | Array<number | string> | func;
    end?: object | Array<number | string> | func;
    color?: string;
    apply?: string[];
}
export declare type IGuide = IGuideEvent & (ILineGuide | ITextGuide | IImageGuide | IRegionGuide | IArcGuide | IHtmlGuide | IDataRegionGuide | IDataMarkerGuide | IRegionFilter);
declare type IGuideConfig = IGuide | IGuide[];
export default IGuideConfig;
