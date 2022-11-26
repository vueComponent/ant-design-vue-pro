import FormatBlot from './abstract/format';
import * as Registry from '../registry';
declare class BlockBlot extends FormatBlot {
    static blotName: string;
    static scope: Registry.Scope;
    static tagName: string;
    static formats(domNode: HTMLElement): any;
    format(name: string, value: any): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def?: any): void;
    update(mutations: MutationRecord[], context: {
        [key: string]: any;
    }): void;
}
export default BlockBlot;
