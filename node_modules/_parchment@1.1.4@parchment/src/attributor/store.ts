import Attributor from './attributor';
import ClassAttributor from './class';
import StyleAttributor from './style';
import { Formattable } from '../blot/abstract/blot';
import * as Registry from '../registry';

class AttributorStore {
  private attributes: { [key: string]: Attributor } = {};
  private domNode: HTMLElement;

  constructor(domNode: HTMLElement) {
    this.domNode = domNode;
    this.build();
  }

  attribute(attribute: Attributor, value: any): void {
    // verb
    if (value) {
      if (attribute.add(this.domNode, value)) {
        if (attribute.value(this.domNode) != null) {
          this.attributes[attribute.attrName] = attribute;
        } else {
          delete this.attributes[attribute.attrName];
        }
      }
    } else {
      attribute.remove(this.domNode);
      delete this.attributes[attribute.attrName];
    }
  }

  build(): void {
    this.attributes = {};
    let attributes = Attributor.keys(this.domNode);
    let classes = ClassAttributor.keys(this.domNode);
    let styles = StyleAttributor.keys(this.domNode);
    attributes
      .concat(classes)
      .concat(styles)
      .forEach(name => {
        let attr = Registry.query(name, Registry.Scope.ATTRIBUTE);
        if (attr instanceof Attributor) {
          this.attributes[attr.attrName] = attr;
        }
      });
  }

  copy(target: Formattable): void {
    Object.keys(this.attributes).forEach(key => {
      let value = this.attributes[key].value(this.domNode);
      target.format(key, value);
    });
  }

  move(target: Formattable): void {
    this.copy(target);
    Object.keys(this.attributes).forEach(key => {
      this.attributes[key].remove(this.domNode);
    });
    this.attributes = {};
  }

  values(): { [key: string]: any } {
    return Object.keys(
      this.attributes,
    ).reduce((attributes: { [key: string]: any }, name: string) => {
      attributes[name] = this.attributes[name].value(this.domNode);
      return attributes;
    }, {});
  }
}

export default AttributorStore;
