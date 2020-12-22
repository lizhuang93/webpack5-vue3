const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const {VueLoaderPlugin} = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const resolve = (p) => path.resolve(__dirname, p)

module.exports = (env, argv) => {
  const isDev = argv.mode !== 'production'
  return {
    mode: argv.mode || 'development',
    devtool: argv.mode === 'production' ? false : 'eval-source-map',
    performance: { hints: 'warning'},
    entry: {
      'app1/app': resolve('./src/modules/app1/main.js'),
      'app2/app': resolve('./src/modules/app2/main.js'),
      'app3/app': resolve('./src/modules/app3/main.js'),
    },
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
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.vue'],
      alias: {
        '@': resolve('./src'),
        '@app1': resolve('./src/modules/app1'),
        '@app2': resolve('./src/modules/app2'),
        '@app3': resolve('./src/modules/app3'),
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
      ]
    },
    plugins:[
      new CleanWebpackPlugin(),
      new WebpackManifestPlugin(),
      new HtmlWebpackPlugin({ template: resolve('./src/modules/app1/index.html'), filename: 'app1/index.html', chunks: [`app1/app`] }),
      new HtmlWebpackPlugin({ template: resolve('./src/modules/app2/index.html'), filename: 'app2/index.html', chunks: [`app2/app`] }),
      new HtmlWebpackPlugin({ template: resolve('./src/modules/app3/index.html'), filename: 'app3/index.html', chunks: [`app3/app`] }),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].css',
      }),
      // copy custom static assets
      new CopyWebpackPlugin({
        patterns: [{
          from: resolve('./static'),
          to: 'static',
        }]
      }),
    ],
    devServer: {
      contentBase: './dist',
      open: true,
      openPage: 'app1',
      host: '0.0.0.0',
      port: '8080',
      hot:true,
      disableHostCheck: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:6001',
          pathRewrite: { '^/api': '' },
        },
      },
    }
  }
}