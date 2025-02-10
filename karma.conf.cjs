const path = require("path");
const webpack = require("webpack");

const output = {
  path: path.join(__dirname, "dist"),
};

module.exports = function (config) {
  config.set({
    frameworks: ["webpack", "mocha"],
    preprocessors: {
      "**/*.ts": ["webpack"],
    },
    files: [
      "src/**/*.spec.ts",
      "src/**/*.ts",
      {
        pattern: `${output.path}/**/*`,
        watched: false,
        included: false,
        served: true,
      },
    ],
    envPreprocessor: ["CI"],
    reporters: ["progress"],
    browsers: ["ChromeHeadless"],
    pingTimeout: 300000,
    browserDisconnectTimeout: 300000,
    browserNoActivityTimeout: 300000,
    singleRun: true,
    client: {
      mocha: {
        timeout: 300000, // Default is 2s
      },
    },
    webpack: {
      output,
      mode: "production",
      module: {
        rules: [
          {
            test: /\.wasm$/,
            type: "asset/resource",
          },
          {
            test: /\.(js|tsx?)$/,
            loader: "ts-loader",
            exclude: /node_modules|\.d\.ts$/,
            options: { configFile: "tsconfig.karma.json" },
          },
          {
            test: /\.d\.ts$/,
            loader: "ignore-loader",
          },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.env.CI": process.env.CI || false,
          "process.env.DISPLAY": "Browser",
        }),
        new webpack.ProvidePlugin({
          process: "process/browser.js"
        })
      ],
      resolve: {
        extensions: [".ts", ".tsx", ".js"],
        extensionAlias: {
          ".js": [".js", ".ts"],
          ".cjs": [".cjs", ".cts"],
          ".mjs": [".mjs", ".mts"]
        }
      },
      stats: { warnings: false },
      devtool: "inline-source-map"
    },
  });
};
