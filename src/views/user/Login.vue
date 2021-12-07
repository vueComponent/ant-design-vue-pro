<template>
  <div class="card-body nav2Styles">
    <div class="col-sm-12 text-center">
      <h1 class="card-title kanitFonts3 textColerHeader">ยินดีต้อนรับ</h1>
    </div>
    <div class="container imageCard">
      <div class="wrapper-full-page marginToTop">
        <div class="form-group">
          <div class="col-sm-6">
            <label class="kanitFonts2 labelStyleInput">ชื่อเข้าระบบ</label>
          </div>
          <input type="search" class="form-control kanitFonts1 inputStyle" placeholder="User Id" v-model="username" />
        </div>
        <div class="form-group">
          <div class="col-sm-6">
            <label class="kanitFonts2 labelStyleInput">รหัสผ่าน</label>
          </div>
          <input type="search" class="form-control kanitFonts1 inputStyle" placeholder="Password" v-model="password" />
        </div>
        <div class="itemTextCenter">
          <a class="navbar-brand" @click="handleSubmit">
            <img class="img-responsive imageGotoMainmenu" src="/img/newImage/BT_Login.png" alt="..." />
          </a>
        </div>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-12 text-center">
        <router-link class="navbar-brand" to="/user/forgotpassword">
          <label class="card-title kanitFonts1 textFooterBoxLogin"> ลืมรหัสผ่าน </label>
        </router-link>
        <router-link class="navbar-brand" to="/user/contact">
          <label class="card-title kanitFonts1 textFooterBoxLogin"> / ติดต่อเจ้าหน้าที่ </label>
        </router-link>
      </div>
    </div>
    <br /><br />

    <div class="row justify-content-md-center">
      <div class="row">
        <div class="col-4">
          <hr class="new5" />
        </div>
        <div class="col-4 text-center">
          <label class="card-title kanitFonts1 textFooterNoAccount"> ยังไม่มีบัญชี </label>
        </div>
        <div class="col-4">
          <hr class="new5" />
        </div>
      </div>
    </div>
    <br /><br />

    <div class="text-center">
      <router-link class="navbar-brand" to="/user/register">
        <img class="img-responsive imgRegister" src="/img/newImage/BT_Register.png" />
      </router-link>
    </div>
    <br />
  </div>
</template>

<script>
import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'

export default {
  components: {
    TwoStepCaptcha,
  },
  data() {
    return {
      username: 'admin',
      password: 'admin',
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false,
      },
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),

    handleSubmit(e) {
      e.preventDefault()
      const { username, password, state, Login } = this

      state.loginBtn = true
      const loginParams = { username }
      delete loginParams.username
      loginParams['username'] = username
      loginParams.password = md5(password)
      Login(loginParams)
        .then((res) => this.loginSuccess(res))
        .catch((err) => this.requestFailed(err))
        .finally(() => {
          state.loginBtn = false
        })
    },
    loginSuccess(res) {
      // console.log(res)
      this.$router.push({ path: '/' })
      setTimeout(() => {
        this.$notification.success({
          message: 'Login Successfully',
          description: `You Have Successfully Logged in to AutoEasy168`,
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed(err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
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

.nav2Styles {
  background-color: black;
  margin-top: 20%;
  height: 740px;

  @media (max-width: 420px) {
    margin-top: 30%;
    height: 640px;
  }
}

.textColerHeader {
  color: #ffd373;
  font-size: 35px;

  @media (max-width: 420px) {
    font-size: 28px;
  }
}

.imageCard {
  background-image: url(/img/newImage/BG_Detail01.png);
  background-size: contain no-repeat;
  background-position: center;
  width: 100%;
  border-radius: 10px;

  @media (max-width: 420px) {
    background-size: contain no-repeat;
    background-position: center;
    width: 100%;
    border-radius: 10px;
  }
}

.marginToTop {
  padding-top: 25px;
}

.labelStyleInput {
  width: 100%;
  font-size: 20px;

  @media (max-width: 420px) {
    font-size: 14px;
  }
}

.inputStyle {
  background-color: black;
  border-width: 0px;
  width: 100%;
  color: white;
  font-size: 18px;

  @media (max-width: 420px) {
    border-width: 0px;
    width: 100%;
    color: white;
    font-size: 14px;
  }
}

.imageGotoMainmenu {
  width: 30%;
  margin-top: 10px;

  @media (max-width: 420px) {
    width: 50%;
  }
}

.itemTextCenter {
  text-align: center;
}

.textFooterBoxLogin {
  color: #757575;
  font-size: 22px;

  @media (max-width: 420px) {
    font-size: 14px;
  }
}

.textFooterNoAccount {
  color: #757575;
  font-size: 18px;

  @media (max-width: 420px) {
    font-size: 12px;
    margin-top: 8px;
  }
}
hr.new5 {
  border: 1px solid white;
  border-radius: 0px;

  @media (max-width: 420px) {
    width: 120%;
  }
}

.imgRegister {
  width: 35%;

  @media (max-width: 420px) {
    width: 50%;
  }
}
</style>
