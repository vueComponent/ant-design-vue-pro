English | [简体中文](./README.zh-CN.md)

<h1 align="center">Ant Design Pro Vue</h1>

<div align="center">
An out-of-box UI solution for enterprise applications as a Vue boilerplate. based on  <a href="https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/" target="_blank">Ant Design of Vue</a>
</div>

<div align="center">

[![Backers on Open Collective](https://opencollective.com/ant-design-pro-vue/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/ant-design-pro-vue/sponsors/badge.svg)](#sponsors) [![License](https://img.shields.io/npm/l/package.json.svg?style=flat)](https://github.com/sendya/ant-design-pro-vue/blob/master/LICENSE)
[![Release](https://img.shields.io/github/release/sendya/ant-design-pro-vue.svg?style=flat)](https://github.com/sendya/ant-design-pro-vue/releases/latest)
[![Travis branch](https://travis-ci.org/sendya/ant-design-pro-vue.svg?branch=master)](https://travis-ci.org/sendya/ant-design-pro-vue)

</div>

- Preview: https://preview.pro.loacg.com
- Home Page: https://pro.loacg.com
- Documentation: https://pro.loacg.com/docs/getting-started
- ChangeLog: https://pro.loacg.com/docs/changelog
- FAQ: https://pro.loacg.com/docs/faq
- Branches: 
  - demo/router-view-table: CRUD view in router
  - feature/demand_load: loaded on demand
  - feature/lang: i18n support
  - feature/dynamic-menu: dynamic menu demo
  - lite: lite template (legacy)


Overview
----

![dashboard + multi-tabs](https://static-2.loacg.com/open/static/github/20190224163345.jpg)

![dashboard + setting](https://static-2.loacg.com/open/static/github/20181126112124.png)

![user profile](https://static-2.loacg.com/open/static/github/20180916-134251.png)

![permission list](https://static-2.loacg.com/open/static/github/20180916-154937.png)


### Env and dependencies

- node
- yarn
- webpack
- eslint
- @vue/cli ~3
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - Picture edit
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - AntV G2
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - Antv/G2 of Vue

> Note:  [Yarn](https://yarnpkg.com/) package management is recommended, the exact same version loaded with the demo site of this project (yarn.lock) . but you can also use npm


### Project setup

- Clone repo
```bash
git clone https://github.com/sendya/ant-design-pro-vue.git
cd ant-design-pro-vue
```

- Install dependencies
```
yarn install
```

- Compiles and hot-reloads for development
```
yarn run serve
```

- Compiles and minifies for production
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```


### Other

- **IMPORTANT : About Issue feedback !! when opening Issue read [Issue / PR Contributing](https://github.com/sendya/ant-design-pro-vue/issues/90)**

- [Vue-cli3](https://cli.vuejs.org/guide/) used by the project.
- Disable Eslint (not recommended): remove `eslintConfig`  field in `package.json`  and `vue.config.js` field `lintOnSave: false`

- Load on Demand: modify `/src/main.js` L7,  append `import './core/lazy_use'` code.

- Customize Theme:  `vue.config.js` 
eg: 
```ecmascript 6
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* Less variables, required modifyVars*/

          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
```
- **polyfill**

- remove polyfill: 
  > [Vue CLI Polyfill](https://cli.vuejs.org/zh/guide/browser-compatibility.html#usebuiltins-usage)
  
  - remove `import '@babel/polyfill'`  field in  `src/main.js`
  - `babel.conflg.js` remove
    ```ecmascript 6
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'entry'
      }
    ]
    ```

## Browsers support

Modern browsers and IE10.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --- | --- | --- | --- | --- |
| IE10, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |


## Contributors

This project exists thanks to all the people who contribute. 
<a href="https://github.com/sendya/ant-design-pro-vue/graphs/contributors"><img src="https://opencollective.com/ant-design-pro-vue/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/ant-design-pro-vue#backer)]

<a href="https://opencollective.com/ant-design-pro-vue#backers" target="_blank"><img src="https://opencollective.com/ant-design-pro-vue/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/ant-design-pro-vue#sponsor)]

<a href="https://opencollective.com/ant-design-pro-vue/sponsor/0/website" target="_blank"><img src="https://opencollective.com/ant-design-pro-vue/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/ant-design-pro-vue/sponsor/1/website" target="_blank"><img src="https://opencollective.com/ant-design-pro-vue/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/ant-design-pro-vue/sponsor/2/website" target="_blank"><img src="https://opencollective.com/ant-design-pro-vue/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/ant-design-pro-vue/sponsor/3/website" target="_blank"><img src="https://opencollective.com/ant-design-pro-vue/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/ant-design-pro-vue/sponsor/4/website" target="_blank"><img src="https://opencollective.com/ant-design-pro-vue/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/ant-design-pro-vue/sponsor/5/website" target="_blank"><img src="https://opencollective.com/ant-design-pro-vue/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/ant-design-pro-vue/sponsor/6/website" target="_blank"><img src="https://opencollective.com/ant-design-pro-vue/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/ant-design-pro-vue/sponsor/7/website" target="_blank"><img src="https://opencollective.com/ant-design-pro-vue/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/ant-design-pro-vue/sponsor/8/website" target="_blank"><img src="https://opencollective.com/ant-design-pro-vue/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/ant-design-pro-vue/sponsor/9/website" target="_blank"><img src="https://opencollective.com/ant-design-pro-vue/sponsor/9/avatar.svg"></a>

