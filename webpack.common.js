import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: {
    app: './src/script.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Production',
      template: './src/index.html',
    }),
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
       {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
       },

       {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
       },
       {
          test: /\.(mp3|wav|ogg)$/i,
          type: "asset/resource",
       },
       {
          test: /\.html$/i,
          use: ["html-loader"],
       },
    ],
 },
};