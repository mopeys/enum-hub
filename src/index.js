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
    // console.log(this);
    if (!name) throw new Error("[EnumHub]: getEnum需要传入name参数");
    if (this[enums][name]) {
      return this[enums][name];
    } else {
      await this[runFetchRemote](name, fetchRemote);
      return this[enums][name];
    }
  }

  // 私有执行fetchRemote函数并缓存枚举结果
  async [runFetchRemote](name, fetchRemote) {
    const f = fetchRemote || this.fetchRemote;
    this[check](f);
    // 阻止重复请求
    if (!this.fetchingNames[name]) {
      this.fetchingNames[name] = [];
    } else {
      let rsv = null;
      const p = new Promise((resolve) => (rsv = resolve));
      this.fetchingNames[name].push(rsv);
      return await p;
    }
    try {
      const en = await f(name);
      this[enums][name] = en;
      this.fetchingNames[name].forEach((rsv) => rsv());
      this.fetchingNames[name] = null;
    } catch (error) {
      this[enums][name] = [];
      console.error(`[EnumHub] - ${name}: ${error}`);
      // Q: 失败后是否需要触发所有的promise reject
      // throw new Eerror(`[EnumHub]: ${error}`);
    }
  }
}

// Example
// import * as service from 'src/components/page/claimInvestigation/service';
// export const eh = new EnumHub({
//     fetchRemote: async name => {
//         return await fetch(`/api/enum/${name}`);
//     },
// });
// await eh.getEnum('XX');
