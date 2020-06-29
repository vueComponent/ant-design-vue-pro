<template>
  <div class="main">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
      <a-form-item>
        <a-input size="large" type="text" placeholder="账号" v-decorator="['account', { rules: [{ required: true, message: '请输入账号' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change' }]">
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input size="large" type="password" autocomplete="false" placeholder="密码" v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' }]">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-checkbox v-decorator="['rememberMe']">记住密码</a-checkbox>
      </a-form-item>
      <a-form-item style="margin-top:24px">
        <a-button size="large" type="primary" htmlType="submit" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  components: {},
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    };
  },
  created() {

  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this;
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (regex.test(value)) {
        state.loginType = 0;
      } else {
        state.loginType = 1;
      }
      callback();
    },
    handleSubmit(e) {
      const that = this;
      e.preventDefault();
      const {
        form: { validateFieldsAndScroll },
        state,
        customActiveKey,
        Login
      } = this;

      state.loginBtn = true;

      const validateFieldsAndScrollKey = customActiveKey === 'tab1' ? ['account', 'password'] : ['mobile', 'captcha'];

      validateFieldsAndScroll(validateFieldsAndScrollKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values };
          Login(loginParams)
            .then(function(res) {
              that.loginSuccess(res)
            })
            .catch(response => {
              that.$notification['error']({
                message: response.msg,
                // description: response.msg,
                duration: 4
              })
            })
            .finally(() => {
              state.loginBtn = false;
            });
        } else {
          setTimeout(() => {
            state.loginBtn = false;
          }, 600);
        }
      });
    },
    loginSuccess(res) {
      this.$router.push({ name: 'Analysis' });
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        });
      }, 1000);
    },
    requestFailed(err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).m || '请求出现错误，请稍后再试',
        duration: 4
      });
    }
  }
};
</script>
<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>