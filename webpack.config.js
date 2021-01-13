/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => ({
  devtool: argv.mode === 'production' ? 'source-map' : 'inline-source-map',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          experimentalWatchApi: true,
          transpileOnly: true,
        },
      },
      {
        test: /\.(s*)css$/,
        use: [
          argv.mode === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    minimizer:
      argv.mode === 'production'
        ? [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})]
        : [],
  },
  plugins: [
    new CleanWebpackPlugin({}),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      useTypescriptIncrementalApi: true,
      measureCompilationTime: true,
      memoryLimit: 4096,
    }),
    new ForkTsCheckerNotifierWebpackPlugin({ excludeWarnings: true }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, './src/templates/index.html'),
      title: 'TS React Boilerplate',
    }),
    new MiniCssExtractPlugin({
      filename: argv.mode === 'production' ? '[name].[hash].css' : '[name].css',
      chunkFilename:
        argv.mode === 'production' ? '[id].[hash].css' : '[id].css',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
});
