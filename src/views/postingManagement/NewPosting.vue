<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <h1>这个页面的表单视图有点复杂，我暂时不想做。如果有谁想尝试一下富文本编辑器的放入，可以直接在这个页面弄。</h1>
      <h2>我遇到的问题如下：</h2>
      <h3>1、无法使用富文本编辑器的构造器，推测原因是ant-design-vue和wangEditor配置有冲突。</h3>
      <h3>2、运行npm安装代码npm i wangeditor –save后导致组件文件夹路由发生变化，会引发其他文件无法导入指定位置文件的错误。</h3>
      <h4 style='float: right'>——by Wei</h4>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'newPosting'
}
</script>

<style scoped>

</style>
