按需加载 减小打包
====



## 按需引入组件依赖

`Ant Design Pro Vue` 默认编码工作并不支持按需引入，不过可以通过以下操作结合 [Ant Design Of Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/) 官方文档来进行按需引入。

- 增加项目按需引入依赖
- 修改引入组件方式



1. 增加按需引入所需依赖  `babel-plugin-import` 
并且修改文件 `babel.config.js` 
   ```ecmascript 6
   module.exports = {
     presets: [
       '@vue/app'
     ],
     plugins: [
       [ "import", {
         "libraryName": "ant-design-vue",
         "libraryDirectory": "es",
         "style": "css"
       } ]
     ]
   }
   ```


2. 修改引入组件方式 (注意，这只是一个例子，请完整引入你所需要的组件)

   文件 `@/components/use.js`

   ```javascript
   import Vue from 'vue'
   import {
       Input, 
       Button, 
       Select, 
       Card, 
       Form, 
       Row, 
       Col, 
       Modal, 
       Table, 
       notification
   } from 'ant-design-vue'
   
   Vue.use(Input)
   Vue.use(Button)
   Vue.use(Select)
   Vue.use(Card)
   Vue.use(Form)
   Vue.use(Row)
   Vue.use(Col)
   Vue.use(Modal)
   Vue.use(Table)
   Vue.use(notification)
   
   Vue.prototype.$notification = notification;
   ```


3. 最后在 `main.js` 中引入 `@/components/use.js` 文件即可，如下

   ```javascript
   
   import Vue from 'vue'
   import App from './App'
   
   // 引入 按需组件的统一引入文件
   import './components/use'
   
   import './style/index.less'
   
   
   Vue.config.productionTip = false
   
   new Vue({
     render: h => h(App),
   }).$mount('#app')

   ```

**具体完整实现可参考分支 [feature/demand_load](https://github.com/sendya/ant-design-pro-vue/tree/feature/demand_load)**







## 其他 减少打包大小



1.   Ant Design Vue 1.2.x 版本起，采用的 ant-design 官方方案 svg Icon 组件，整个项目打包会变大很多，图标进行按需加载可参考 https://github.com/HeskeyBaozi/reduce-antd-icons-bundle-demo
2. moment 按需加载 可参考 https://github.com/jmblog/how-to-optimize-momentjs-with-webpack