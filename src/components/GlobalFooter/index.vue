<template>
  <div class="footer">
    <div class="links">
      <a href="#" target="_blank" title="首页">Pro 首页</a>
      <a
        href="https://github.com/vueComponent/ant-design-vue-pro"
        target="_blank"
      >
        <a-icon type="github" />
      </a>
      <a href="https://ant.design/" title="Ant Design">Ant Design</a>
      <a href="https://vue.ant.design/" title="Vue Antd">Vue Antd</a>
    </div>
    <div class="copyright">
      Copyright
      <a-icon type="copyright" /> 2019 <span>vueComponent</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GlobalFooter",
  data() {
    return {};
  }
};
</script>

<style lang="less" src="./index.less" scoped></style>
