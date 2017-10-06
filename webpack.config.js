var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var styleCss = new ExtractTextPlugin('css/style.css');
var vendorCss = new ExtractTextPlugin('css/vendor.css');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = (env, args) => {
  var minify = (env === 'production' || env === 'compress');
  var compress = (env == 'compress');
  
  var configuration = {
    context: path.resolve(__dirname, 'src'),
    entry: {
      app: ['babel-polyfill', './main.js'],
      vendor: ['jquery', 'bootstrap', 'bootstrap-multiselect', 'handlebars', 'vis']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/app.js'
    },
    module: {
      loaders: [
        {
          loader: 'babel-loader',
          include: [
            path.resolve(__dirname, "src"),
          ],
          test: /\.jsx?$/,
          query: {
            plugins: ['transform-runtime'],
            presets: ['es2015']
          }
        },          
        {
          test: /\.css$/,
          use: styleCss.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', options: { minimize: minify } }
            ]
          }),
          include: /src/,
          exclude: /generated/
        },
        {
          test: /\.css$/,
          use: vendorCss.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', options: { minimize: minify } }
            ]
          }),
          include: [/generated/, /node_modules/]
        },
        {
          test: /\.(svg|ttf|eot|woff|woff2)$/,
          use: [
            { loader: 'file-loader', options: { name: 'fonts/[name].[ext]', publicPath: '../../' } }
          ]
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        Handlebars: 'handlebars',
        vis: 'vis'
      }),
      new HtmlWebpackPlugin({
        template: 'assets/template.html',
        minify: minify ?
          {
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true
          }
          :
          false
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'js/vendor.js'
      }),
      vendorCss,
      styleCss
    ],
    resolve: {
      alias: {
         handlebars: 'handlebars/dist/handlebars.min.js'
      }
    }
  };
  
  if (compress) {
    configuration.plugins.push(
      new CompressionPlugin({
        asset: "[path][query]",
        algorithm: "gzip",
        test: /\.js$|\.css$/,
        minRatio: 0.8
      })
    );
  }
  
  return configuration;
};