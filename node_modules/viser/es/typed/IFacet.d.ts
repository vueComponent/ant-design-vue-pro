import * as IStyle from './IStyle';
interface IColTitleProps {
    offsetY?: number;
    style?: IStyle.ITextStyle;
}
interface IRowTitleProps {
    offsetX?: number;
    style?: IStyle.ITextStyle;
}
interface IFacet {
    type: string;
    fields?: string[];
    cols?: number;
    rows?: number;
    colField?: string | string[];
    rowField?: string | string[];
    colValue?: number;
    rowValue?: number;
    colIndex?: number;
    rowIndex?: number;
    showTitle?: boolean;
    colTitle?: IColTitleProps;
    rowTitle?: IRowTitleProps;
    autoSetAxis?: boolean;
    padding?: number | number[];
    transpose?: boolean;
    line?: IStyle.ILineStyle;
    lineSmooth?: boolean;
    views?: any;
    eachView?: (views: any, facet: any) => void;
}
export default IFacet;
