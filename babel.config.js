const config =
  process.env.NODE_ENV === "test"
    ? {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: { node: "current" },
            },
          ],
        ],
      }
    : {
        presets: [
          [
            "@babel/preset-env",
            {
              debug: process.env.NODE_ENV === "development",
              shippedProposals: true,
            },
          ],
        ],
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            {
              corejs: 3,
            },
          ],
        ],
        // exclude: ["./_test_/**"],
      };

module.exports = config;
