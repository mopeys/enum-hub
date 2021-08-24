import LRUCache from './LRUCache';

const enums = Symbol('enums');
const check = Symbol('check');
const runFetchRemote = Symbol('runFetchRemote');

const createProxy = (obj) => {
  return new Proxy(obj, {
    get(target, property) {
      return target.get(property);
    },
    set(target, property, value) {
      target.set(property, value);
      return true;
    },
  });
};
/**
 * 获取枚举集合，若本地没有，则从远程获取并缓存
 */
export default class EnumHub {
  // 收集正在请求中的name
  fetchingNames = {};

  constructor({
    fetchRemote = null, // 获取枚举的远程请求函数
    max, // 缓存最大个数
  } = {}) {
    // 私有枚举集合
    this[enums] = Number(max)
      ? createProxy(new LRUCache(max))
      : Object.create(null);
    this[check](fetchRemote);
    this.fetchRemote = fetchRemote;
  }
  // 私有检查
  [check](fetchRemote) {
    if (!fetchRemote || typeof fetchRemote !== 'function') {
      throw new Error('[EnumHub]: fetchRemote应当为获取枚举的远程请求函数');
    }
  }
  // 获取枚举
  async getEnum(name, fetchRemote) {
    if (!name) throw new Error('[EnumHub]: getEnum需要传入name参数');
    const en = this[enums][name];
    if (!en) {
      return await this[runFetchRemote](name, fetchRemote);
    }
    return en;
  }

  // 私有执行fetchRemote函数并缓存枚举结果
  async [runFetchRemote](name, fetchRemote) {
    const f = fetchRemote || this.fetchRemote;
    this[check](f);
    // 阻止重复请求
    if (!this.fetchingNames[name]) {
      this.fetchingNames[name] = [];
    } else {
      return new Promise((rsv, rej) =>
        this.fetchingNames[name].push({ rsv, rej })
      );
    }
    try {
      const en = await f(name);
      this.fetchingNames[name].forEach(({ rsv }) => rsv(en));
      return (this[enums][name] = en);
    } catch (error) {
      this.fetchingNames[name].forEach(({ rej }) => rej(error));
      this[enums][name] = null;
      throw new Error(`[EnumHub] - ${name}: ${error}`);
    } finally {
      this.fetchingNames[name] = null;
    }
  }
}
