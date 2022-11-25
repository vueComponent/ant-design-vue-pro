import Attributor from './attributor';

function match(node: HTMLElement, prefix: string): string[] {
  let className = node.getAttribute('class') || '';
  return className.split(/\s+/).filter(function(name) {
    return name.indexOf(`${prefix}-`) === 0;
  });
}

class ClassAttributor extends Attributor {
  static keys(node: HTMLElement): string[] {
    return (node.getAttribute('class') || '').split(/\s+/).map(function(name) {
      return name
        .split('-')
        .slice(0, -1)
        .join('-');
    });
  }

  add(node: HTMLElement, value: string): boolean {
    if (!this.canAdd(node, value)) return false;
    this.remove(node);
    node.classList.add(`${this.keyName}-${value}`);
    return true;
  }

  remove(node: HTMLElement): void {
    let matches = match(node, this.keyName);
    matches.forEach(function(name) {
      node.classList.remove(name);
    });
    if (node.classList.length === 0) {
      node.removeAttribute('class');
    }
  }

  value(node: HTMLElement): string {
    let result = match(node, this.keyName)[0] || '';
    let value = result.slice(this.keyName.length + 1); // +1 for hyphen
    return this.canAdd(node, value) ? value : '';
  }
}

export default ClassAttributor;
