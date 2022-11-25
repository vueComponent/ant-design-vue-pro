import { Blot, Parent, Leaf } from './blot';
import LinkedList from '../../collection/linked-list';
import ShadowBlot from './shadow';
import * as Registry from '../../registry';

class ContainerBlot extends ShadowBlot implements Parent {
  static defaultChild: string;
  static allowedChildren: any[];

  children!: LinkedList<Blot>;
  domNode!: HTMLElement;

  constructor(domNode: Node) {
    super(domNode);
    this.build();
  }

  appendChild(other: Blot): void {
    this.insertBefore(other);
  }

  attach(): void {
    super.attach();
    this.children.forEach(child => {
      child.attach();
    });
  }

  build(): void {
    this.children = new LinkedList<Blot>();
    // Need to be reversed for if DOM nodes already in order
    [].slice
      .call(this.domNode.childNodes)
      .reverse()
      .forEach((node: Node) => {
        try {
          let child = makeBlot(node);
          this.insertBefore(child, this.children.head || undefined);
        } catch (err) {
          if (err instanceof Registry.ParchmentError) return;
          else throw err;
        }
      });
  }

  deleteAt(index: number, length: number): void {
    if (index === 0 && length === this.length()) {
      return this.remove();
    }
    this.children.forEachAt(index, length, function(child, offset, length) {
      child.deleteAt(offset, length);
    });
  }

  descendant(criteria: { new (): Blot }, index: number): [Blot | null, number];
  descendant(criteria: (blot: Blot) => boolean, index: number): [Blot | null, number];
  descendant(criteria: any, index: number): [Blot | null, number] {
    let [child, offset] = this.children.find(index);
    if (
      (criteria.blotName == null && criteria(child)) ||
      (criteria.blotName != null && child instanceof criteria)
    ) {
      return [<any>child, offset];
    } else if (child instanceof ContainerBlot) {
      return child.descendant(criteria, offset);
    } else {
      return [null, -1];
    }
  }

  descendants(criteria: { new (): Blot }, index: number, length: number): Blot[];
  descendants(criteria: (blot: Blot) => boolean, index: number, length: number): Blot[];
  descendants(criteria: any, index: number = 0, length: number = Number.MAX_VALUE): Blot[] {
    let descendants: Blot[] = [];
    let lengthLeft = length;
    this.children.forEachAt(index, length, function(child: Blot, index: number, length: number) {
      if (
        (criteria.blotName == null && criteria(child)) ||
        (criteria.blotName != null && child instanceof criteria)
      ) {
        descendants.push(child);
      }
      if (child instanceof ContainerBlot) {
        descendants = descendants.concat(child.descendants(criteria, index, lengthLeft));
      }
      lengthLeft -= length;
    });
    return descendants;
  }

  detach(): void {
    this.children.forEach(function(child) {
      child.detach();
    });
    super.detach();
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.children.forEachAt(index, length, function(child, offset, length) {
      child.formatAt(offset, length, name, value);
    });
  }

  insertAt(index: number, value: string, def?: any): void {
    let [child, offset] = this.children.find(index);
    if (child) {
      child.insertAt(offset, value, def);
    } else {
      let blot = def == null ? Registry.create('text', value) : Registry.create(value, def);
      this.appendChild(blot);
    }
  }

  insertBefore(childBlot: Blot, refBlot?: Blot): void {
    if (
      this.statics.allowedChildren != null &&
      !this.statics.allowedChildren.some(function(child: Registry.BlotConstructor) {
        return childBlot instanceof child;
      })
    ) {
      throw new Registry.ParchmentError(
        `Cannot insert ${(<ShadowBlot>childBlot).statics.blotName} into ${this.statics.blotName}`,
      );
    }
    childBlot.insertInto(this, refBlot);
  }

  length(): number {
    return this.children.reduce(function(memo, child) {
      return memo + child.length();
    }, 0);
  }

  moveChildren(targetParent: Parent, refNode?: Blot): void {
    this.children.forEach(function(child) {
      targetParent.insertBefore(child, refNode);
    });
  }

  optimize(context: { [key: string]: any }) {
    super.optimize(context);
    if (this.children.length === 0) {
      if (this.statics.defaultChild != null) {
        let child = Registry.create(this.statics.defaultChild);
        this.appendChild(child);
        child.optimize(context);
      } else {
        this.remove();
      }
    }
  }

  path(index: number, inclusive: boolean = false): [Blot, number][] {
    let [child, offset] = this.children.find(index, inclusive);
    let position: [Blot, number][] = [[this, index]];
    if (child instanceof ContainerBlot) {
      return position.concat(child.path(offset, inclusive));
    } else if (child != null) {
      position.push([child, offset]);
    }
    return position;
  }

  removeChild(child: Blot): void {
    this.children.remove(child);
  }

  replace(target: Blot): void {
    if (target instanceof ContainerBlot) {
      target.moveChildren(this);
    }
    super.replace(target);
  }

  split(index: number, force: boolean = false): Blot {
    if (!force) {
      if (index === 0) return this;
      if (index === this.length()) return this.next;
    }
    let after = <ContainerBlot>this.clone();
    this.parent.insertBefore(after, this.next);
    this.children.forEachAt(index, this.length(), function(child, offset, length) {
      child = child.split(offset, force);
      after.appendChild(child);
    });
    return after;
  }

  unwrap(): void {
    this.moveChildren(this.parent, this.next);
    this.remove();
  }

  update(mutations: MutationRecord[], context: { [key: string]: any }): void {
    let addedNodes: Node[] = [];
    let removedNodes: Node[] = [];
    mutations.forEach(mutation => {
      if (mutation.target === this.domNode && mutation.type === 'childList') {
        addedNodes.push.apply(addedNodes, mutation.addedNodes);
        removedNodes.push.apply(removedNodes, mutation.removedNodes);
      }
    });
    removedNodes.forEach((node: Node) => {
      // Check node has actually been removed
      // One exception is Chrome does not immediately remove IFRAMEs
      // from DOM but MutationRecord is correct in its reported removal
      if (
        node.parentNode != null &&
        // @ts-ignore
        node.tagName !== 'IFRAME' &&
        document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY
      ) {
        return;
      }
      let blot = Registry.find(node);
      if (blot == null) return;
      if (blot.domNode.parentNode == null || blot.domNode.parentNode === this.domNode) {
        blot.detach();
      }
    });
    addedNodes
      .filter(node => {
        return node.parentNode == this.domNode;
      })
      .sort(function(a, b) {
        if (a === b) return 0;
        if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
          return 1;
        }
        return -1;
      })
      .forEach(node => {
        let refBlot: Blot | null = null;
        if (node.nextSibling != null) {
          refBlot = Registry.find(node.nextSibling);
        }
        let blot = makeBlot(node);
        if (blot.next != refBlot || blot.next == null) {
          if (blot.parent != null) {
            blot.parent.removeChild(this);
          }
          this.insertBefore(blot, refBlot || undefined);
        }
      });
  }
}

function makeBlot(node: Node): Blot {
  let blot = Registry.find(node);
  if (blot == null) {
    try {
      blot = Registry.create(node);
    } catch (e) {
      blot = Registry.create(Registry.Scope.INLINE);
      [].slice.call(node.childNodes).forEach(function(child: Node) {
        // @ts-ignore
        blot.domNode.appendChild(child);
      });
      if (node.parentNode) {
        node.parentNode.replaceChild(blot.domNode, node);
      }
      blot.attach();
    }
  }
  return blot;
}

export default ContainerBlot;
