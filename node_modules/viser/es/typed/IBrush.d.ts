declare type eventFunc = (ev: any, chart: any) => void;
export interface IBrush {
    canvas?: any;
    startPoint?: object;
    brushing?: boolean;
    dragging?: boolean;
    brushShape?: any;
    container?: any;
    polygonPath?: string;
    style?: object;
    type?: string;
    dragable?: boolean;
    dragoffX?: number;
    dragoffY?: number;
    inPlot?: boolean;
    xField?: string;
    yField?: string;
    filter?: boolean;
    onBrushstart?: eventFunc;
    onBrushmove?: eventFunc;
    onBrushend?: eventFunc;
    onDragstart?: eventFunc;
    onDragmove?: eventFunc;
    onDragend?: eventFunc;
}
export default IBrush;
