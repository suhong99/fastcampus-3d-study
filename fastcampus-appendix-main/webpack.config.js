const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const webpackMode = process.env.NODE_ENV || 'development';

const entryAndHtmlConfig = [
  { name: 'example01', htmlTemplate: './src/example01/index.html' },
  { name: 'example02', htmlTemplate: './src/example02/index.html' },
  { name: 'example03', htmlTemplate: './src/example03/index.html' },
  { name: 'example04', htmlTemplate: './src/example04/index.html' },
  { name: 'example05', htmlTemplate: './src/example05/index.html' },
  { name: 'example06', htmlTemplate: './src/example06/index.html' },
];

const pluginHtml = entryAndHtmlConfig.map(config => {
  return new HtmlWebpackPlugin({
    template: config.htmlTemplate,
    filename: `${config.name}.html`,
    chunks: [config.name]
  });
});

module.exports = {
  mode: webpackMode,
  entry: {
    example01: './src/script/example01.js',
    example02: './src/script/example02.js',
    example03: './src/script/example03.js',
    example04: './src/script/example04.js',
    example05: './src/script/example05.js',
    example06: './src/script/example06.js',
  },
  output: {
    filename: 'script/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ],
  },
  devServer: {
    port: 8080,
  },
  plugins: [
    ...pluginHtml, 
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: [],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/assets', to: 'assets'},
        { from: './src/css', to: 'css' }
      ]
    })
  ],
  // optimization: {
  //   minimize: false
  // },
};