import EnumHub from "../src";

// const eh = new EnumHub({
//   fetchRemote: async (name) => {
//     // return await fetch(`/api/enum/${name}`);
//     return await [{ k: "k", v: "v" }];
//   },
// });

// async function main() {
//   await eh.getEnum("MEDICAL_TYPE"); // first time, from remote
//   await eh.getEnum("MEDICAL_TYPE"); // from local
// }
// main();

describe("enum hub", () => {
  // 先实例
  // 连续发起2个调用，只发起一次请求
  // 数据来源于mock远程
  // 数据来源于mock本地

  test("should throw an error if called without arguments", () => {
    expect(() => {
      const eh = new EnumHub();
    }).toThrow();
  });
});
