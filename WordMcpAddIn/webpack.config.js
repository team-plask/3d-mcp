// webpack.config.js
const path = require("path");
const devCerts = require("office-addin-dev-certs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const findFreePort = require("find-free-port");

const urlProd = "https://localhost:3001"; // 배포용 URL

async function getHttpsOptions() {
  return await devCerts.getHttpsServerOptions();
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";

  // 1. 동적으로 사용 가능한 포트 찾기
  const [actualPort] = await findFreePort(3000, 3100);
  const urlDev = `https://localhost:${actualPort}/`;

  console.log(`✅ Using dev server on ${urlDev}`);

  return {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      taskpane: ["./src/taskpane/index.ts", "./src/taskpane/taskpane.html"],
      commands: "./src/commands/commands.ts"
    },    
    output: { clean: true },
    resolve: { extensions: [".ts", ".js", ".html"]},
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"]
            }
          }
        },
        {
          test: /\.html$/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "taskpane"],
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "commands"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "assets/*", to: "assets/[name][ext]" },
          {
            from: "manifest*.xml",
            to: "[name][ext]",
            transform(content) {
              return dev
                ? content.toString().replace(/https:\/\/localhost:\d+\//g, urlDev)
                : content.toString().replace(/https:\/\/localhost:\d+\//g, urlProd);
            },
          },
        ],
      }),
    ],
    devServer: {
      port: actualPort,
      headers: { "Access-Control-Allow-Origin": "*" },
      server: {
        type: "https",
        options: await getHttpsOptions(),
      },
    },
  };
};
