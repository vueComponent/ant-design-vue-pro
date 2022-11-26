import * as IStyle from './IStyle';
declare type eventFunc = (ev: any, chart: any) => void;
declare type htmlContentFunc = (title: string, items: any) => string;
declare type triggerType = 'mousemove' | 'click' | 'none';
interface ICrosshairs {
    type?: string;
    style?: IStyle.ILineStyle;
}
export interface ITooltip {
    x?: number;
    y?: number;
    items?: object[];
    show?: boolean;
    triggerOn?: triggerType;
    showTitle?: boolean;
    title?: string;
    crosshairs?: boolean | string | ICrosshairs;
    offset?: number;
    inPlot?: boolean;
    follow?: boolean;
    shared?: boolean;
    enterable?: boolean;
    position?: string;
    hideMarkers?: boolean;
    containerTpl?: string;
    itemTpl?: string;
    type?: string;
    useHtml?: boolean;
    htmlContent?: string | htmlContentFunc;
    g2Tooltip?: any;
    g2TooltipTitle?: any;
    g2TooltipList?: any;
    g2TooltipListItem?: any;
    g2TooltipMarker?: any;
    onShow?: eventFunc;
    onHide?: eventFunc;
    onChange?: eventFunc;
    defaultPoint?: any;
    timeStamp?: number;
    plotRange?: object;
}
declare type ITooltipConfig = boolean | ITooltip;
export default ITooltipConfig;
