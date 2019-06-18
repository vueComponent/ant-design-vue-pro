---
order: 1
title:
  zh-CN: 垂直型
  en-US: Vertical
---

## zh-CN

垂直布局。

## en-US

Vertical layout.

```html
<template>
  <DescriptionList size="large" title="title" layout="vertical">
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
