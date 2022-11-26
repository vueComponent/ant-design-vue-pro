import { Formattable, Leaf } from './blot';
import ShadowBlot from './shadow';
import * as Registry from '../../registry';

class LeafBlot extends ShadowBlot implements Leaf {
  static scope = Registry.Scope.INLINE_BLOT;

  static value(domNode: Node): any {
    return true;
  }

  index(node: Node, offset: number): number {
    if (
      this.domNode === node ||
      this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY
    ) {
      return Math.min(offset, 1);
    }
    return -1;
  }

  position(index: number, inclusive?: boolean): [Node, number] {
    let offset = [].indexOf.call(this.parent.domNode.childNodes, this.domNode);
    if (index > 0) offset += 1;
    return [this.parent.domNode, offset];
  }

  value(): any {
    return { [this.statics.blotName]: this.statics.value(this.domNode) || true };
  }
}

export default LeafBlot;
