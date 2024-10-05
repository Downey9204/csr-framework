const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');

module.exports = (env) => {
  const isDevMode = env.mode === 'development';

  dotenv.config({ path: './.env' });

  return {
    mode: isDevMode ? 'development' : 'production',
    devtool: isDevMode ? 'inline-source-map' : false,
    entry: { main: './src/index.tsx' },
    output: {
      publicPath: '/',
      path: path.join(__dirname, 'dist'),
      filename: './static/js/[name].[contenthash:8].bundle.js',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@src': path.join(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  { targets: 'defaults', useBuiltIns: 'usage', corejs: 3 },
                ],
                ['@babel/preset-react', { runtime: 'automatic' }],
                ['@babel/preset-typescript'],
              ],
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(css|scss)$/,
          use: [
            {
              loader: isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: /\.module\.(css|scss)$/,
                  localIdentName: isDevMode
                    ? '[name]--[local]--[hash:base64:5]'
                    : '[hash:base64:8]',
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(woff(2)?|ttf|otf|eot|)$/,
          type: 'asset/inline',
        },
        {
          test: /\.(jpe?g|gif|png|svg|webp)$/,
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 10 * 1024 } },
          generator: {
            filename: './static/assets/images/[name].[contenthash:8].[ext]',
          },
        },
        {
          test: /\.(mp4|webm)$/,
          type: 'asset/resource',
          generator: {
            filename: './static/assets/videos/[name].[contenthash:8].[ext]',
          },
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({ async: isDevMode }),
      new webpack.DefinePlugin({ 'process.env': JSON.stringify(process.env) }),
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new MiniCssExtractPlugin({
        filename: './static/css/[name].[contenthash:8].bundle.css',
      }),
    ],
    devServer: {
      historyApiFallback: true,
      hot: true,
      liveReload: false,
    },
  };
};
