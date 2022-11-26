import FormatBlot from './abstract/format';
import * as Registry from '../registry';

class BlockBlot extends FormatBlot {
  static blotName = 'block';
  static scope = Registry.Scope.BLOCK_BLOT;
  static tagName = 'P';

  static formats(domNode: HTMLElement): any {
    let tagName = (<any>Registry.query(BlockBlot.blotName)).tagName;
    if (domNode.tagName === tagName) return undefined;
    return super.formats(domNode);
  }

  format(name: string, value: any) {
    if (Registry.query(name, Registry.Scope.BLOCK) == null) {
      return;
    } else if (name === this.statics.blotName && !value) {
      this.replaceWith(BlockBlot.blotName);
    } else {
      super.format(name, value);
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (Registry.query(name, Registry.Scope.BLOCK) != null) {
      this.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  insertAt(index: number, value: string, def?: any): void {
    if (def == null || Registry.query(value, Registry.Scope.INLINE) != null) {
      // Insert text or inline
      super.insertAt(index, value, def);
    } else {
      let after = this.split(index);
      let blot = Registry.create(value, def);
      after.parent.insertBefore(blot, after);
    }
  }

  update(mutations: MutationRecord[], context: { [key: string]: any }): void {
    if (navigator.userAgent.match(/Trident/)) {
      this.build();
    } else {
      super.update(mutations, context);
    }
  }
}

export default BlockBlot;
