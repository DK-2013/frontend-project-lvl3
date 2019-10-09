const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : '',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ico$/,
        use: [
          'file-loader?name=[name].[ext]',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'assets/template.html',
    }),
  ],
};
