import FormatBlot from './abstract/format';
import * as Registry from '../registry';
declare class InlineBlot extends FormatBlot {
    static blotName: string;
    static scope: Registry.Scope;
    static tagName: string;
    static formats(domNode: HTMLElement): any;
    format(name: string, value: any): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    optimize(context: {
        [key: string]: any;
    }): void;
}
export default InlineBlot;
