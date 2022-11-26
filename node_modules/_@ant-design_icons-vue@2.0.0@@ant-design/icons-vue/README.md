<h1 align="center">
Ant Design Icons for Vue
</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@ant-design/icons-vue.svg?style=flat)](https://npmjs.org/package/@ant-design/icons-vue)
[![NPM downloads](http://img.shields.io/npm/dm/@ant-design/icons-vue.svg?style=flat)](https://npmjs.org/package/@ant-design/icons-vue)

</div>

## Install

```bash
yarn add @ant-design/icons
yarn add @ant-design/icons-vue
```

## Basic Usage

First, you should add the icons that you need into the library.

```ts
import Vue from 'vue'
import { AntDesignOutline, DashboardOutline, TwitterOutline } from '@ant-design/icons';
import AntdIcon from '@ant-design/icons-vue';
AntdIcon.add(AntDesignOutline, DashboardOutline);
Vue.use(AntdIcon)
```

After that, you can use antd icons in your Vue components as simply as this:

```jsx
<antd-icon type="ant-design-o" />
<antd-icon type="dashboard-o" />
<antd-icon type={TwitterOutline} />
```

```ts
export interface IconDefinition {
    name: string;
    theme: ThemeType;
    icon: ((primaryColor: string, secondaryColor: string) => AbstractNode) | AbstractNode;
}
```

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| type | Type of ant design icon | string \| IconDefinition | - |
| style | style properties of icon, like fontSize and color | object \| string | - |
| class | class properties of icon | object \| string | - |

### Events
| Events Name | Description | Arguments |
| --- | --- | --- |
| click | set the handler to handle `click` event | function(e) |
