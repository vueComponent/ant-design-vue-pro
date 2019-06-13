<template>
  <div class="exception">
    <div class="exception-img-block">
      <div
        class="img"
        :style="{
          'background-image': `url(${model.src})`
        }"
      ></div>
    </div>

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
  display: flex;
  align-items: center;
  height: 80%;
  min-height: 500px;

  &-img-block {
    flex: 0 0 62.5%;
    width: 62.5%;
    padding-right: 100px;

    .img {
      float: right;
      width: 100%;
      max-width: 430px;
      height: 360px;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-size: contain;
    }
  }

  &-content {
    h1 {
      line-height: 72px;
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

@media screen and (max-width: 576px) {
  .exception {
    display: block;
    text-align: center;

    &-img-block {
      overflow: hidden;
      margin: 0 auto 24px;
      padding-right: 0;
    }
  }
}

@media screen and (max-width: 480px) {
  .exception {
    &-img-block {
      margin-bottom: -24px;
    }
  }
}
</style>
