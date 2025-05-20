// webpack.config.js
const path = require("path");
const devCerts = require("office-addin-dev-certs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

const urlProd = "https://localhost:3001"; // 배포용 URL

async function getHttpsOptions() {
  return await devCerts.getHttpsServerOptions();
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";

  // 1. 동적으로 사용 가능한 포트 찾기
  // const [actualPort] = await findFreePort(3000, 3100);
  // const urlDev = `https://localhost:${actualPort}/`;
  const urlDev = `https://localhost:3001/`;

  console.log(`✅ Using dev server on ${urlDev}`);

  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      taskpane: ["./src/taskpane/taskpane.ts", "./src/taskpane/taskpane.html"],
      commands: "./src/commands/commands.ts"
    },
    output: { clean: true, publicPath: "/" },
    resolve: {
      extensions: [".ts", ".js", ".html"],
      fallback: {
        "stream": require.resolve("stream-browserify"),
        "url": require.resolve("url/"),
        "fs": false, // saxon-js 내부에서 fs를 사용하려 할 수 있으나, 웹 환경에서는 불필요
        // 필요에 따라 다른 Node.js 핵심 모듈도 여기에 추가할 수 있습니다.
        // 예: "path": require.resolve("path-browserify"),
        //     "os": require.resolve("os-browserify/browser")
      },
    },
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
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
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
          { from: "assets/*", to: "assets/[name][ext][query]" },
          {
            from: "src/xml-converter/normalize-runs.sef.json",
            to: "assets/normalize-runs.sef.json"
          },
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
      //port: actualPort,
      port: 3001,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      },
      server: {
        type: 'https',
        options: await getHttpsOptions(), // SSL 인증서 설정
      },    }
  };

  return config;
};
