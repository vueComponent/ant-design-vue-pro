<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" :tab="$t('user.login.tab-login-credentials')">
<!--          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="$t('user.login.message-invalid-credentials')" />-->
          <a-form-item>
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.login.acc.placeholder.org')"
              v-decorator="[
                'username_org',
                {rules: [{ required: true, message: $t('user.org.userName.required') }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              :placeholder="$t('user.login.psw.placeholder.org')"
              v-decorator="[
                'password_org',
                {rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="tab2" :tab="$t('user.login.tab-login-mobile')">
<!--          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="$t('user.login.message-invalid-credentials')" />-->
          <a-form-item>
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.login.acc.placeholder.admin')"
              v-decorator="[
                'username_admin',
                {rules: [{ required: true, message: $t('user.admin.userName.required') }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              :placeholder="$t('user.login.psw.placeholder.admin')"
              v-decorator="[
                'password_admin',
                {rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
<!--          <a-form-item>-->
<!--            <a-input size="large" type="text" :placeholder="$t('user.login.mobile.placeholder')" v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: $t('user.login.mobile.placeholder') }], validateTrigger: 'change'}]">-->
<!--              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
<!--            </a-input>-->
<!--          </a-form-item>-->

<!--          <a-row :gutter="16">-->
<!--            <a-col class="gutter-row" :span="16">-->
<!--              <a-form-item>-->
<!--                <a-input size="large" type="text" :placeholder="$t('user.login.mobile.verification-code.placeholder')" v-decorator="['captcha', {rules: [{ required: true, message: $t('user.verification-code.required') }], validateTrigger: 'blur'}]">-->
<!--                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
<!--                </a-input>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--            <a-col class="gutter-row" :span="8">-->
<!--              <a-button-->
<!--                class="getCaptcha"-->
<!--                tabindex="-1"-->
<!--                :disabled="state.smsSendBtn"-->
<!--                @click.stop.prevent="getCaptcha"-->
<!--                v-text="!state.smsSendBtn && $t('user.register.get-verification-code') || (state.time+' s')"-->
<!--              ></a-button>-->
<!--            </a-col>-->
<!--          </a-row>-->
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">{{ $t('user.login.remember.me') }}</a-checkbox>
        <router-link
          :hidden="customActiveKey !== 'tab1'"
          :to="{ name: 'forget', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >{{ $t('user.login.forget.password') }}</router-link>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >{{ $t('user.login.main.button') }}</a-button>
      </a-form-item>

      <a-form-item>
        <a  style="float: right;" @click="showRegisterAccount">注册账户</a>
      </a-form-item>

<!--      <div class="user-login-other">-->
<!--        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>-->
<!--      </div>-->
    </a-form>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
    <a-modal
      v-model="visible"
      title="重置密码"
      ok-text="确认"
      cancel-text="取消"
      @ok="resetPassword">
      <a-form
        id="formLogin"
        class="user-layout-login"
        ref="formLogin"
        :form="resetForm"
        @submit="handleSubmit"
      >
        <br/><br/><br/>
        <a-form-item>
          <a-input
            size="large"
            type="text"
            :placeholder="$t('user.login.acc.placeholder.org.forget')"
            v-decorator="[
            'username_org',
            {rules: [{ required: true, message: $t('user.org.userName.required.forget') }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
          ]"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
<!--  <a-modal v-model="RegisterModalShow">-->
<!--    <span>请联系破壁工作室<span style="color: red;">（破壁工作室联系方式）</span>。我们将把恒星号开通流程及相关材料发送给您~</span>-->
<!--  </a-modal>-->
</template>

<script>
import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
// import { getSmsCaptcha, get2step } from '@/api/login'
import { forgetOrg, getSmsCaptcha, loginAdmin, loginOrg } from '@/api/login'
import storage from 'store'
import { ACCESS_TOKEN, SHOW_NAME, SHOW_AVATAR, DETAIL, ROLE_ID } from '@/store/mutation-types'
import store from '@/store'
import router from '@/router'
import notification from 'ant-design-vue/lib/notification'
import { createRouter } from '@/config/router.config'

export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      resetForm: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      visible: false
    }
  },
  created () {
    console.log('created')
    storage.clearAll()
    console.log('加载页面时清空storage')
      // store.replaceState({})
    // get2step({ })
    //   .then(res => {
    //     this.requiredTwoStepCaptcha = res.result.stepCode
    //   })
    //   .catch(() => {
    //     this.requiredTwoStepCaptcha = false
    //   })
    // 👆commented out on 2021.09.18 by Brine
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    ...mapActions(['LoginAdmin', 'LoginOrg', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey
        // LoginAdmin,
        // LoginOrg
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username_org', 'password_org'] : ['username_admin', 'password_admin']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.username
          if (customActiveKey === 'tab1') {
            loginParams.nickName = values.username_org
            loginParams.password = md5(values.password_org)
            loginOrg(loginParams)
              .then(response => {
                if (response.success === false) {
                  this.$notification['error']({
                    message: '错误',
                    description: '用户名或密码错误！',
                    duration: 4
                  })
                  console.log('login failed')
                } else {
                  const result = response.data
                  storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
                  storage.set(SHOW_NAME, result.nickName + ' (' + result.organizationName + ')')
                  storage.set(SHOW_AVATAR, result.avatarUrl === undefined ? 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' : result.avatarUrl)
                  storage.set(DETAIL, {
                    nickName: result.nickName,
                    avatarUrl: result.avatarUrl,
                    description: result.description,
                    teacherName: result.teacherName,
                    teacherContact: result.teacherContact,
                    changeNameCount: result.changeNameCount
                  })
                  storage.set(ROLE_ID, 'organization')
                  console.log('token in storage:')
                  console.log(storage.get(ACCESS_TOKEN))
                  this.loginSuccess()
                  // commit('SET_TOKEN', result.token)
                  // resolve()
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => {
                state.loginBtn = false
              })
          } else if (customActiveKey === 'tab2') {
            loginParams.name = values.username_admin
            loginParams.password = values.password_admin
            loginAdmin(loginParams)
              .then(response => {
              if (response.success === false) {
                this.$notification['error']({
                  message: '错误',
                  description: '用户名或密码错误！',
                  duration: 4
                })
                console.log('login failed')
              } else {
                const result = response.data
                storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
                storage.set(SHOW_NAME, result.name)
                storage.set(SHOW_AVATAR, result.avatarUrl === undefined ? 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' : result.avatarUrl)
                storage.set(ROLE_ID, 'admin')
                console.log('token in storage:')
                console.log(storage.get(ACCESS_TOKEN))
                this.loginSuccess()
                // commit('SET_TOKEN', result.token)
                // resolve()
              }
            })
              .catch(err => this.requestFailed(err))
              .finally(() => {
                state.loginBtn = false
              })
            }
          } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    showRegisterAccount () {
      this.$info({
        content: <span>请联系破壁工作室<span style="color: red;">（破壁工作室联系方式）</span>。我们将把恒星号开通流程及相关材料发送给您~</span>
      })
    },
    resetPassword (e) {
      e.preventDefault()
      const {
        resetForm: { validateFields },
        state
      } = this

      state.loginBtn = true

      validateFields((err, values) => {
        if (!err) {
          forgetOrg({ nickName: values.username_org })
            .then(response => {
              console.log(response)
              if (response.data === false) {
                this.$notification['error']({
                  message: '错误',
                  description: '未找到对应账户！',
                  duration: 4
                })
              } else {
                this.$notification['success']({
                  message: '成功',
                  description: '发邮件成功，请留意邮箱。',
                  duration: 4
                })
                setTimeout(() => {
                  this.$router.push({ path: '/user/login' })
                }, 1000)
              }
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        }
      })
    },
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ mobile: values.mobile }).then(res => {
            setTimeout(hide, 2500)
            this.$notification['success']({
              message: '提示',
              description: '验证码获取成功，您的验证码为：' + res.result.captcha,
              duration: 8
            })
          }).catch(err => {
            setTimeout(hide, 1)
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
            this.requestFailed(err)
          })
        }
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      store
        .dispatch('GetInfo')
        .then(res => {
          console.log('getInfo')
          console.log(res)
          const roles = res.result && res.result.role
          // generate dynamic router
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            // 根据roles权限生成可访问的路由表
            // 动态添加可访问路由表
            // VueRouter@3.5.0+ New API
            // store.getters.addRouters.forEach(r => {
            //   router.addRoute(r)
            // })
            router.matcher = createRouter().matcher;
            router.options.routes = store.getters.addRouters
            router.addRoutes(store.getters.addRouters)

            this.$router.push({ path: '/' })

            setTimeout(() => {
              this.$notification.success({
                message: '欢迎',
                description: `${timeFix()}，欢迎回到济星云！`
              })
            }, 1000)
            this.isLoginError = false
          })
        })
        .catch(() => {
          notification.error({
            message: '错误',
            description: '请求用户信息失败，请重试'
          })
          // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
          store.dispatch('Logout').then(() => {
            next({ path: loginRoutePath, query: { redirect: to.fullPath } })
          })
        })


    },
    requestFailed (err) {
      console.log('error at login:')
      console.log(err)
      this.isLoginError = true
    }
  }
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
</style>
