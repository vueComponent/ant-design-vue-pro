# Parchment [![Build Status](https://travis-ci.org/quilljs/parchment.svg?branch=master)](http://travis-ci.org/quilljs/parchment) [![Coverage Status](https://coveralls.io/repos/github/quilljs/parchment/badge.svg?branch=master)](https://coveralls.io/github/quilljs/parchment?branch=master)

Parchment is [Quill](https://quilljs.com)'s document model. It is a parallel tree structure to the DOM tree, and provides functionality useful for content editors, like Quill. A Parchment tree is made up of [Blots](#blots), which mirror a DOM node counterpart. Blots can provide structure, formatting, and/or content. [Attributors](#attributors) can also provide lightweight formatting information.

**Note:** You should never instantiate a Blot yourself with `new`. This may prevent necessary lifecycle functionality of a Blot. Use the [Registry](#registry)'s `create()` method instead.

`npm install --save parchment`

See [Cloning Medium with Parchment](https://quilljs.com/guides/cloning-medium-with-parchment/) for a guide on how Quill uses Parchment its document model.

## Blots

Blots are the basic building blocks of a Parchment document. Several basic implementations such as [Block](#block-blot), [Inline](#inline-blot), and [Embed](#embed-blot) are provided. In general you will want to extend one of these, instead of building from scratch. After implementation, blots need to be [registered](#registry) before usage.

At the very minimum a Blot must be named with a static `blotName` and associated with either a `tagName` or `className`. If a Blot is defined with both a tag and class, the class takes precedence, but the tag may be used as a fallback. Blots must also have a [scope](#registry), which determine if it is inline or block.

```typescript
class Blot {
  static blotName: string;
  static className: string;
  static tagName: string;
  static scope: Scope;

  domNode: Node;
  prev: Blot;
  next: Blot;
  parent: Blot;

  // Creates corresponding DOM node
  static create(value?: any): Node;

  constructor(domNode: Node, value?: any);

  // For leaves, length of blot's value()
  // For parents, sum of children's values
  length(): Number;

  // Manipulate at given index and length, if applicable.
  // Will often pass call onto appropriate child.
  deleteAt(index: number, length: number);
  formatAt(index: number, length: number, format: string, value: any);
  insertAt(index: number, text: string);
  insertAt(index: number, embed: string, value: any);

  // Returns offset between this blot and an ancestor's
  offset(ancestor: Blot = this.parent): number;

  // Called after update cycle completes. Cannot change the value or length
  // of the document, and any DOM operation must reduce complexity of the DOM
  // tree. A shared context object is passed through all blots.
  optimize(context: {[key: string]: any}): void;

  // Called when blot changes, with the mutation records of its change.
  // Internal records of the blot values can be updated, and modifcations of
  // the blot itself is permitted. Can be trigger from user change or API call.
  // A shared context object is passed through all blots.
  update(mutations: MutationRecord[], context: {[key: string]: any});


  /** Leaf Blots only **/

  // Returns the value represented by domNode if it is this Blot's type
  // No checking that domNode can represent this Blot type is required so
  // applications needing it should check externally before calling.
  static value(domNode): any;

  // Given location represented by node and offset from DOM Selection Range,
  // return index to that location.
  index(node: Node, offset: number): number;

  // Given index to location within blot, return node and offset representing
  // that location, consumable by DOM Selection Range
  position(index: number, inclusive: boolean): [Node, number];

  // Return value represented by this blot
  // Should not change without interaction from API or
  // user change detectable by update()
  value(): any;


  /** Parent blots only **/

  // Whitelist array of Blots that can be direct children.
  static allowedChildren: Blot[];

  // Default child blot to be inserted if this blot becomes empty.
  static defaultChild: string;

  children: LinkedList<Blot>;

  // Called during construction, should fill its own children LinkedList.
  build();

  // Useful search functions for descendant(s), should not modify
  descendant(type: BlotClass, index: number, inclusive): Blot
  descendents(type: BlotClass, index: number, length: number): Blot[];


  /** Formattable blots only **/

  // Returns format values represented by domNode if it is this Blot's type
  // No checking that domNode is this Blot's type is required.
  static formats(domNode: Node);

  // Apply format to blot. Should not pass onto child or other blot.
  format(format: name, value: any);

  // Return formats represented by blot, including from Attributors.
  formats(): Object;
}
```

### Example

Implementation for a Blot representing a link, which is a parent, inline scoped, and formattable.

```typescript
import Parchment from 'parchment';

class LinkBlot extends Parchment.Inline {
  static create(url) {
    let node = super.create();
    node.setAttribute('href', url);
    node.setAttribute('target', '_blank');
    node.setAttribute('title', node.textContent);
    return node;
  }

  static formats(domNode) {
    return domNode.getAttribute('href') || true;
  }

  format(name, value) {
    if (name === 'link' && value) {
      this.domNode.setAttribute('href', value);
    } else {
      super.format(name, value);
    }
  }

  formats() {
    let formats = super.formats();
    formats['link'] = LinkBlot.formats(this.domNode);
    return formats;
  }
}
LinkBlot.blotName = 'link';
LinkBlot.tagName = 'A';

Parchment.register(LinkBlot);
```

Quill also provides many great example implementions in its [source code](https://github.com/quilljs/quill/tree/develop/formats).

### Block Blot

Basic implementation of a block scoped formattable parent Blot. Formatting a block blot by default will replace the appropriate subsection of the blot.

### Inline Blot

Basic implementation of an inline scoped formattable parent Blot. Formatting an inline blot by default either wraps itself with another blot or passes the call to the approprate child.

### Embed Blot

Basic implementation of a non-text leaf blot, that is formattable. Its corresponding DOM node will often be a [Void Element](https://www.w3.org/TR/html5/syntax.html#void-elements), but can be a [Normal Element](https://www.w3.org/TR/html5/syntax.html#normal-elements). In these cases Parchment will not manipulate or generally be aware of the element's children, and it will be important to correctly implement the blot's `index()` and `position()` functions to correctly work with cursors/selections.

### Scroll

The root parent blot of a Parchment document. It is not formattable.


## Attributors

Attributors are the alternative, more lightweight, way to represent formats. Their DOM counterpart is an [Attribute](https://www.w3.org/TR/html5/syntax.html#attributes-0). Like a DOM attribute's relationship to a node, Attributors are meant to belong to Blots. Calling `formats()` on an [Inline](#inline-blot) or [Block](#block-blot) blot will return both the format of the corresponding DOM node represents (if any) and the formats the DOM node's attributes represent (if any).

Attributors have the following interface:

```typescript
class Attributor {
  attrName: string;
  keyName: string;
  scope: Scope;
  whitelist: string[];

  constructor(attrName: string, keyName: string, options: Object = {});
  add(node: HTMLElement, value: string): boolean;
  canAdd(node: HTMLElement, value: string): boolean;
  remove(node: HTMLElement);
  value(node: HTMLElement);
}
```

Note custom attributors are instances, rather than class definitions like Blots. Similar to Blots, instead of creating from scratch, you will probably want to use existing Attributor implementations, such as the base [Attributor](#attributor), [Class Attributor](#class-attributor) or [Style Attributor](#style-attributor).

The implementation for Attributors is surprisingly simple, and its [source code](https://github.com/quilljs/parchment/tree/master/src/attributor) may be another source of understanding.

### Attributor

Uses a plain attribute to represent formats.

```js
import Parchment from 'parchment';

let Width = new Parchment.Attributor.Attribute('width', 'width');
Parchment.register(Width);

let imageNode = document.createElement('img');

Width.add(imageNode, '10px');
console.log(imageNode.outerHTML);   // Will print <img width="10px">
Width.value(imageNode);	                // Will return 10px
Width.remove(imageNode);
console.log(imageNode.outerHTML);   // Will print <img>
```

### Class Attributor

Uses a classname pattern to represent formats.

```js
import Parchment from 'parchment';

let Align = new Parchment.Attributor.Class('align', 'blot-align');
Parchment.register(Align);

let node = document.createElement('div');
Align.add(node, 'right');
console.log(node.outerHTML);  // Will print <div class="blot-align-right"></div>
```

### Style Attributor

Uses inline styles to represent formats.

```js
import Parchment from 'parchment';

let Align = new Parchment.Attributor.Style('align', 'text-align', {
  whitelist: ['right', 'center', 'justify']   // Having no value implies left align
});
Parchment.register(Align);

let node = document.createElement('div');
Align.add(node, 'right');
console.log(node.outerHTML);  // Will print <div style="text-align: right;"></div>
```

## Registry

All methods are accessible from Parchment ex. `Parchment.create('bold')`.

```typescript
// Creates a blot given a name or DOM node.
// When given just a scope, creates blot the same name as scope
create(domNode: Node, value?: any): Blot;
create(blotName: string, value?: any): Blot;
create(scope: Scope): Blot;

// Given DOM node, find corresponding Blot.
// Bubbling is useful when searching for a Embed Blot with its corresponding
// DOM node's descendant nodes.
find(domNode: Node, bubble: boolean = false): Blot;

// Search for a Blot or Attributor
// When given just a scope, finds blot with same name as scope
query(tagName: string, scope: Scope = Scope.ANY): BlotClass;
query(blotName: string, scope: Scope = Scope.ANY): BlotClass;
query(domNode: Node, scope: Scope = Scope.ANY): BlotClass;
query(scope: Scope): BlotClass;
query(attributorName: string, scope: Scope = Scope.ANY): Attributor;

// Register Blot class definition or Attributor instance
register(BlotClass | Attributor);
```
