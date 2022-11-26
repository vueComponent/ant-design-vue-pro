import { Leaf } from './blot';
import ShadowBlot from './shadow';
import * as Registry from '../../registry';
declare class LeafBlot extends ShadowBlot implements Leaf {
    static scope: Registry.Scope;
    static value(domNode: Node): any;
    index(node: Node, offset: number): number;
    position(index: number, inclusive?: boolean): [Node, number];
    value(): any;
}
export default LeafBlot;
