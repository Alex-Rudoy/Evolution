const HtmlWebpackPlugin = require("html-webpack-plugin"); // Require  html-webpack-plugin plugin
const copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: __dirname + "/app/index.ts", // webpack entry point. Module to start building dependency graph
  output: {
    path: __dirname + "/dist", // Folder to store generated bundle
    filename: "bundle.js", // Name of generated bundle after build
    publicPath: "/", // public URL of the output directory when referenced in a browser
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  module: {
    // where we defined file patterns and their loaders
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: "ts-loader",
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
          },
        ],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "img/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Array of plugins to apply to build chunk
    new HtmlWebpackPlugin({
      template: __dirname + "/app/index.html",
      inject: "body",
    }),
    new copyWebpackPlugin({
      patterns: [
        {
          from: "app/img",
          to: "img",
        },
      ],
    }),
  ],
  devServer: {
    // configuration for webpack-dev-server
    contentBase: "./app", //source of static assets
    port: 3000, // port to run dev-server
  },
};
