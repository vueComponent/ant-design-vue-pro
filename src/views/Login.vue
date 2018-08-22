<template>
  <div id="auth">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <img src="~@/assets/logo.svg" class="logo" alt="logo">
            <span class="title">Ant Design</span>
          </a>
        </div>
        <div class="desc">
          Ant Design 是西湖区最具影响力的 Web 设计规范
        </div>
      </div>
      <div class="main">
        <a-form ref="formLogin" :autoFormCreate="(form)=>{this.form = form}" id="formLogin">

          <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }" @change="handleTabClick">
            <a-tab-pane key="tab1" tab="账号密码登陆">

              <a-form-item
                      fieldDecoratorId="username"
                      :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入帐户名或邮箱地址' }, { validator: this.handleUsernameOrEmail }], validateTrigger: 'blur'}"
              >
                <a-input size="large" type="text" v-model="formLogin.username" placeholder="帐户名或邮箱地址 / admin">
                  <a-icon slot="prefix" type='user' :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>

              <a-form-item
                      fieldDecoratorId="password"
                      :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}">
                <a-input size="large" type="password" v-model="formLogin.password" placeholder="密码 / admin">
                  <a-icon slot="prefix" type='lock' :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
            </a-tab-pane>
            <a-tab-pane key="tab2" tab="手机号登陆">
              <a-form-item
                      fieldDecoratorId="mobile"
                      :fieldDecoratorOptions="{rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'blur'}">
                <a-input size="large" type="text" v-model="formLogin.mobile" placeholder="手机号">
                  <a-icon slot="prefix" type='mobile' :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>

              <a-row :gutter="16">
                <a-col class="gutter-row" :span="16">
                  <a-form-item
                          fieldDecoratorId="captcha"
                          :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}">
                    <a-input size="large" type="text" v-model="formLogin.captcha" placeholder="验证码">
                      <a-icon slot="prefix" type='mail' :style="{ color: 'rgba(0,0,0,.25)' }" />
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="8">
                    <span class="ivu-input-prefix">
                      <a-button class="getCaptcha" :disabled="state.smsSendBtn"
                                @click.stop.prevent="getCaptcha" v-text="!state.smsSendBtn&&'获取验证码'||(state.time+' s')"></a-button>
                    </span>
                </a-col>
              </a-row>

            </a-tab-pane>
          </a-tabs>

          <a-form-item>
            <a-checkbox v-model="formLogin.rememberMe">自动登陆</a-checkbox>
            <router-link :to="{ name: 'recover', params: { user: 'aaa'} }" class="forge-password" style="float: right;">忘记密码</router-link>
          </a-form-item>

          <a-form-item style="margin-top:24px">
            <a-button size="large" type="primary"
                      htmlType="submit" class="login-button" :loading="loginBtn"
                      @click.stop.prevent="handleSubmit" v-bind:disabled="loginBtn" >确定</a-button>
          </a-form-item>

        </a-form>
      </div>
      <div class="footer">
        <div class="links">
          <a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>
        </div>
        <div class="copyright">
          Copyright &copy; 2018 白鹭学园技术组出品
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import md5 from "md5";
  import api from '../api/'
  import { mapActions } from "vuex";

  export default {
      data() {
          return {
              customActiveKey: "tab1",
              loginBtn: false,
              // login type: 0 email, 1 username, 2 telephone
              loginType: 0,
              form: null,
              state: {
                  time: 60,
                  smsSendBtn: false,
              },
              formLogin: {
                  username: "",
                  password: "",
                  captcha: "",
                  mobile: "",
                  rememberMe: true
              },
          }
      },
      methods: {
          ...mapActions(["Login"]),
          // handler
          handleUsernameOrEmail(rule, value, callback) {
              const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
              if (regex.test(value)) {
                  this.loginType = 0
              } else {
                  this.loginType = 1
              }
              callback()
          },
          handleTabClick(key) {
              this.customActiveKey = key
              // this.form.resetFields()
          },
          handleSubmit() {
              let flag = false

              if (this.customActiveKey === 'tab1') {
                  this.form.validateFields(['username', 'password'], { force: true }, (err) => {
                      if (!err) {
                          flag = true
                      }
                  })
              } else {
                  this.form.validateFields(['mobile', 'captcha'], { force: true }, (err) => {
                      if (!err) {
                          flag = true
                          this.loginType = 2 // 登录类型修改为手机登录
                      }
                  })
              }

              if (!flag) return

              this.loginBtn = true

              let loginParams = {
                  password: md5(this.formLogin.password),
                  remember_me: this.formLogin.rememberMe
              };

              switch (this.loginType) {
                  case 0:
                      loginParams.email = this.formLogin.username
                      break;
                  case 1:
                      loginParams.username = this.formLogin.username
                      break;
                  case 2:
                  default:
                      loginParams.mobile = this.formLogin.mobile
                      loginParams.captcha = this.formLogin.captcha
                      break;
              }

              this.Login(loginParams).then(() => {
                  this.loginBtn = false
                  this.$router.push({ name: "dashboard" })
              }).catch((err) => {
                  this.requestFailed(err);
              })

          },
          getCaptcha(e) {
              e.preventDefault()
              let that = this

              this.form.validateFields(['mobile'], { force: true },
                  (err) => {
                      if (!err) {
                          this.state.smsSendBtn = true;

                          let interval = window.setInterval(() => {
                              if (that.state.time-- <= 0) {
                                  that.state.time = 60;
                                  that.state.smsSendBtn = false;
                                  window.clearInterval(interval);
                              }
                          }, 1000);

                          const hide = this.$message.loading('验证码发送中..', 0);
                          this.$http.post(api.SendSms, { mobile: that.formLogin.mobile })
                              .then(res => {
                                  setTimeout(hide, 2500);
                                  this.$notification['success']({
                                      message: '提示',
                                      description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                                      duration: 8
                                  })
                              })
                              .catch(err => {
                                  setTimeout(hide, 1);
                                  clearInterval(interval);
                                  that.state.time = 60;
                                  that.state.smsSendBtn = false;
                                  this.requestFailed(err);
                              });
                      }
                  }
              );
          },
          requestFailed(err) {
              this.$notification['error']({
                  message: '错误',
                  description: ((err.response || {}).data || {}).message || "请求出现错误，请稍后再试",
                  duration: 4,
              });
              this.loginBtn = false;
          },
      }
  }
</script>

<style lang="scss" scoped>

  #auth {
    height: 100%;

    .container {
      width: 100%;
      min-height: 100%;
      background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
      background-size: 100%;
      padding: 110px 0 144px;
      position: relative;

      a {
        text-decoration: none;
      }

      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0,0,0,.85);
            font-family: "Myriad Pro","Helvetica Neue",Arial,Helvetica,sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        width: 368px;
        margin: 0 auto;

        label {
          font-size: 14px;
        }

        .ivu-input-prefix {
          left: 12px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.25);
        }
        .getCaptcha {
          display: block;
          width: 100%;
          height: 40px;
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
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
</style>