<template>
  <div class="form-container">
    <div>
      <h4 class="title">登录</h4>
      <a-form :form="form" @submit="handleSubmit" class="form-items">
        <a-form-item>
          <a-input 
            class="custom-input"
            placeholder="Username" 
            v-decorator="[ 'username', { rules: [{ required: true, message: 'Please input your username!' }] }]"
          >
            <a-icon slot="prefix" type='user' style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input 
            class="custom-input"
            placeholder="Password" 
            v-decorator="[ 'password', { rules: [{ required: true, message: 'Please input your password!' }] }]"
          >
            <a-icon slot="prefix" type='lock' style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="[
              'remember',
              {
                valuePropName: 'checked',
                initialValue: true,
              }
            ]"
          >
            Remember me
          </a-checkbox>
          <a class='login-form-forgot' href='javascript:;' style="float: right;">Forgot password</a>
          <a-button type="primary" htmlType="submit" block style="border-radius: 30px;">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          return
        }
        console.log('err', errors)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .form-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: rgb(255, 255, 255);

    .title {
      margin-bottom: 40px;
      font-weight: 500;
      font-size: 32px;
      text-align: center;
      letter-spacing: 4px;
    }
    .form-items {
      width: 320px;

      .custom-input {
        &:hover {
          border-color: transparent;
        }

         /deep/
        input {
          border-radius: 0px;
          border-top: 0px rgb(235, 237, 242);
          border-left: 0px rgb(235, 237, 242);
          border-right: 0px rgb(235, 237, 242);
          border-bottom-color: rgb(235, 237, 242);
        }
      }
    }
  }
</style>