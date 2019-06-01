<template>
  <div class="exception">
    <img :src="model.src" class="exception-img" />

    <div class="exception-content">
      <h1>{{ model.title }}</h1>
      <p class="desc">{{ model.desc }}</p>
      <div class="action">
        <a-button type="primary" @click="goHome">返回首页</a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    goHome() {
      this.$router.push("/");
    }
  }
};
</script>
<style lang="less" scoped>
.exception {
  height: 80%;
  display: flex;
  align-items: center;

  &-img {
    width: 100%;
    max-width: 430px;
    height: 360px;
    margin: 0 130px 0 60px;
  }

  &-content {
    h1 {
      margin-bottom: 24px;
      font-size: 72px;
      color: #434e59;
      font-weight: 600;
    }

    .desc {
      margin-bottom: 16px;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}
</style>
