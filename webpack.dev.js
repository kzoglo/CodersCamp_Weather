const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: false,
              configFile: './.eslintrc.json',
            },
          },
        ],
      }
    ]
  }
})
