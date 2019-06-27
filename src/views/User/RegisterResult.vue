<template>
  <div class="registerResult">
    <div>你的账户：{{ account }} 注册成功</div>
    <div>
      激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。
    </div>
    <div class="actions">
      <a href="">
        <a-button size="large" type="primary">
          查看邮箱
        </a-button>
      </a>
      <router-link to="/">
        <a-button size="large">
          返回首页
        </a-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: ""
    };
  },
  created() {
    this.account = this.$route.params.account;
  }
};
</script>

<style scoped lang="less">
.registerResult {
  /deep/ .anticon {
    font-size: 64px;
  }
  .title {
    margin-top: 32px;
    font-size: 20px;
    line-height: 28px;
  }
  .actions {
    margin-top: 40px;
    a + a {
      margin-left: 8px;
    }
  }
}
</style>
