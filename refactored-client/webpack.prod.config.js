const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './src',
  output: {
    path: path.resolve(__dirname, 'output'),
    clean: true,
    filename: 'js/[contenthash][chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults"}]
            ]
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[contenthash][hash][ext][query]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'public/index.html'
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 2020,
          parse: {
            ecma: 2020,
          },
          mangle: {
            properties: {
              reserved: [],
              keep_quoted: true,
            }
          },
          output: {
            ascii_only: true
          },
          toplevel: true,
          compress: {
            ecma: 2020,
            passes: 20,
            unsafe: true,
            toplevel: true,
            hoist_funs: true,
            drop_console: true,
            reduce_funcs: true,
            drop_debugger: true
          }
        }
      })
    ],
    concatenateModules: false,
  },
  resolve: {
    extensions: ['.js'],
  },
}