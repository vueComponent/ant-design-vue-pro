<template>
  <div class="main">
    <div class="login">
      <a-form :form="form" @submit="handleSubmit">
        <a-tabs
          :animated="false"
          class="tabs"
          :activeKey="type"
          @change="onSwitch"
        >
          <a-tab-pane key="account" tab="账户密码登录">
            <VNodes :vnodes="renderMessage('account')" />
            <a-form-item>
              <a-input
                id="userName"
                type="UserName"
                size="large"
                placeholder="用户名：admin or user"
                v-decorator="[
                  'userName',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户名!'
                      }
                    ]
                  }
                ]"
              >
                <a-icon slot="prefix" type="user" class="prefixIcon" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                id="password"
                type="Password"
                size="large"
                placeholder="密码：ant.design"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码！'
                      }
                    ]
                  }
                ]"
                :onPressEnter="onPressEnter"
              >
                <a-icon slot="prefix" type="lock" class="prefixIcon" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="mobile" tab="手机号登录">
            <VNodes :vnodes="renderMessage('mobile')" />
            <a-form-item>
              <a-input
                size="large"
                type="Mobile"
                placeholder="手机号"
                v-decorator="[
                  'mobile',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号！'
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: '手机号格式错误！'
                      }
                    ]
                  }
                ]"
              >
                <a-icon slot="prefix" type="mobile" class="prefixIcon" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8">
                <a-col :span="16">
                  <a-input
                    size="large"
                    type="Captcha"
                    placeholder="验证码"
                    v-decorator="[
                      'captcha',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入验证码！'
                          }
                        ]
                      }
                    ]"
                  >
                    <a-icon slot="prefix" type="mail" class="prefixIcon" />
                  </a-input>
                </a-col>
                <a-col :span="8">
                  <a-button
                    class="getCaptcha"
                    size="large"
                    @click="onGetCaptcha"
                    :disabled="!!count"
                    >{{ count ? `${count} 秒` : "获取验证码" }}</a-button
                  >
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <div>
          <a-checkbox :checked="autoLogin" @change="changeAutoLogin">
            自动登录
          </a-checkbox>
          <a style="float: right" href="">
            忘记密码
          </a>
        </div>
        <a-form-item>
          <a-button
            size="large"
            class="submit"
            type="primary"
            htmlType="submit"
            :loading="submitting"
            >登录</a-button
          >
        </a-form-item>
        <div class="other">
          其他登录方式
          <a-icon type="alipay-circle" class="icon" theme="outlined" />
          <a-icon type="taobao-circle" class="icon" theme="outlined" />
          <a-icon type="weibo-circle" class="icon" theme="outlined" />
          <router-link class="register" to="/user/register">
            注册账户
          </router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Modal } from "ant-design-vue";
export default {
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      type: "account",
      autoLogin: true,
      submitting: false,
      count: 0,
      active: {
        account: ["userName", "password"],
        mobile: ["mobile", "captcha"]
      }
    };
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {
    ...mapState("login", {
      status: state => state.status
    })
  },
  methods: {
    ...mapActions("login", ["login", "getCaptcha"]),
    handleSubmit(e) {
      e.preventDefault();
      const { type, form } = this;
      const activeFileds = this.active[type];
      form.validateFields(activeFileds, { force: true }, (err, values) => {
        if (!err) {
          this.submitting = true;
          this.login({
            ...values,
            type
          }).then(() => {
            this.submitting = false;
          });
        }
      });
    },
    onSwitch(key) {
      this.type = key;
    },
    changeAutoLogin(e) {
      this.autoLogin = e.target.checked;
    },
    runGetCaptchaCountDown() {
      this.count = 59;
      this.interval = setInterval(() => {
        this.count -= 1;
        if (this.count === 0) {
          clearInterval(this.interval);
        }
      }, 1000);
    },
    onGetCaptcha() {
      const { form } = this;
      form.validateFields(["mobile"], { force: true }, (err, values) => {
        if (!err) {
          this.getCaptcha({ mobile: values.mobile });
          this.runGetCaptchaCountDown();
          Modal.info({
            title:
              "此项目为演示项目，并不会真的给您发送验证码。请切换到账户密码登录界面按提示登录。"
          });
        }
      });
    },
    onPressEnter(e) {
      e.preventDefault();
      this.form.validateFields(this.handleSubmit);
    },
    renderMessage(type) {
      if (this.status === "error" && this.type === type && !this.submitting) {
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
      } else {
        return null;
      }
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
