import { Blot } from './abstract/blot';
import ContainerBlot from './abstract/container';
import LinkedList from '../collection/linked-list';
import * as Registry from '../registry';

const OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true,
};

const MAX_OPTIMIZE_ITERATIONS = 100;

class ScrollBlot extends ContainerBlot {
  static blotName = 'scroll';
  static defaultChild = 'block';
  static scope = Registry.Scope.BLOCK_BLOT;
  static tagName = 'DIV';

  observer: MutationObserver;

  constructor(node: HTMLDivElement) {
    super(node);
    this.scroll = this;
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      this.update(mutations);
    });
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
    this.attach();
  }

  detach() {
    super.detach();
    this.observer.disconnect();
  }

  deleteAt(index: number, length: number): void {
    this.update();
    if (index === 0 && length === this.length()) {
      this.children.forEach(function(child) {
        child.remove();
      });
    } else {
      super.deleteAt(index, length);
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.update();
    super.formatAt(index, length, name, value);
  }

  insertAt(index: number, value: string, def?: any): void {
    this.update();
    super.insertAt(index, value, def);
  }

  optimize(context: { [key: string]: any }): void;
  optimize(mutations: MutationRecord[], context: { [key: string]: any }): void;
  optimize(mutations: any = [], context: any = {}): void {
    super.optimize(context);
    // We must modify mutations directly, cannot make copy and then modify
    let records = [].slice.call(this.observer.takeRecords());
    // Array.push currently seems to be implemented by a non-tail recursive function
    // so we cannot just mutations.push.apply(mutations, this.observer.takeRecords());
    while (records.length > 0) mutations.push(records.pop());
    // TODO use WeakMap
    let mark = (blot: Blot | null, markParent: boolean = true) => {
      if (blot == null || blot === this) return;
      if (blot.domNode.parentNode == null) return;
      // @ts-ignore
      if (blot.domNode[Registry.DATA_KEY].mutations == null) {
        // @ts-ignore
        blot.domNode[Registry.DATA_KEY].mutations = [];
      }
      if (markParent) mark(blot.parent);
    };
    let optimize = function(blot: Blot) {
      // Post-order traversal
      if (
        // @ts-ignore
        blot.domNode[Registry.DATA_KEY] == null ||
        // @ts-ignore
        blot.domNode[Registry.DATA_KEY].mutations == null
      ) {
        return;
      }
      if (blot instanceof ContainerBlot) {
        blot.children.forEach(optimize);
      }
      blot.optimize(context);
    };
    let remaining = mutations;
    for (let i = 0; remaining.length > 0; i += 1) {
      if (i >= MAX_OPTIMIZE_ITERATIONS) {
        throw new Error('[Parchment] Maximum optimize iterations reached');
      }
      remaining.forEach(function(mutation: MutationRecord) {
        let blot = Registry.find(mutation.target, true);
        if (blot == null) return;
        if (blot.domNode === mutation.target) {
          if (mutation.type === 'childList') {
            mark(Registry.find(mutation.previousSibling, false));
            [].forEach.call(mutation.addedNodes, function(node: Node) {
              let child = Registry.find(node, false);
              mark(child, false);
              if (child instanceof ContainerBlot) {
                child.children.forEach(function(grandChild: Blot) {
                  mark(grandChild, false);
                });
              }
            });
          } else if (mutation.type === 'attributes') {
            mark(blot.prev);
          }
        }
        mark(blot);
      });
      this.children.forEach(optimize);
      remaining = [].slice.call(this.observer.takeRecords());
      records = remaining.slice();
      while (records.length > 0) mutations.push(records.pop());
    }
  }

  update(mutations?: MutationRecord[], context: { [key: string]: any } = {}): void {
    mutations = mutations || this.observer.takeRecords();
    // TODO use WeakMap
    mutations
      .map(function(mutation: MutationRecord) {
        let blot = Registry.find(mutation.target, true);
        if (blot == null) return null;
        // @ts-ignore
        if (blot.domNode[Registry.DATA_KEY].mutations == null) {
          // @ts-ignore
          blot.domNode[Registry.DATA_KEY].mutations = [mutation];
          return blot;
        } else {
          // @ts-ignore
          blot.domNode[Registry.DATA_KEY].mutations.push(mutation);
          return null;
        }
      })
      .forEach((blot: Blot | null) => {
        if (
          blot == null ||
          blot === this ||
          //@ts-ignore
          blot.domNode[Registry.DATA_KEY] == null
        )
          return;
        // @ts-ignore
        blot.update(blot.domNode[Registry.DATA_KEY].mutations || [], context);
      });
    // @ts-ignore
    if (this.domNode[Registry.DATA_KEY].mutations != null) {
      // @ts-ignore
      super.update(this.domNode[Registry.DATA_KEY].mutations, context);
    }
    this.optimize(mutations, context);
  }
}

export default ScrollBlot;
