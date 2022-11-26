import { Blot, Leaf } from './abstract/blot';
import LeafBlot from './abstract/leaf';
import * as Registry from '../registry';

class TextBlot extends LeafBlot implements Leaf {
  static blotName = 'text';
  static scope = Registry.Scope.INLINE_BLOT;

  public domNode!: Text;
  protected text: string;

  static create(value: string): Text {
    return document.createTextNode(value);
  }

  static value(domNode: Text): string {
    let text = domNode.data;
    // @ts-ignore
    if (text['normalize']) text = text['normalize']();
    return text;
  }

  constructor(node: Node) {
    super(node);
    this.text = this.statics.value(this.domNode);
  }

  deleteAt(index: number, length: number): void {
    this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
  }

  index(node: Node, offset: number): number {
    if (this.domNode === node) {
      return offset;
    }
    return -1;
  }

  insertAt(index: number, value: string, def?: any): void {
    if (def == null) {
      this.text = this.text.slice(0, index) + value + this.text.slice(index);
      this.domNode.data = this.text;
    } else {
      super.insertAt(index, value, def);
    }
  }

  length(): number {
    return this.text.length;
  }

  optimize(context: { [key: string]: any }): void {
    super.optimize(context);
    this.text = this.statics.value(this.domNode);
    if (this.text.length === 0) {
      this.remove();
    } else if (this.next instanceof TextBlot && this.next.prev === this) {
      this.insertAt(this.length(), (<TextBlot>this.next).value());
      this.next.remove();
    }
  }

  position(index: number, inclusive: boolean = false): [Node, number] {
    return [this.domNode, index];
  }

  split(index: number, force: boolean = false): Blot {
    if (!force) {
      if (index === 0) return this;
      if (index === this.length()) return this.next;
    }
    let after = Registry.create(this.domNode.splitText(index));
    this.parent.insertBefore(after, this.next);
    this.text = this.statics.value(this.domNode);
    return after;
  }

  update(mutations: MutationRecord[], context: { [key: string]: any }): void {
    if (
      mutations.some(mutation => {
        return mutation.type === 'characterData' && mutation.target === this.domNode;
      })
    ) {
      this.text = this.statics.value(this.domNode);
    }
  }

  value(): string {
    return this.text;
  }
}

export default TextBlot;
