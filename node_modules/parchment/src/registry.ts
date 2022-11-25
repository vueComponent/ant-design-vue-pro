import Attributor from './attributor/attributor';
import { Blot, Formattable } from './blot/abstract/blot';

export interface BlotConstructor {
  blotName: string;
  new (node: Node, value?: any): Blot;
  create(value?: any): Node;
}

export class ParchmentError extends Error {
  message: string;
  name: string;
  stack!: string;

  constructor(message: string) {
    message = '[Parchment] ' + message;
    super(message);
    this.message = message;
    this.name = (<any>this.constructor).name;
  }
}

let attributes: { [key: string]: Attributor } = {};
let classes: { [key: string]: BlotConstructor } = {};
let tags: { [key: string]: BlotConstructor } = {};
let types: { [key: string]: Attributor | BlotConstructor } = {};

export const DATA_KEY = '__blot';

export enum Scope {
  TYPE = (1 << 2) - 1, // 0011 Lower two bits
  LEVEL = ((1 << 2) - 1) << 2, // 1100 Higher two bits

  ATTRIBUTE = (1 << 0) | LEVEL, // 1101
  BLOT = (1 << 1) | LEVEL, // 1110
  INLINE = (1 << 2) | TYPE, // 0111
  BLOCK = (1 << 3) | TYPE, // 1011

  BLOCK_BLOT = BLOCK & BLOT, // 1010
  INLINE_BLOT = INLINE & BLOT, // 0110
  BLOCK_ATTRIBUTE = BLOCK & ATTRIBUTE, // 1001
  INLINE_ATTRIBUTE = INLINE & ATTRIBUTE, // 0101

  ANY = TYPE | LEVEL,
}

export function create(input: Node | string | Scope, value?: any): Blot {
  let match = query(input);
  if (match == null) {
    throw new ParchmentError(`Unable to create ${input} blot`);
  }
  let BlotClass = <BlotConstructor>match;
  let node =
    // @ts-ignore
    input instanceof Node || input['nodeType'] === Node.TEXT_NODE ? input : BlotClass.create(value);
  return new BlotClass(<Node>node, value);
}

export function find(node: Node | null, bubble: boolean = false): Blot | null {
  if (node == null) return null;
  // @ts-ignore
  if (node[DATA_KEY] != null) return node[DATA_KEY].blot;
  if (bubble) return find(node.parentNode, bubble);
  return null;
}

export function query(
  query: string | Node | Scope,
  scope: Scope = Scope.ANY,
): Attributor | BlotConstructor | null {
  let match;
  if (typeof query === 'string') {
    match = types[query] || attributes[query];
    // @ts-ignore
  } else if (query instanceof Text || query['nodeType'] === Node.TEXT_NODE) {
    match = types['text'];
  } else if (typeof query === 'number') {
    if (query & Scope.LEVEL & Scope.BLOCK) {
      match = types['block'];
    } else if (query & Scope.LEVEL & Scope.INLINE) {
      match = types['inline'];
    }
  } else if (query instanceof HTMLElement) {
    let names = (query.getAttribute('class') || '').split(/\s+/);
    for (let i in names) {
      match = classes[names[i]];
      if (match) break;
    }
    match = match || tags[query.tagName];
  }
  if (match == null) return null;
  // @ts-ignore
  if (scope & Scope.LEVEL & match.scope && scope & Scope.TYPE & match.scope) return match;
  return null;
}

export function register(...Definitions: any[]): any {
  if (Definitions.length > 1) {
    return Definitions.map(function(d) {
      return register(d);
    });
  }
  let Definition = Definitions[0];
  if (typeof Definition.blotName !== 'string' && typeof Definition.attrName !== 'string') {
    throw new ParchmentError('Invalid definition');
  } else if (Definition.blotName === 'abstract') {
    throw new ParchmentError('Cannot register abstract class');
  }
  types[Definition.blotName || Definition.attrName] = Definition;
  if (typeof Definition.keyName === 'string') {
    attributes[Definition.keyName] = Definition;
  } else {
    if (Definition.className != null) {
      classes[Definition.className] = Definition;
    }
    if (Definition.tagName != null) {
      if (Array.isArray(Definition.tagName)) {
        Definition.tagName = Definition.tagName.map(function(tagName: string) {
          return tagName.toUpperCase();
        });
      } else {
        Definition.tagName = Definition.tagName.toUpperCase();
      }
      let tagNames = Array.isArray(Definition.tagName) ? Definition.tagName : [Definition.tagName];
      tagNames.forEach(function(tag: string) {
        if (tags[tag] == null || Definition.className == null) {
          tags[tag] = Definition;
        }
      });
    }
  }
  return Definition;
}
