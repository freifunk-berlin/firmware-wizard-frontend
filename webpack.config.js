const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');


const extractCss = new ExtractTextPlugin('index.css');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  externals: {
    mathjax: 'MathJax',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        // upstream files that only need to be copied
        include: [path.resolve(__dirname, 'node_modules')],
        test: /\.(eot|ttf|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        query: {name: 'assets/[name].[md5:hash:hex:8].[ext]'},
      },
      {
        // upstream images
        include: [path.resolve(__dirname, 'node_modules')],
        test: /\.(jpg|png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            query: {name: 'assets/[name].[md5:hash:hex:8].[ext]'},
          },
          'image-webpack-loader',
        ],
      },
      {
        // html templates
        test: /\.html$/,
        exclude: [path.resolve(__dirname, 'src/index.html')],
        loader: 'html-loader',
        query: {
          interpolate: 'require', // allow ${require(...)} in html
        },
      },
      {
        // images that can be optimized
        exclude: [path.resolve(__dirname, 'node_modules')],
        test: /\.(jpg|png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            query: {
              context: 'src',
              name: '[path][name].[md5:hash:hex:8].[ext]'
            },
          },
          'image-webpack-loader',
        ],
      },
      {
        // less to css
        test: /\.less$/,
        loader: extractCss.extract({
          use: ['css-loader?sourceMap', 'less-loader?sourceMap'],
        }),
      },
      {
        // es6 to es5
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {loader: 'ng-annotate-loader'},
          {loader: 'babel-loader', query: {presets: ['es2015']}},
        ],
      },
    ],
  },
  plugins: [
    // TODO: require() this in translation config?
    new CopyWebpackPlugin([
      {from: {glob: 'nls/*.json'}, context: 'src', to: './'},
    ]),
    extractCss,
    new HtmlWebpackPlugin({
      template: './src/index.html',
      dev: process.env.NODE_ENV !== 'production'
    }),
  ],
  performance: {
    hints: false,
  },
};
