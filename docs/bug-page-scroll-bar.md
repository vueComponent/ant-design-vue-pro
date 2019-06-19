解决add-page-scroll-bar.md中##写在最后浏览器滚动条时，页面会抖动一下的问题
====



## 需求

> 目前 pro 有页面 overflow 显示出浏览器滚动条时，页面会抖动一下的问题。


## 实现方案

1. 在`App.vue`文件中`<style></style>`中添加以下代码
    `html::-webkit-scrollbar {display:none}`
2. 或者在`src\components`文件中添加以下代码
    `html::-webkit-scrollbar {display:none}`


## 写在最后
争对于该问题，本人做过测试，最后采用`html::-webkit-scrollbar {display:none}`方案，不会影响html内部的滚动条样式，在移动端的tabble等，在此采用第2种方案
