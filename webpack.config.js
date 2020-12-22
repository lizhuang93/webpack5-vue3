const path = require('path');
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// 多页
const apps = fs.readdirSync("./src/modules")

const resolve = (p) => path.resolve(__dirname, p);

module.exports = (env, argv) => {
  const isDev = argv.mode !== 'production';
  return {
    mode: argv.mode || 'development',
    devtool: argv.mode === 'production' ? false : 'eval-source-map',
    performance: { hints: 'warning' },
    entry: getEntry(),
    output: {
      filename: '[name].[chunkhash:8].js',
      chunkFilename: '[name].[chunkhash:8].js',
      path: resolve('./dist/'),
      publicPath: isDev ? '/' : './',
    },
    optimization: {
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            name: 'vendor',
          },
        },
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          },
        }),
        new OptimizeCSSAssetsPlugin(),
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.vue'],
      alias: {
        '@': resolve('./src'),
        ...getAlias()
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'vue-loader',
        },
        {
          test: /\.(css|less)$/,
          use: [
            { loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader },
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'less-loader',
              options: { sourceMap: true },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 10000,
            name: resolve('img/[name].[hash:7].[ext]'),
          },
          exclude: /(node_modules|bower_components)/,
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 10000,
            name: resolve('media/[name].[hash:7].[ext]'),
          },
          exclude: /(node_modules|bower_components)/,
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 10000,
            name: resolve('font/[name].[hash:7].[ext]'),
          },
          exclude: /(node_modules|bower_components)/,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
            // {
            //   loader: 'eslint-loader',
            // },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new WebpackManifestPlugin(),
      ...getHtmlWebpackPlugin(),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].css',
      }),
      // copy custom static assets
      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolve('./static'),
            to: 'static',
          },
        ],
      }),
    ],
    devServer: {
      contentBase: './dist',
      open: true,
      openPage: apps[0],
      host: '0.0.0.0',
      port: '8080',
      hot: true,
      disableHostCheck: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:6001',
          pathRewrite: { '^/api': '' },
        },
      },
    },
  };
};

function getEntry() {
  return apps.reduce((obj, appName) => {
    obj[`${appName}/app`] = resolve(`./src/modules/${appName}/main.js`)
    return obj
  }, {}) 
}
function getAlias() {
  return apps.reduce((obj, appName) => {
    obj[`@${appName}`] = resolve(`./src/modules/${appName}`)
    return obj
  }, {}) 
}

function getHtmlWebpackPlugin() {
  return apps.reduce((arr, appName) => {
    return arr.concat(new HtmlWebpackPlugin({
      template: resolve(`./src/modules/${appName}/index.html`),
      filename: `${appName}/index.html`,
      chunks: [`${appName}/app`],
    }),)
  }, [])
}