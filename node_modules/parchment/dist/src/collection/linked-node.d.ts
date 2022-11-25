interface LinkedNode {
    prev: LinkedNode | null;
    next: LinkedNode | null;
    length(): number;
}
export default LinkedNode;
