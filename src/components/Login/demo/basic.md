---
order: 0
title:
  zh-CN: 标准登录
  en-US: Standard Login
---

Support login with account and mobile number.

```html
<template>
  <div class="main">
    <Login
      :defaultActiveKey="type"
      :onTabChange="onTabChange"
      :onSubmit="handleSubmit"
    >
      <Tab key="tab1" tab="Account">
        <a-alert
          v-if="notice"
          type="error"
          :message="notice"
          showIcon
          closable
        />
        <UserName name="username" />
        <Password name="password" />
      </Tab>
      <Tab key="tab2" tab="Mobile">
        <Mobile name="mobile" />
        <Captcha name="captcha" :onGetCaptcha="onGetCaptcha" />
      </Tab>
      <div>
        <a-checkbox :checked="autoLogin" @change="changeAutoLogin">
          自动登录
        </a-checkbox>
        <a style="float: right" href="">
          忘记密码
        </a>
      </div>
      <Submit>
        登录
      </Submit>
      <div class="other">
        Other login methods
        <span class="icon icon-alipay" />
        <span class="icon icon-taobao" />
        <span class="icon icon-weibo" />
        <a style="float: 'right'" href="">
          Register
        </a>
      </div>
    </Login>
  </div>
</template>

<script>
import Login from "@/components/Login";

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

export default {
  components: {
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
      notice: "",
      type: "tab2",
      autoLogin: true
    };
  },
  methods: {
    handleSubmit(err, values) {
      console.log("value collected ->", {
        ...values,
        autoLogin: this.autoLogin
      });
      if (this.type === "tab1") {
        if (
          !err &&
          (values.username !== "admin" || values.password !== "888888")
        ) {
          setTimeout(() => {
            this.notice =
              "The combination of username and password is incorrect!";
          }, 500);
        }
      }
    },
    onTabChange(type) {
      this.type = type;
    },
    changeAutoLogin(e) {
      this.autoLogin = e.target.checked;
    },
    onGetCaptcha() {
      console.log("Get captcha!");
    }
  }
};
</script>

<style>
#scaffold-src-components-Login-demo-basic .login-warp {
  max-width: 360px;
  margin: auto;
}
#scaffold-src-components-Login-demo-basic .icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/itDzjUnkelhQNsycranf.svg");
  margin-left: 16px;
  vertical-align: middle;
  cursor: pointer;
}
#scaffold-src-components-Login-demo-basic .icon-alipay {
  background-position: -24px 0;
}
#scaffold-src-components-Login-demo-basic .icon-alipay:hover {
  background-position: 0 0;
}
#scaffold-src-components-Login-demo-basic .icon-taobao {
  background-position: -24px -24px;
}
#scaffold-src-components-Login-demo-basic .icon-taobao:hover {
  background-position: 0 -24px;
}
#scaffold-src-components-Login-demo-basic .icon-weibo {
  background-position: -24px -48px;
}
#scaffold-src-components-Login-demo-basic .icon-weibo:hover {
  background-position: 0 -48px;
}
</style>

```