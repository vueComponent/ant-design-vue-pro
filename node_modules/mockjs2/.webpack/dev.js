const extractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function (options) {
  options.output.filename = '[name].js';
  options.devtool = 'cheap-module-source-map';
  options.plugins[0] = new extractTextPlugin("[name].css");
  return options;
};