<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <div class="header">
          <a to="/">
            <img alt="logo" class="logo" :src="logo" />
            <span class="title">Ant Design</span>
          </a>
        </div>
        <div class="desc">
          Ant Design 是西湖区最具影响力的 Web 设计规范
        </div>
      </div>
      <router-view></router-view>
    </div>
    <GlobalFooter />
  </div>
</template>

<script>
import GlobalFooter from "@/components/GlobalFooter";
import logo from "@/assets/logo.png";
export default {
  components: {
    GlobalFooter
  },
  data() {
    return {
      logo
    };
  }
};
</script>

<style scoped lang="less">
@import "~ant-design-vue/lib/style/themes/default.less";

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: @layout-body-background;
}

.lang {
  width: 100%;
  height: 40px;
  line-height: 44px;
  text-align: right;
  :global(.ant-dropdown-trigger) {
    margin-right: 24px;
  }
}

.content {
  flex: 1;
  padding: 32px 0;
}

@media (min-width: @screen-md-min) {
  .container {
    background-image: url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg");
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
  }

  .content {
    padding: 32px 0 24px 0;
  }
}

.top {
  text-align: center;
}

.header {
  height: 44px;
  line-height: 44px;
  a {
    text-decoration: none;
  }
}

.logo {
  height: 44px;
  margin-right: 16px;
  vertical-align: top;
}

.title {
  position: relative;
  top: 2px;
  color: @heading-color;
  font-weight: 600;
  font-size: 33px;
  font-family: Avenir, "Helvetica Neue", Arial, Helvetica, sans-serif;
}

.desc {
  margin-top: 12px;
  margin-bottom: 40px;
  color: @text-color-secondary;
  font-size: @font-size-base;
}
</style>
