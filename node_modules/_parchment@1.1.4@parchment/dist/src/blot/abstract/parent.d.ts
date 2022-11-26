import { Blot, Parent } from './blot';
import LinkedList from '../../collection/linked-list';
import ShadowBlot from './shadow';
import * as Registry from '../../registry';
declare class ParentBlot extends ShadowBlot implements Parent {
    static defaultChild: Registry.BlotConstructor | null;
    static allowedChildren: Registry.BlotConstructor[] | null;
    children: LinkedList<Blot>;
    domNode: HTMLElement;
    constructor(domNode: Node);
    appendChild(other: Blot): void;
    attach(): void;
    build(): void;
    deleteAt(index: number, length: number): number;
    descendant(criteria: {
        new (): Blot;
    }, index: number): [Blot | null, number];
    descendant(criteria: (blot: Blot) => boolean, index: number): [Blot | null, number];
    descendants(criteria: {
        new (): Blot;
    }, index: number, length: number): Blot[];
    descendants(criteria: (blot: Blot) => boolean, index: number, length: number): Blot[];
    detach(): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def?: any): number;
    insertBefore(childBlot: Blot, refBlot?: Blot | null): void;
    length(): number;
    moveChildren(targetParent: Parent, refNode?: Blot): void;
    optimize(context: {
        [key: string]: any;
    }): void;
    path(index: number, inclusive?: boolean): [Blot, number][];
    removeChild(child: Blot): void;
    replaceWith(name: string | Blot, value?: any): Blot;
    split(index: number, force?: boolean): Blot | null;
    unwrap(): void;
    update(mutations: MutationRecord[], context: {
        [key: string]: any;
    }): void;
}
export default ParentBlot;
