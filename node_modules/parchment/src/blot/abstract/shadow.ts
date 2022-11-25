import { Blot, Parent, Formattable } from './blot';
import * as Registry from '../../registry';

class ShadowBlot implements Blot {
  static blotName = 'abstract';
  static className: string;
  static scope: Registry.Scope;
  static tagName: string;

  // @ts-ignore
  prev: Blot;
  // @ts-ignore
  next: Blot;
  // @ts-ignore
  parent: Parent;
  // @ts-ignore
  scroll: Parent;

  // Hack for accessing inherited static methods
  get statics(): any {
    return this.constructor;
  }

  static create(value: any): Node {
    if (this.tagName == null) {
      throw new Registry.ParchmentError('Blot definition missing tagName');
    }
    let node;
    if (Array.isArray(this.tagName)) {
      if (typeof value === 'string') {
        value = value.toUpperCase();
        if (parseInt(value).toString() === value) {
          value = parseInt(value);
        }
      }
      if (typeof value === 'number') {
        node = document.createElement(this.tagName[value - 1]);
      } else if (this.tagName.indexOf(value) > -1) {
        node = document.createElement(value);
      } else {
        node = document.createElement(this.tagName[0]);
      }
    } else {
      node = document.createElement(this.tagName);
    }
    if (this.className) {
      node.classList.add(this.className);
    }
    return node;
  }

  constructor(public domNode: Node) {
    // @ts-ignore
    this.domNode[Registry.DATA_KEY] = { blot: this };
  }

  attach(): void {
    if (this.parent != null) {
      this.scroll = this.parent.scroll;
    }
  }

  clone(): Blot {
    let domNode = this.domNode.cloneNode(false);
    return Registry.create(domNode);
  }

  detach() {
    if (this.parent != null) this.parent.removeChild(this);
    // @ts-ignore
    delete this.domNode[Registry.DATA_KEY];
  }

  deleteAt(index: number, length: number): void {
    let blot = this.isolate(index, length);
    blot.remove();
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    let blot = this.isolate(index, length);
    if (Registry.query(name, Registry.Scope.BLOT) != null && value) {
      blot.wrap(name, value);
    } else if (Registry.query(name, Registry.Scope.ATTRIBUTE) != null) {
      let parent = <Parent & Formattable>Registry.create(this.statics.scope);
      blot.wrap(parent);
      parent.format(name, value);
    }
  }

  insertAt(index: number, value: string, def?: any): void {
    let blot = def == null ? Registry.create('text', value) : Registry.create(value, def);
    let ref = this.split(index);
    this.parent.insertBefore(blot, ref);
  }

  insertInto(parentBlot: Parent, refBlot: Blot | null = null): void {
    if (this.parent != null) {
      this.parent.children.remove(this);
    }
    let refDomNode: Node | null = null;
    parentBlot.children.insertBefore(this, refBlot);
    if (refBlot != null) {
      refDomNode = refBlot.domNode;
    }
    if (this.domNode.parentNode != parentBlot.domNode ||
        this.domNode.nextSibling != refDomNode) {
      parentBlot.domNode.insertBefore(this.domNode, refDomNode);
    }
    this.parent = parentBlot;
    this.attach();
  }

  isolate(index: number, length: number): Blot {
    let target = this.split(index);
    target.split(length);
    return target;
  }

  length(): number {
    return 1;
  }

  offset(root: Blot = this.parent): number {
    if (this.parent == null || this == root) return 0;
    return this.parent.children.offset(this) + this.parent.offset(root);
  }

  optimize(context: { [key: string]: any }): void {
    // TODO clean up once we use WeakMap
    // @ts-ignore
    if (this.domNode[Registry.DATA_KEY] != null) {
      // @ts-ignore
      delete this.domNode[Registry.DATA_KEY].mutations;
    }
  }

  remove(): void {
    if (this.domNode.parentNode != null) {
      this.domNode.parentNode.removeChild(this.domNode);
    }
    this.detach();
  }

  replace(target: Blot): void {
    if (target.parent == null) return;
    target.parent.insertBefore(this, target.next);
    target.remove();
  }

  replaceWith(name: string | Blot, value?: any): Blot {
    let replacement = typeof name === 'string' ? Registry.create(name, value) : name;
    replacement.replace(this);
    return replacement;
  }

  split(index: number, force?: boolean): Blot {
    return index === 0 ? this : this.next;
  }

  update(mutations: MutationRecord[], context: { [key: string]: any }): void {
    // Nothing to do by default
  }

  wrap(name: string | Parent, value?: any): Parent {
    let wrapper = typeof name === 'string' ? <Parent>Registry.create(name, value) : name;
    if (this.parent != null) {
      this.parent.insertBefore(wrapper, this.next);
    }
    wrapper.appendChild(this);
    return wrapper;
  }
}

export default ShadowBlot;
