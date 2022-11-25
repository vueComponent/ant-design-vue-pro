<p align="center"><img src="docs/.vuepress/public/logo.svg?sanitize=true" width="40%"></p>
<h1 align="center">vue-svg-loader</h1>
<p align="center">webpack loader that lets you use SVG files as Vue components</p>
<p align="center">
  <a href="https://vue-svg-loader.js.org">Documentation</a> -
  <a href="https://vue-svg-loader.js.org/faq.html">FAQ</a>
</p>

## Installation
``` bash
npm i -D vue-svg-loader vue-template-compiler

yarn add --dev vue-svg-loader vue-template-compiler
```

## Basic configuration
### webpack
``` js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          'vue-svg-loader',
        ],
      },
    ],
  },
};
```
### Vue CLI
``` js
module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
};
```

### Nuxt.js (1.x / 2.x)
``` js
module.exports = {
  build: {
    extend: (config) => {
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));

      svgRule.test = /\.(png|jpe?g|gif|webp)$/;

      config.module.rules.push({
        test: /\.svg$/,
        use: [
          'babel-loader',
          'vue-svg-loader',
        ],
      });
    },
  },
};
```

## Example usage
``` vue
<template>
  <nav>
    <a href="https://github.com/vuejs/vue">
      <VueLogo />
      Vue
    </a>
    <a href="https://github.com/svg/svgo">
      <SVGOLogo />
      SVGO
    </a>
    <a href="https://github.com/webpack/webpack">
      <WebpackLogo />
      webpack
    </a>
  </nav>
</template>
<script>
import VueLogo from './public/vue.svg';
import SVGOLogo from './public/svgo.svg';
import WebpackLogo from './public/webpack.svg';

export default {
  name: 'Example',
  components: {
    VueLogo,
    SVGOLogo,
    WebpackLogo,
  },
};
</script>
```

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fvisualfanatic%2Fvue-svg-loader.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fvisualfanatic%2Fvue-svg-loader?ref=badge_large)
