[English](./README.md) | 简体中文

<h1 align="center">Ant Design Pro Vue</h1>

<div align="center">
An out-of-box UI solution for enterprise applications as a Vue boilerplate. based on  <a href="https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/" target="_blank">Ant Design of Vue</a>
</div>

<div align="center">

[![Backers on Open Collective](https://opencollective.com/ant-design-pro-vue/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/ant-design-pro-vue/sponsors/badge.svg)](#sponsors) [![License](https://img.shields.io/npm/l/package.json.svg?style=flat)](https://github.com/sendya/ant-design-pro-vue/blob/master/LICENSE)
[![Release](https://img.shields.io/github/release/sendya/ant-design-pro-vue.svg?style=flat)](https://github.com/sendya/ant-design-pro-vue/releases/latest)
[![Travis branch](https://travis-ci.org/sendya/ant-design-pro-vue.svg?branch=master)](https://travis-ci.org/sendya/ant-design-pro-vue)

</div>

- 预览: https://preview.pro.loacg.com
- 首页: https://pro.loacg.com
- 文档: https://pro.loacg.com/docs/getting-started
- 更新日志: https://pro.loacg.com/docs/changelog
- 常见问题: https://pro.loacg.com/docs/faq
- 分支: 
  - demo/router-view-table: 增删改查业务(通过路由导航)
  - feature/demand_load: 按需加载 Antd 组件
  - feature/lang: 多语言国际化 (i18n) 例示
  - feature/dynamic-menu: 动态菜单 (从后端拉取并生成菜单结构)
  - lite: 无任何业务逻辑的模板 (老旧的)


Overview
----

基于 [Ant Design of Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/) 实现的 [Ant Design Pro](https://pro.ant.design/) 

![工作台-多标签模式](https://static-2.loacg.com/open/static/github/20190224163345.jpg)

![工作台+设置菜单](https://static-2.loacg.com/open/static/github/20181126112124.png)

![个人设置](https://static-2.loacg.com/open/static/github/20180916-134251.png)


环境和依赖
----

- node
- yarn
- webpack
- eslint
- @vue/cli ~3
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现

> 请注意，我们强烈建议本项目使用 [Yarn](https://yarnpkg.com/) 包管理工具，这样可以与本项目演示站所加载完全相同的依赖版本 (yarn.lock) 。由于我们没有对依赖进行强制的版本控制，采用非 yarn 包管理进行引入时，可能由于 Pro 所依赖的库已经升级版本而引入了新版本所导致的问题。作者可能会由于时间问题无法及时排查而导致您采用本项目作为基项目而出现问题。



项目下载和运行
----

- 拉取项目代码
```bash
git clone https://github.com/sendya/ant-design-pro-vue.git
cd ant-design-pro-vue
```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn run serve
```

- 编译项目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```



其他说明
----

- **关于 Issue 反馈 (重要!重要!重要!) 请在开 *Issue* 前，先阅读该内容：[Issue / PR 编写建议](https://github.com/sendya/ant-design-pro-vue/issues/90)** 

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请更新您的 cli

- 关闭 Eslint (不推荐) 移除 `package.json` 中 `eslintConfig` 整个节点代码, `vue.config.js` 下的 `lintOnSave` 值改为 `false`

- 开启组件按需加载 `/src/main.js` L7 修改为 `import './core/lazy_use'`

- 修改 Ant Design 配色，在文件 `vue.config.js` 中，其他 less 变量覆盖参考 [ant design](https://ant.design/docs/react/customize-theme-cn) 官方说明
```ecmascript 6
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
```
- **使用polyfill兼容至 IE10**

## 浏览器兼容

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
