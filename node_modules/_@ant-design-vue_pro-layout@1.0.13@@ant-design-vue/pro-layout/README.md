English | [简体中文](./README.zh-CN.md)

<h1 align="center">Ant Design Pro Layout</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@ant-design-vue/pro-layout/latest?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout) [![Vue Support](https://img.shields.io/badge/support-Vue2-green?style=flat)](./package.json) [![NPM downloads](http://img.shields.io/npm/dm/@ant-design-vue/pro-layout.svg?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout) [![License](https://img.shields.io/github/license/vueComponent/pro-layout)](./LICENSE)

</div>

## Usage

```bash
npm i @ant-design-vue/pro-layout --save
// or
yarn add @ant-design-vue/pro-layout
```

```jsx
import ProLayout from '@ant-design-vue/pro-layout'

// by jsx
export default {
  name: 'BasicLayout',
  render () {
    return (
      <ProLayout>
        <router-view />
      </ProLayout>
    )
  }
}
```

```vue
<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :theme="theme"
    :layout="layout"
    :contentWidth="contentWidth"
    :auto-hide-header="autoHideHeader"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
  >
    <template v-slot:menuHeaderRender>
      <div>
        <img src="../assets/logo.svg" />
        <h1>Pro Layout</h1>
      </div>
    </template>
    <template v-slot:rightContentRender>
      <div :class="['ant-pro-global-header-index-right', layout === 'topmenu' && `ant-pro-global-header-index-${theme}`]">
        rightContentRender
      </div>
    </template>
    <template v-slot:footerRender>
      <div>footerRender</div>
    </template>
    <setting-drawer navTheme="dark" />
    <router-view />
  </pro-layout>
</template>

<script>

// by template
import ProLayout, { SettingDrawer } from '@ant-design-vue/pro-layout'
import { asyncRouterMap } from '../config/router.config'

export default {
  name: 'BasicLayout',
  data () {
    return {
      menus: [],
      collapsed: false,
      autoHideHeader: false,
      query: {},
      layout: 'sidemenu',
      contentWidth: 'Fluid',
      theme: 'dark',
      isMobile: false
    }
  },
  created () {
    this.menus = asyncRouterMap.find(item => item.path === '/').children
  },
  methods: {
    handleMediaQuery (query) {
      this.query = query
      if (this.isMobile && !query['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && query['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
      }
    },
    handleCollapse (collapsed) {
      this.collapsed = collapsed
    }
  },
  components: {
  	SettingDrawer
  }
}
</script>
```



## API



### ProLayout

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| title | layout in the upper left corner title | VNode \| String | `'Ant Design Pro'` |
| logo | layout top left logo url | VNode \| render | - |
| loading`*` | layout loading status | boolean | - |
| layout | layout menu mode, sidemenu: right navigation, topmenu: top navigation | 'sidemenu' \| 'topmenu' | `'sidemenu'` |
| contentWidth | content mode of layout, Fluid: adaptive, Fixed:  fixed width 1200px | 'Fixed' \| 'Fluid' | `Fluid` |
| theme | Navigation menu theme | 'light' \| 'dark' | `'dark'` |
| menus | Vue-router `routes` prop | Object | `[{}]` |
| collapsed | control menu's collapse and expansion | boolean | true |
| isMobile | is mobile | boolean | false |
| handleCollapse | folding collapse event of menu | (collapsed: boolean) => void | - |
| menuHeaderRender | render logo and title | v-slot \| VNode \| (logo,title)=>VNode \| false | - |
| headerRender | custom header render method | (props: BasicLayoutProps) => VNode | - |
| rightContentRender | header right content render method | (props: HeaderViewProps) => VNode | - |
| collapsedButtonRender | custom collapsed button method | (collapsed: boolean) => VNode | - |
| footerRender | custom footer render method | (props: BasicLayoutProps) => VNode | `false` | - |
| breadcrumbRender | custom breadcrumb render method | ({ route, params, routes, paths, h }) => VNode[] | - |
| i18nRender | i18n | Function (key: string) => string \| `false` | `false` |
| handleMediaQuery | media matchs callback | (querys: []) => void | - |
| mediaQuery            | media matchs                                                 | Array                              | -                  |
| openOnceKey           | menu only open root key | `true`     | - |


### PageHeaderWrapper

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| content | Content area | VNode \| v-slot | - |
| extra | Extra content area, on the right side of content | VNode \| v-slot | - |
| extraContent | Extra content area, on the right side of content | VNode \| v-slot | - |
| tabList | Tabs title list | `Array<{key: string, tab: sting}>` | - |
| tab-change | Switch panel callback | (key) => void | - |
| tab-active-key | The currently highlighted tab item | string | - |




### SettingDrawer

#### {settings}
| Property | Description | Type | Default Value |
| ---- | ---- | ---- | ---- |
| theme | Theme | `dark` `light` `realDark` | `light` |
| layout | Sider Layout | `sidemenu` `topmenu` | `sidemenu` |
| primaryColor | Primary color (*development only) | `#1890ff` |      |
| contentWidth | content mode of layout, Fluid: adaptive, Fixed:  fixed width 1200px | 'Fixed' \| 'Fluid' | `Fluid` |
