---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基本描述列表。

## en-US

Basic DescriptionList.
```html
<template>
  <DescriptionList size="large" title="title">
    <Description term="Firefox">
      A free, open source, cross-platform,
      graphical web browser developed by the
      Mozilla Corporation and hundreds of
      volunteers.
    </Description>
    <Description term="Firefox">
      A free, open source, cross-platform,
      graphical web browser developed by the
      Mozilla Corporation and hundreds of
      volunteers.
    </Description>
    <Description term="Firefox">
      A free, open source, cross-platform,
      graphical web browser developed by the
      Mozilla Corporation and hundreds of
      volunteers.
    </Description>
  </DescriptionList>
</template>
```

````js
import DescriptionList from 'ant-design-vue-pro/lib/DescriptionList';

const { Description } = DescriptionList;

export default {
  components: {
    DescriptionList,
    Description
  }
}
````
