const enums = Symbol("enums");
const check = Symbol("check");
const runFetchRemote = Symbol("runFetchRemote");

/**
 * 获取枚举集合，若本地没有，则从远程获取并缓存
 */
export default class EnumHub {
  // 收集正在请求中的name
  fetchingNames = {};
  // 私有枚举集合
  [enums] = {};

  constructor({
    fetchRemote = null, // 获取枚举的远程请求函数
  } = {}) {
    this[check](fetchRemote);
    this.fetchRemote = fetchRemote;
  }
  // 私有检查
  [check](fetchRemote) {
    if (!fetchRemote || typeof fetchRemote !== "function") {
      throw new Error("[EnumHub]: fetchRemote应当为获取枚举的远程请求函数");
    }
  }
  // 获取枚举
  async getEnum(name, fetchRemote) {
    if (!name) throw new Error("[EnumHub]: getEnum需要传入name参数");
    if (!this[enums][name]) {
      return await this[runFetchRemote](name, fetchRemote);
    }
    return this[enums][name];
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
      throw new Eerror(`[EnumHub] - ${name}: ${error}`);
    } finally {
      this.fetchingNames[name] = null;
    }
  }
}

// async function s() {
//   const a = await 222;
//   const b = await Promise.resolve(2);
//   const d = Promise.resolve(2);
//   const c = await new Promise((res, rej) => {
//     setTimeout(res, 2000);
//   });
//   return a && b && c && d;
// }
// s();
