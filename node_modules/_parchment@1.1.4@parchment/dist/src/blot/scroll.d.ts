import ContainerBlot from './abstract/container';
import * as Registry from '../registry';
declare class ScrollBlot extends ContainerBlot {
    static blotName: string;
    static defaultChild: string;
    static scope: Registry.Scope;
    static tagName: string;
    observer: MutationObserver;
    constructor(node: HTMLDivElement);
    detach(): void;
    deleteAt(index: number, length: number): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def?: any): void;
    optimize(context: {
        [key: string]: any;
    }): void;
    optimize(mutations: MutationRecord[], context: {
        [key: string]: any;
    }): void;
    update(mutations?: MutationRecord[], context?: {
        [key: string]: any;
    }): void;
}
export default ScrollBlot;
