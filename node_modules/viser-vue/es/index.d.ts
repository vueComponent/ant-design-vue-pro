import Vue from 'vue';
declare const _default: {
    install: (Vue: any, options: string[] | undefined) => void;
};
export default _default;
export declare const registerAnimation: (animationType: string, animationName: string, animationFun: any) => void;
export declare const registerShape: (geoName: string, shapeName: string, shapeFun: any) => void;
export declare const Global: any;
declare module 'vue/types/vue' {
    interface Vue {
        chart: any;
        _props?: object;
        _uid?: string;
        jsonForD2: any;
        plugins: any;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        _componentTag?: any;
    }
}
