const {join} = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
   entry: join(__dirname, 'src/index.js'),
   output: {
      path: join(__dirname, 'dist'),
      filename: 'app.js'
   },
   module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
              presets: ['es2015', 'react', 'stage-2']
          }
        }
      ]
   },
   plugins: [
    new Dotenv({
      path: join(__dirname, '.env'),
      safe: true
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src/index.html')
    })
  ],
  devtool: 'source-map'
}
