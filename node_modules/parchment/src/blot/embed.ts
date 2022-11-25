import { Formattable } from './abstract/blot';
import LeafBlot from './abstract/leaf';

class EmbedBlot extends LeafBlot implements Formattable {
  static formats(domNode: HTMLElement): any {
    return undefined;
  }

  format(name: string, value: any): void {
    // super.formatAt wraps, which is what we want in general,
    // but this allows subclasses to overwrite for formats
    // that just apply to particular embeds
    super.formatAt(0, this.length(), name, value);
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (index === 0 && length === this.length()) {
      this.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  formats(): { [index: string]: any } {
    return this.statics.formats(this.domNode);
  }
}

export default EmbedBlot;
