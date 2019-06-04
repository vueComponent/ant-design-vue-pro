# AvatarList

## 引用方法

- 全局注册

``` js
// main.js
import AvatarList from "./components/AvatarList/index";

Vue.use(AvatarList);
```

- 或者局部引用

``` vue
// XXX.vue
import { AvatarList, AvatarListItem } from "../../components/AvatarList/index";

export default {
  components: {
    AvatarList,
    AvatarListItem
  }
};
```

## 使用方发

``` vue
<template>
  <avatar-list
    size="large"
    :maxLength="3"
    :excessItemsStyle="{ color: '#f56a00', backgroundColor: '#fde3cf' }"
  >
    <avatar-list-item
      tips="Jake"
      src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png"
    ></avatar-list-item>
    <avatar-list-item
      tips="Andy"
      src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png"
    ></avatar-list-item>
    <avatar-list-item
      tips="Niko"
      src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
    ></avatar-list-item>
    <avatar-list-item
      tips="Niko"
      src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
    ></avatar-list-item>
    <avatar-list-item
      tips="Niko"
      src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
    ></avatar-list-item>
    <avatar-list-item
      tips="Niko"
      src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
    ></avatar-list-item>
  </avatar-list>
</template>
```

## API

### AvatarList

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | ---| --- |
| size | 头像大小 | number 或者 enum (large、small、mini、default) | default |
| maxLength | 要显示的最大项目 | number | 0 |
| excessItemsStyle | 多余的项目风格 | Object | - |

### AvatarListItem

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | ---| --- |
| tips | 头像展示文案 | string | - |
| src | 头像图片连接 | string | - |
