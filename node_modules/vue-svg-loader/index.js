const svgToVue = require('svg-to-vue');
const { getOptions } = require('loader-utils');

module.exports = function (content) {
  const callback = this.async();
  const { svgo } = getOptions(this) || {};

  svgToVue(content, {
    svgoPath: this.resourcePath,
    svgoConfig: svgo,
  })
    .then(component => callback(null, component))
    .catch(callback);
};
