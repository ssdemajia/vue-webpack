const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const common = require('./webpack.config.comm')
const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css|\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    hot: true,
    open: 'Chrome',
    quiet: true, // 不显示devServer信息
    overlay: true // 编译出现错误时将错误显示在页面中
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['Application running in http://localhost:8080/']
      },
      clearConsole: true
    })
  ]
})
