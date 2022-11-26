import { Blot, Parent } from './blot';
import * as Registry from '../../registry';
declare class ShadowBlot implements Blot {
    domNode: Node;
    static blotName: string;
    static className: string;
    static scope: Registry.Scope;
    static tagName: string;
    prev: Blot;
    next: Blot;
    parent: Parent;
    scroll: Parent;
    readonly statics: any;
    static create(value: any): Node;
    constructor(domNode: Node);
    attach(): void;
    clone(): Blot;
    detach(): void;
    deleteAt(index: number, length: number): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def?: any): void;
    insertInto(parentBlot: Parent, refBlot?: Blot | null): void;
    isolate(index: number, length: number): Blot;
    length(): number;
    offset(root?: Blot): number;
    optimize(context: {
        [key: string]: any;
    }): void;
    remove(): void;
    replace(target: Blot): void;
    replaceWith(name: string | Blot, value?: any): Blot;
    split(index: number, force?: boolean): Blot;
    update(mutations: MutationRecord[], context: {
        [key: string]: any;
    }): void;
    wrap(name: string | Parent, value?: any): Parent;
}
export default ShadowBlot;
