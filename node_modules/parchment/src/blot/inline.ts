import FormatBlot from './abstract/format';
import LeafBlot from './abstract/leaf';
import ShadowBlot from './abstract/shadow';
import * as Registry from '../registry';

// Shallow object comparison
function isEqual(obj1: Object, obj2: Object): boolean {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  // @ts-ignore
  for (let prop in obj1) {
    // @ts-ignore
    if (obj1[prop] !== obj2[prop]) return false;
  }
  return true;
}

class InlineBlot extends FormatBlot {
  static blotName = 'inline';
  static scope = Registry.Scope.INLINE_BLOT;
  static tagName = 'SPAN';

  static formats(domNode: HTMLElement): any {
    if (domNode.tagName === InlineBlot.tagName) return undefined;
    return super.formats(domNode);
  }

  format(name: string, value: any) {
    if (name === this.statics.blotName && !value) {
      this.children.forEach(child => {
        if (!(child instanceof FormatBlot)) {
          child = child.wrap(InlineBlot.blotName, true);
        }
        this.attributes.copy(<FormatBlot>child);
      });
      this.unwrap();
    } else {
      super.format(name, value);
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (this.formats()[name] != null || Registry.query(name, Registry.Scope.ATTRIBUTE)) {
      let blot = <InlineBlot>this.isolate(index, length);
      blot.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  optimize(context: { [key: string]: any }): void {
    super.optimize(context);
    let formats = this.formats();
    if (Object.keys(formats).length === 0) {
      return this.unwrap(); // unformatted span
    }
    let next = this.next;
    if (next instanceof InlineBlot && next.prev === this && isEqual(formats, next.formats())) {
      next.moveChildren(this);
      next.remove();
    }
  }
}

export default InlineBlot;
