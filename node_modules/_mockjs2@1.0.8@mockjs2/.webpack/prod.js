// env: node
const webpack = require("webpack"),
      extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (options) {
    options.devtool = 'cheap-module-source-map';
    options.plugins = [
        new extractTextPlugin("[name].[contenthash:8].css"),
    ];
    options.plugins.unshift(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }));
    options.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: { screw_ie8: true },
        compress: { screw_ie8: true, warnings: false },
        comments: false,
        ascii_only: true,
        sourceMap: true
    }));
    return options;
};