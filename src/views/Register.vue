<template>
  <div class="user-layout-register">
    <h3><span>注册</span></h3>
    <a-form ref="formRegister" :autoFormCreate="(form)=>{this.form = form}" id="formRegister">
      <a-form-item
        fieldDecoratorId="email"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入邮箱地址' }], validateTrigger: 'blur'}">

        <a-input size="large" type="text" placeholder="邮箱"></a-input>
      </a-form-item>

      <a-form-item
        fieldDecoratorId="password"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '至少6位密码，区分大小写' }], validateTrigger: 'blur'}">

        <a-input size="large" type="password" placeholder="至少6位密码，区分大小写"></a-input>
      </a-form-item>

      <a-form-item
        fieldDecoratorId="password2"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '至少6位密码，区分大小写' }], validateTrigger: 'blur'}">

        <a-input size="large" type="password" placeholder="确认密码"></a-input>
      </a-form-item>

      <a-form-item
        fieldDecoratorId="mobile"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '手机号' }], validateTrigger: 'blur'}">

        <a-input-group size="large" compact>
          <a-select style="width: 20%" size="large" defaultValue="+86">
            <a-select-option value="+86">+86</a-select-option>
            <a-select-option value="+87">+87</a-select-option>
          </a-select>
          <a-input style="width: 80%" placeholder="11 位手机号"></a-input>
        </a-input-group>
      </a-form-item>

      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-form-item
            fieldDecoratorId="captcha"
            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}">
            <a-input size="large" type="text" placeholder="验证码">
              <a-icon slot="prefix" type='mail' :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <span class="ivu-input-prefix">
            <a-button
              class="getCaptcha"
              size="large"
              :disabled="state.smsSendBtn"
              @click.stop.prevent="getCaptcha"
              v-text="!state.smsSendBtn && '获取验证码'||(state.time+' s')"></a-button>
          </span>
        </a-col>
      </a-row>

      <a-form-item>
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="register-button"
          :loading="registerBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="registerBtn">注册
        </a-button>
        <router-link class="login" :to="{ name: 'login' }">使用已有账户登录</router-link>
      </a-form-item>

    </a-form>
  </div>
</template>

<script>
  import api from '@/api/'
  import UserLayout from '@/components/layout/UserLayout'

  export default {
    name: "Register",
    components: {
      UserLayout
    },
    data () {
      return {
        form: null,

        state: {
          time: 60,
          smsSendBtn: false,
        },
        registerBtn: false
      }
    },
    methods: {

      handleSubmit () {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('form data', values)
          }
        })
      },

      getCaptcha (e) {
        e.preventDefault()
        let that = this

        this.form.validateFields([ 'mobile' ], { force: true },
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
              this.$http.post(api.SendSms, { mobile: that.formRegister.mobile })
                .then(res => {
                  setTimeout(hide, 2500);
                  this.$notification[ 'success' ]({
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
      requestFailed (err) {
        this.$notification[ 'error' ]({
          message: '错误',
          description: ((err.response || {}).data || {}).message || "请求出现错误，请稍后再试",
          duration: 4,
        });
        this.registerBtn = false;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .user-layout-register {

    &> h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .register-button {
      width: 50%;
    }

    .login {
      float: right;
      line-height: 40px;
    }
  }
</style>