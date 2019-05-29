---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

简单的倒计时组件使用。

## en-US

The simplest usage.

```html
<template>
  <div>
    <CountDown
      :target="new Date().getTime() + 120000"
      :onEnd="handleCountEnd"
      :format="newFormat"
    />
  </div>
</template>

<script>
  import CountDown from "ant-design-vue-pro/CountDown";
  export default {
    methods: {
      newFormat(time) {
        const hours = 60 * 60 * 1000;
        const minutes = 60 * 1000;

        const h = Math.floor(time / hours);
        const m = Math.floor((time - h * hours) / minutes);
        const s = Math.floor((time - h * hours - m * minutes) / 1000);

        return `${h} - ${m} - ${s}`;
      },
      handleCountEnd() {
        console.log("count end");
      }
    },
    components: {
      CountDown
    }
  };
</script>
```
