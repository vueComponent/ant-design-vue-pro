import LinkedNode from './linked-node';

class LinkedList<T extends LinkedNode> {
  head: T | null;
  tail: T | null;
  length: number;

  constructor() {
    this.head = this.tail = null;
    this.length = 0;
  }

  append(...nodes: T[]): void {
    this.insertBefore(nodes[0], null);
    if (nodes.length > 1) {
      this.append.apply(this, nodes.slice(1));
    }
  }

  contains(node: T): boolean {
    let cur,
      next = this.iterator();
    while ((cur = next())) {
      if (cur === node) return true;
    }
    return false;
  }

  insertBefore(node: T | null, refNode: T | null): void {
    if (!node) return
    node.next = refNode;
    if (refNode != null) {
      node.prev = refNode.prev;
      if (refNode.prev != null) {
        refNode.prev.next = node;
      }
      refNode.prev = node;
      if (refNode === this.head) {
        this.head = node;
      }
    } else if (this.tail != null) {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    } else {
      node.prev = null;
      this.head = this.tail = node;
    }
    this.length += 1;
  }

  offset(target: T): number {
    let index = 0,
      cur = this.head;
    while (cur != null) {
      if (cur === target) return index;
      index += cur.length();
      cur = <T>cur.next;
    }
    return -1;
  }

  remove(node: T): void {
    if (!this.contains(node)) return;
    if (node.prev != null) node.prev.next = node.next;
    if (node.next != null) node.next.prev = node.prev;
    if (node === this.head) this.head = <T>node.next;
    if (node === this.tail) this.tail = <T>node.prev;
    this.length -= 1;
  }

  iterator(curNode: T | null = this.head): () => T | null {
    // TODO use yield when we can
    return function(): T | null {
      let ret = curNode;
      if (curNode != null) curNode = <T>curNode.next;
      return ret;
    };
  }

  find(index: number, inclusive: boolean = false): [T | null, number] {
    let cur,
      next = this.iterator();
    while ((cur = next())) {
      let length = cur.length();
      if (
        index < length ||
        (inclusive && index === length && (cur.next == null || cur.next.length() !== 0))
      ) {
        return [cur, index];
      }
      index -= length;
    }
    return [null, 0];
  }

  forEach(callback: (cur: T) => void): void {
    let cur,
      next = this.iterator();
    while ((cur = next())) {
      callback(cur);
    }
  }

  forEachAt(
    index: number,
    length: number,
    callback: (cur: T, offset: number, length: number) => void,
  ): void {
    if (length <= 0) return;
    let [startNode, offset] = this.find(index);
    let cur,
      curIndex = index - offset,
      next = this.iterator(startNode);
    while ((cur = next()) && curIndex < index + length) {
      let curLength = cur.length();
      if (index > curIndex) {
        callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
      } else {
        callback(cur, 0, Math.min(curLength, index + length - curIndex));
      }
      curIndex += curLength;
    }
  }

  map(callback: (cur: T | null) => any): any[] {
    return this.reduce(function(memo: (T | null)[], cur: T | null) {
      memo.push(callback(cur));
      return memo;
    }, []);
  }

  reduce<M>(callback: (memo: M, cur: T) => M, memo: M): M {
    let cur,
      next = this.iterator();
    while ((cur = next())) {
      memo = callback(memo, cur);
    }
    return memo;
  }
}

export default LinkedList;
