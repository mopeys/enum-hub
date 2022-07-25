class LinkedNode {
  constructor(payload) {
    this.next = null;
    this.previous = null;
    this.payload = payload;
  }
}

export default class LRUCache {
  constructor(size) {
    this.max = typeof size === 'number' ? Number(size) : Number.MAX_SAFE_INTEGER;
    this.nodes = Object.create(null);
    this.head = new LinkedNode();
    this.tail = new LinkedNode();
    this.head.next = this.tail;
    this.tail.previous = this.head;
  }

  get(key) {
    const node = this.nodes[key];
    if (!node) return;
    this.moveToTop(node);
    return node.payload.data;
  }

  set(key, data) {
    const node = this.nodes[key];
    if (node) {
      return this.moveToTop(node);
    }
    const newNode = new LinkedNode({ key, data });
    this.pushToTop(newNode);
  }

  pushToTop(node) {
    const l = Reflect.ownKeys(this.nodes).length;
    if (l >= this.max) {
      this.delete(this.tail.previous);
    }
    this.nodes[node.payload.key] = node;
    this.head.next.previous = node;
    node.next = this.head.next;
    this.head.next = node;
    node.previous = this.head;
  }
  moveToTop(node) {
    this.delete(node);
    this.pushToTop(node);
  }

  delete(node) {
    node.previous.next = node.next;
    node.next.previous = node.previous;
    this.destory(node);
  }
  destory(node) {
    node.previous = null;
    node.next = null;
    delete this.nodes[node.payload.key];
  }
}
