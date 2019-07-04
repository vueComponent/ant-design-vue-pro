<template>
  <div class="main">
    <Login
      :defaultActiveKey="type"
      :onTabChange="onTabChange"
      :onSubmit="handleSubmit"
      v-ant-ref="
        form => {
          this.loginForm = form;
        }
      "
    >
      <Tab key="account" tab="账户密码登录">
        <VNodes
          v-if="status === 'error' && type === 'account' && !submitting"
          :vnodes="renderMessage('account')"
        />
        <UserName
          name="userName"
          placeholder="用户名：admin or user"
          :rules="[
            {
              required: true,
              message: '请输入用户名!'
            }
          ]"
        />
        <Password
          name="password"
          placeholder="密码：ant.design"
          :rules="[{ required: true, message: '请输入密码！' }]"
          :onPressEnter="
            e => {
              e.preventDefault();
              this.form.validateFields(this.handleSubmit);
            }
          "
        />
      </Tab>
      <Tab key="mobile" tab="手机号登录">
        <VNodes
          v-if="status === 'error' && type === 'mobile' && !submitting"
          :vnodes="renderMessage('mobile')"
        />
        <Mobile
          name="mobile"
          placeholder="手机号"
          :rules="[
            {
              required: true,
              message: '请输入手机号！'
            },
            {
              pattern: /^1\d{10}$/,
              message: '手机号格式错误！'
            }
          ]"
        />
        <Captcha
          name="captcha"
          placeholder="验证码"
          :countDown="120"
          :onGetCaptcha="onGetCaptcha"
          getCaptchaButtonText="获取验证码"
          getCaptchaSecondText="秒"
          :rules="[
            {
              required: true,
              message: '请输入验证码！'
            }
          ]"
        />
      </Tab>
      <div>
        <a-checkbox :checked="autoLogin" @change="changeAutoLogin">
          自动登录
        </a-checkbox>
        <a style="float: right" href="">
          忘记密码
        </a>
      </div>
      <Submit :loading="submitting">
        登录
      </Submit>
      <div class="other">
        其他登录方式
        <a-icon type="alipay-circle" class="icon" theme="outlined" />
        <a-icon type="taobao-circle" class="icon" theme="outlined" />
        <a-icon type="weibo-circle" class="icon" theme="outlined" />
        <router-link class="register" to="/user/register">
          注册账户
        </router-link>
      </div>
    </Login>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { Modal } from "ant-design-vue";
import Login from "@/components/Login";

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

export default {
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    },
    Login,
    Tab,
    UserName,
    Password,
    Mobile,
    Captcha,
    Submit
  },
  data() {
    return {
      type: "account",
      autoLogin: true,
      submitting: false,
      count: 0,
      tabs: []
    };
  },
  computed: {
    ...mapState("login", {
      status: state => state.status
    })
  },
  methods: {
    ...mapActions("login", ["login", "getCaptcha"]),
    ...mapMutations("login", ["changeLoginStatus"]),
    handleSubmit(err, values) {
      const { type } = this.$data;
      if (!err) {
        this.submitting = true;
        this.login({
          ...values,
          type
        }).then(() => {
          this.submitting = false;
        });
      }
    },
    onTabChange(type) {
      this.type = type;
      this.changeLoginStatus({
        status: false,
        currentAuthority: "guest"
      });
    },
    changeAutoLogin(e) {
      this.autoLogin = e.target.checked;
    },
    onGetCaptcha() {
      return new Promise((resolve, reject) => {
        this.loginForm.validateFields(
          ["mobile"],
          { force: true },
          (err, values) => {
            if (err) {
              reject(err);
            } else {
              this.getCaptcha({ mobile: values.mobile })
                .then(resolve)
                .catch(reject);
              Modal.info({
                title:
                  "此项目为演示项目，并不会真的给您发送验证码。请切换到账户密码登录界面按提示登录。"
              });
            }
          }
        );
      });
    },
    renderMessage(type) {
      return (
        <a-alert
          style="margin-bottom: 24px"
          message={
            type === "account"
              ? "账户或密码错误（admin/ant.design）"
              : "验证码错误"
          }
          type="error"
          showIcon
        />
      );
    }
  }
};
</script>

<style scoped lang="less">
@import "~ant-design-vue/lib/style/themes/default.less";

.main {
  width: 388px;
  margin: 0 auto;
  @media screen and (max-width: @screen-sm) {
    width: 95%;
  }

  .icon {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.2);
    font-size: 24px;
    vertical-align: middle;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: @primary-color;
    }
  }

  .other {
    margin-top: 24px;
    line-height: 22px;
    text-align: left;

    .register {
      float: right;
    }
  }
  .login {
    /deep/ .ant-tabs .ant-tabs-bar {
      margin-bottom: 24px;
      text-align: center;
      border-bottom: 0;
    }

    /deep/ .ant-form-item {
      margin: 0 2px 24px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
    }

    .icon {
      margin-left: 16px;
      color: rgba(0, 0, 0, 0.2);
      font-size: 24px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }

    .other {
      margin-top: 24px;
      line-height: 22px;
      text-align: left;

      .register {
        float: right;
      }
    }

    .prefixIcon {
      color: @disabled-color;
      font-size: @font-size-base;
    }

    .submit {
      width: 100%;
      margin-top: 24px;
    }
  }
}
</style>
