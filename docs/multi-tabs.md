多(页签)标签 模式
====


## 让框架支持打开的页面增加多标签，可随时切换

### 关于如何移除该功能 组件
  1. 移除 `/src/components/layouts/BasicLayout.vue` L3, L12, L19
      ```vue
      <multi-tab v-if="$store.getters.multiTab"></multi-tab>
      ```
  2. 移除 `/src/config/defaultSettings.js` L25

  3. 移除 `src/store/modules/app.js` L27, L76-L79, L118-L120
  
  4. 移除 `src/utils/mixin.js` L21
  
  5. 删除组件目录 `src/components/MultiTab` 

> 以上 `L x` 均代表行N ，如 L3 = 行3 