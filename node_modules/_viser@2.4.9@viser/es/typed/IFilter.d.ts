interface IFilter {
    dataKey: string;
    callback: (ev: any) => boolean;
}
declare type IFilterConfig = IFilter | IFilter[];
export default IFilterConfig;
