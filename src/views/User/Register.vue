<template>
  <div class="main">
    <h3>注册</h3>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item>
        <a-input
          size="large"
          placeholder="邮箱"
          v-decorator="[
            'mail',
            {
              rules: [
                {
                  required: true,
                  message: '请输入邮箱地址！'
                },
                {
                  type: 'email',
                  message: '邮箱地址格式错误！'
                }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item :help="help">
        <a-popover
          :overlayStyle="{ width: '240px' }"
          placement="right"
          :visible="visible"
        >
          <template slot="content">
            <div style="padding: 4px 0">
              <VNodes :vnodes="passwordStatusMap()" />
              <VNodes :vnodes="renderPasswordProgress()" />
              <div style="margin-top: 10">
                请至少输入 6 个字符。请不要使用容易被猜到的密码。
              </div>
            </div>
          </template>
          <a-input
            type="password"
            size="large"
            placeholder="至少6位密码，区分大小写"
            v-decorator="[
              'password',
              {
                rules: [{ validator: this.checkPassword }]
              }
            ]"
          />
        </a-popover>
      </a-form-item>
      <a-form-item>
        <a-input
          type="password"
          size="large"
          placeholder="确认密码"
          v-decorator="[
            'confirm',
            {
              rules: [
                {
                  required: true,
                  message: '请确认密码！'
                },
                {
                  validator: this.checkConfirm
                }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item>
        <a-input-group compact>
          <a-select
            size="large"
            :value="prefix"
            style="width: 20%"
            @change="changePrefix"
          >
            <a-select-option value="86">+86</a-select-option>
            <a-select-option value="87">+87</a-select-option>
          </a-select>
          <a-input
            size="large"
            style="width: 80%"
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
                    pattern: /^\d{11}$/,
                    message: '手机号格式错误！'
                  }
                ]
              }
            ]"
          />
        </a-input-group>
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
            />
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
      <a-form-item>
        <a-button
          size="large"
          class="submit"
          type="primary"
          htmlType="submit"
          :loading="submitting"
          >注册</a-button
        >
        <router-link class="login" to="/user/login">
          使用已有账户登录
        </router-link>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

const passwordProgressMap = {
  ok: "success",
  pass: "normal",
  poor: "exception"
};

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
      count: 0,
      confirmDirty: false,
      visible: false,
      help: "",
      prefix: "86",
      submitting: false
    };
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    ...mapActions("login", ["register"]),
    handleSubmit(e) {
      e.preventDefault();
      const { form } = this;
      form.validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.submitting = true;
          const { prefix } = this;
          this.register({
            ...values,
            prefix
          }).then(() => {
            this.submitting = false;
          });
        }
      });
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
      this.runGetCaptchaCountDown();
    },
    changePrefix(value) {
      this.prefix = value;
    },
    getPasswordStatus() {
      const { form } = this;
      const value = form.getFieldValue("password");
      if (value && value.length > 9) {
        return "ok";
      }
      if (value && value.length > 5) {
        return "pass";
      }
      return "poor";
    },
    passwordStatusMap() {
      const passwordStatusMap = {
        ok: <div class="success">强度：强</div>,
        pass: <div class="warning">强度：中</div>,
        poor: <div class="error">强度：太短</div>
      };
      return passwordStatusMap[this.getPasswordStatus()];
    },
    checkPassword(rule, value, callback) {
      const { visible, confirmDirty } = this;
      if (!value) {
        (this.help = "请输入密码！"),
          (this.visible = !!value),
          callback("error");
      } else {
        this.help = "";
        if (!visible) {
          this.visible = !!value;
        }
        if (value.length < 6) {
          callback("error");
        } else {
          const { form } = this;
          if (value && confirmDirty) {
            form.validateFields(["confirm"], { force: true });
          }
          callback();
        }
      }
    },
    renderPasswordProgress() {
      const { form } = this;
      const value = form.getFieldValue("password");
      const passwordStatus = this.getPasswordStatus();
      return value && value.length ? (
        <div class={`progress-${passwordStatus}`}>
          <a-progress
            status={passwordProgressMap[passwordStatus]}
            class="progress"
            strokeWidth={6}
            percent={value.length * 10 > 100 ? 100 : value.length * 10}
            showInfo={false}
          />
        </div>
      ) : null;
    },
    checkConfirm(rule, value, callback) {
      const { form } = this;
      if (value && value !== form.getFieldValue("password")) {
        callback("两次输入的密码不匹配!");
      } else {
        callback();
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

  /deep/ .ant-form-item {
    margin-bottom: 24px;
  }

  h3 {
    margin-bottom: 20px;
    font-size: 16px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
  }

  .submit {
    width: 50%;
  }

  .login {
    float: right;
    line-height: @btn-height-lg;
  }
}

.success,
.warning,
.error {
  transition: color 0.3s;
}

.success {
  color: @success-color;
}

.warning {
  color: @warning-color;
}

.error {
  color: @error-color;
}

.progress-pass > .progress {
  /deep/ .ant-progress-bg {
    background-color: @warning-color;
  }
}
</style>
