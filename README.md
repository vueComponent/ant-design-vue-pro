# vue-antd-pro

基于 [Ant Design of Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/) 实现的 [Ant Design Pro](https://pro.ant.design/)  Vue 版

[预览地址](https://pro.loacg.com/)  **附带一些后台基础用到的列表展示例子**

![工作台](https://static-2.loacg.com/open/static/github/20180916-134306.png)

![个人设置](https://static-2.loacg.com/open/static/github/20180916-134251.png)

![内联编辑列表](https://static-2.loacg.com/open/static/github/20180916-155011.png)

![角色列表](https://static-2.loacg.com/open/static/github/20180916-154921.png)

![角色编辑](https://static-2.loacg.com/open/static/github/20180916-155317.png)

![权限列表](https://static-2.loacg.com/open/static/github/20180916-154937.png)

![权限编辑](https://static-2.loacg.com/open/static/github/20180916-154950.png)

## 环境和依赖
- node
- yarn
- webpack
- eslint
- @vue/cli 3.0.1
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件 
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现


## 项目下载和运行

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



## 其他说明

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请更新您的 cli

- 修改 Ant Design 配色  
在文件 vue.config.js 中，其他 less 变量覆盖参考 ant design 官方说明
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