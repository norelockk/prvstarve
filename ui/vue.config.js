const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const { gitDescribeSync } = require('git-describe');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');

process.env.LOLIPOP_UI_GIT_HASH = gitDescribeSync().hash

module.exports = {
  css: { extract: false },
  configureWebpack: {
    optimization: {
      splitChunks: false
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html', // the output file name that will be created
        template: 'public/index.html', // this is important - a template file to use for insertion
        inlineSource: '.(js|css)$' // embed all javascript and css inline
      }),
      new HtmlWebpackInlineSourcePlugin()
    ]
  },
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      const gitRevisionPlugin = new GitRevisionPlugin()
      args[0]['process.env']['LOLIPOP_UI_GIT_HASH'] = JSON.stringify(gitRevisionPlugin.commithash().substring(0, 9));
      return args
    });

    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.limit = 99999;
        return options
      });

    config.module
      .rule('media')
      .test(/\.(mp3|mp4|webm)$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 8192 ** 3,
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'media/[name].[hash:8].[ext]',
          },
        },
      });
  },

  parallel: false
}