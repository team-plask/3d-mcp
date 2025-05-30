// webpack.config.js
const path = require("path");
const devCerts = require("office-addin-dev-certs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const findFreePort = require("find-free-port");

const urlProd = "https://www.oppice.com/"; // 배포용 URL

async function getHttpsOptions() {
  return await devCerts.getHttpsServerOptions();
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";

  // 1. 동적으로 사용 가능한 포트 찾기
  const [actualPort] = await findFreePort(3000, 3100);
  const urlDev = `https://localhost:${actualPort}/`;

  console.log(`✅ Using dev server on ${urlDev}`);

  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      taskpane: ["./src/taskpane/taskpane.ts", "./src/taskpane/taskpane.html"],
      commands: "./src/commands/commands.ts"
    },
    output: { 
      clean: true, 
      publicPath: "/",
      filename: "[name].[contenthash].js"
    },
    resolve: {
      extensions: [".ts", ".js", ".html", ".css"],
      fallback: {
        "stream": require.resolve("stream-browserify"),
        "url": require.resolve("url/"),
        "fs": false, // 브라우저 런타임에선 fs 사용 불가
        // 필요에 따라 다른 Node.js 핵심 모듈도 여기에 추가할 수 있습니다.
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
          test: /\.css$/,
          use: [
            'style-loader',  // Injects CSS into the DOM
            'css-loader'     // Interprets @import and url() like import/require()
          ]
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
              let newContent = content.toString();

              // AppDomain 등에서 사용될 URL (슬래시 없이)
              const appDomainTargetUrl = dev ? urlDev.slice(0, -1) : (urlProd.endsWith('/') ? urlProd.slice(0, -1) : urlProd);
              // 리소스 경로 등에서 사용될 URL (슬래시 포함)
              const resourceTargetUrl = dev ? urlDev : (urlProd.endsWith('/') ? urlProd : urlProd + '/');

              // 정규식1: 슬래시가 없는 localhost URL (주로 AppDomain 용도)
              // 예: https://localhost:3000 (뒤에 일반적인 경로 문자가 오지 않는 경우)
              const appDomainRegex = /https:\/\/localhost:\d+(?![\w\/.-])/g;

              // 정규식2: 슬래시가 있는 localhost URL (주로 리소스 경로 용도)
              // 예: https://localhost:3000/
              const resourceRegex = /https:\/\/localhost:\d+\//g;

              // AppDomain URL 교체
              newContent = newContent.replace(appDomainRegex, appDomainTargetUrl);
              // 리소스 URL 교체
              newContent = newContent.replace(resourceRegex, resourceTargetUrl);
              
              return newContent;
            },
          },
        ],
      }),
    ],
    devServer: {
      port: actualPort,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      },
      server: {
        type: 'https',
        options: await getHttpsOptions(), // SSL 인증서 설정
      },
    }
  };

  return config;
};