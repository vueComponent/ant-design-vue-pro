<template>
  <div class="login-form">
    <a-row :gutter="0">
      <a-col :xl="12" :sm="24">
        <login-intro />
      </a-col>
      <a-col :xl="12" :sm="24" class="content">
        <login-form />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import LoginIntro from './LoginIntro'
import LoginForm from './LoginForm'
export default {
  components: {
    LoginIntro,
    LoginForm
  }
}
</script>

<style lang="less" scoped>
  .login-form {
    position: relative;
    width: 100wh;
    height: 100vh;
    background-image: url("./bg.jpg");

    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #fff;
    }
  }
</style>