import IChart from './IChart';
import IFacet from './IFacet';
import ILegend from './ILegend';
import IViewConfig, { IView } from './IView';
interface ISMain {
    data?: any;
    viewId?: string;
    chart?: IChart;
    facet?: IFacet;
    legend?: ILegend;
    views?: IViewConfig;
}
declare type IMainConfig = ISMain & IView;
export default IMainConfig;
