Ant Design Pro Vue
====



Overview
----

基于 [Ant Design of Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/) 实现的 [Ant Design Pro](https://pro.ant.design/)  Vue 版

[预览地址](https://pro.loacg.com/)  **附带一些后台基础用到的列表展示例子**

![工作台+设置菜单](https://static-2.loacg.com/open/static/github/20181126112124.png)

![工作台](https://static-2.loacg.com/open/static/github/20180916-134306.png)

![个人设置](https://static-2.loacg.com/open/static/github/20180916-134251.png)

![个人中心](https://static-2.loacg.com/open/static/github/20181020152930.png)

![内联编辑列表](https://static-2.loacg.com/open/static/github/20180916-155011.png)

![角色列表](https://static-2.loacg.com/open/static/github/20180916-154921.png)

![角色编辑](https://static-2.loacg.com/open/static/github/20180916-155317.png)

![权限列表](https://static-2.loacg.com/open/static/github/20180916-154937.png)

![权限编辑](https://static-2.loacg.com/open/static/github/20180916-154950.png)

权限路由控制流程

![权限结构](https://static-2.loacg.com/open/static/github/permissions.png)


环境和依赖
----
- node
- yarn
- webpack
- eslint
- @vue/cli 3.2.1
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现



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

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请更新您的 cli

- 关闭 Eslint (不推荐) 移除 `package.json` 中 `eslintConfig` 整个节点代码

- 项目使用了在线 mock，[easy-mock](https://www.easy-mock.com/)  项目所用的 mock 数据 [点击查看(请勿改动接口返回数据)](https://www.easy-mock.com/project/5b7bce071f130e5b7fe8cd7d)

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



附属文档
----

- [路由/菜单说明](https://github.com/sendya/ant-design-pro-vue/blob/master/src/router/README.md)

- [Table 重封装组件](https://github.com/sendya/ant-design-pro-vue/blob/master/src/components/table/README.md)

- [ANTD 默认配置项](https://github.com/sendya/ant-design-pro-vue/blob/master/src/defaultConfig.js)

- 其他待补充...


备注
----

> @vue/cli 升级后，eslint 规则更新了。由于影响到全部 .vue 文件，需要逐个验证。既暂时关闭部分原本不验证的规则，后期维护时，在逐步修正这些 rules