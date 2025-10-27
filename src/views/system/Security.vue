<template>
  <page-header-wrapper :title="false">
    <template v-slot:content>
      1.绑定或修改手机号，请联系超级管理员操作<br>
      2.忘记密码，请联系超级管理员重置
    </template>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-list
        itemLayout="horizontal"
        :dataSource="data"
      >
        <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
          <a-list-item-meta>
            <a slot="title">{{ item.title }}</a>
            <span slot="description">
              <span class="security-list-description">{{ item.description }}</span>
              <span v-if="item.value"> : </span>
              <span class="security-list-value">{{ item.value }}</span>
            </span>
          </a-list-item-meta>
          <template v-if="item.actions">
            <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
          </template>
        </a-list-item>
      </a-list>
    </a-card>
    <create-form
      ref="createModal"
      :visible="visible"
      :model="model"
      @cancel="handleCancel"
      @ok="handleOk"
    />
    <!-- 绑定手机号-->
    <a-modal
      :visible="bindPhoneVisible"
      :width="640"
      title="绑定手机号"
      okText="确定"
      cancel-text="取消"
      @cancel="handleBindPhoneCancel"
      @ok="handleBindPhoneOk"
    >
      <!--表单 并将表单的值绑定到this.from-->
      <a-form :form="form" v-bind="{labelCol: {xs: { span: 24 },sm: { span: 5 }},wrapperCol: {xs: { span: 24 },sm: { span: 17 }}}">
        <!--每一项元素-->
        <a-form-item label="手机号">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-input
                v-decorator="['phoneNumber',{rules: [{ required: true, message: '手机号不能为空' }]}]"
                placeholder="请输入手机号"
              />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="验证码">
          <a-row :gutter="[8]">
            <a-col :span="16">
              <a-input
                v-decorator="['code',{rules: [{ required: true, message: '验证码不能为空' }]}]"
                placeholder="请输入验证码"
              />
            </a-col>
            <a-col :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
              ></a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="超级密码">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-input
                type="password"
                v-decorator="['superPwd',{rules: [{ required: true, message: '超级密码不能为空' }]}]"
                placeholder="请输入超级密码"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 开启短信验证码-->
    <a-modal
      :visible="modifyStateVisible"
      :width="640"
      :title="'短信验证码：' + data[3].actions.title"
      okText="确定"
      cancel-text="取消"
      @cancel="handleModifyStateCancel"
      @ok="handleModifyStateOk"
    >
      <!--表单 并将表单的值绑定到this.from-->
      <a-form :form="form2" v-bind="{labelCol: {xs: { span: 24 },sm: { span: 5 }},wrapperCol: {xs: { span: 24 },sm: { span: 17 }}}">
        <!--每一项元素-->
        <a-form-item label="验证码">
          <a-row :gutter="[8]">
            <a-col :span="16">
              <a-input
                v-decorator="['code',{rules: [{ required: true, message: '验证码不能为空' }]}]"
                placeholder="请输入验证码"
              />
            </a-col>
            <a-col :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
              ></a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="超级密码">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-input
                type="password"
                v-decorator="['superPwd',{rules: [{ required: true, message: '超级密码不能为空' }]}]"
                placeholder="请输入超级密码"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import CreateForm from '@/views/modules/CreateForm'
import { get, modifyPwd, modifySuperPwd, getSmsCode, bindPhoneNumber, modifySecurity } from '@/api/system/security'
export default {
  components: {
    CreateForm
  },
  data () {
    return {
      visible: false,
      model: null,
      bindPhoneVisible: false,
      form: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      modifyStateVisible: false,
      data: [
            { title: '登录密码', description: '', value: '', actions: { title: '修改', callback: () => { this.modifyPwd() } } },
            { title: '超级密码', description: '', value: '', actions: { title: '修改', callback: () => { this.modifySuperPwd() } } },
            { title: '绑定手机号', description: '已绑定手机号', value: '', actions: { title: '', callback: () => { this.bindPhoneNumber() } } },
            { title: '登录短信验证', description: '开启状态', value: '已关闭', actions: { title: '', callback: () => { this.modifyState() } } },
            { title: '异地登录或更换设备需要短信验证', description: '绑定手机号后自动开启，无需设置', value: '', actions: { title: '已开启', callback: () => { } } }
          ]
    }
  },
  computed: {
  },
  created () {
    this.get()
  },
  methods: {
    get () {
      get().then(res => {
        if (res.code === 0) {
          this.data[2].value = res.result.phoneNumber.length === 0 ? '未绑定' : res.result.phoneNumber
          this.data[2].actions.title = res.result.phoneNumber.length === 0 ? '绑定' : ''
          if (res.result.security === true) {
            this.data[3].value = '已开启'
            this.data[3].actions.title = '关闭'
          } else {
            this.data[3].value = '已关闭'
            this.data[3].actions.title = '开启'
          }
        }
      })
    },
    modifyPwd () {
      this.visible = true
      this.model = {
        title: '修改登录密码',
        data: [
           {
            label: '',
            formItemShow: true,
            item: [
              {
                formType: 'input',
                decorator: ['mode', { initialValue: 'modifyPwd' }]
              }
            ]
          },
          {
            label: '旧密码',
            item: [
              {
                formType: 'input',
                decorator: ['oldPassword', { rules: [{ required: true, message: '旧密码不能为空' }] }],
                type: 'password',
                placeholder: '请输入旧密码'
              }
            ]
          },
          {
            label: '新密码',
            item: [
              {
                formType: 'input',
                decorator: ['newPassword', { rules: [{ required: true, message: '新密码不能为空' }] }],
                type: 'password',
                placeholder: '请输入新密码'
              }
            ]
          },
          {
            label: '确认密码',
            item: [
              {
                formType: 'input',
                decorator: ['reNewPassword', { rules: [{ required: true, message: '确认密码不能为空' }] }],
                type: 'password',
                placeholder: '请输入确认密码'
              }
            ]
          }
        ]
      }
    },
    // 修改超级密码
    modifySuperPwd () {
      this.visible = true
      this.model = {
        title: '修改超级密码',
        data: [
          {
            label: '',
            formItemShow: true,
            item: [
              {
                formType: 'input',
                decorator: ['mode', { initialValue: 'modifySuperPwd' }]
              }
            ]
          },
          {
            label: '旧密码',
            item: [
              {
                formType: 'input',
                decorator: ['oldPassword', { rules: [{ required: true, message: '旧密码不能为空' }] }],
                type: 'password',
                placeholder: '请输入旧密码'
              }
            ]
          },
          {
            label: '新密码',
            item: [
              {
                formType: 'input',
                decorator: ['newPassword', { rules: [{ required: true, message: '新密码不能为空' }] }],
                type: 'password',
                placeholder: '请输入新密码'
              }
            ]
          },
          {
            label: '确认密码',
            item: [
              {
                formType: 'input',
                decorator: ['reNewPassword', { rules: [{ required: true, message: '确认密码不能为空' }] }],
                type: 'password',
                placeholder: '请输入确认密码'
              }
            ]
          }
        ]
      }
    },
    handleCancel () {
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      this.visible = false
    },
    handleOk () {
      const form = this.$refs.createModal.form
      form.validateFields((err, values) => {
        if (!err) {
          if (values.newPassword !== values.reNewPassword) {
            this.$message.error('确认密码不一致')
            return
          }
          if (values.mode === 'modifyPwd') {
            modifyPwd(values).then(response => {
              if (response.code === 0) {
                this.$message.success('操作成功')
                form.resetFields() // 清理表单数据（可不做）
                this.visible = false
              } else {
                this.$message.error(response.message)
              }
            }).catch(error => {
              this.$message.error(error + '')
            })
          } else if (values.mode === 'modifySuperPwd') {
            modifySuperPwd(values).then(response => {
              if (response.code === 0) {
                this.$message.success('操作成功')
                form.resetFields() // 清理表单数据（可不做）
                this.visible = false
              } else {
                this.$message.error(response.message)
              }
            }).catch(error => {
              this.$message.error(error + '')
            })
          }
        }
      })
    },
    // 绑定手机号
    bindPhoneNumber () {
      this.bindPhoneVisible = true
    },
    handleBindPhoneCancel () {
      this.bindPhoneVisible = false
    },
    handleBindPhoneOk () {
      const form = this.form
      form.validateFields((err, values) => {
        if (!err) {
          bindPhoneNumber(values).then(response => {
            if (response.code === 0) {
              this.$message.success('操作成功')
              form.resetFields() // 清理表单数据（可不做）
              this.get()
              this.bindPhoneVisible = false
            } else {
              this.$message.error(response.message)
            }
          }).catch(error => {
            this.$message.error(error + '')
          })
        }
      })
    },
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this
      validateFields(['phoneNumber'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true
          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)
          getSmsCode({ phoneNumber: values.phoneNumber }).then(res => {
            if (res.code === 0) {
              this.$message.success('发送成功')
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
            // alert(err)
            // setTimeout(hide, 1)
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
            this.requestFailed(err)
          })
        }
      })
    },
    requestFailed (err) {
      this.isLoginError = true
      const msg = err.msg || '请求出现错误，请稍后再试'
      this.message = msg
      this.$notification['error']({
        message: '错误',
        description: msg,
        duration: 4
      })
    },
    // 修改状态
    modifyState () {
      this.modifyStateVisible = true
    },
    handleModifyStateCancel () {
      this.modifyStateVisible = false
    },
    handleModifyStateOk () {
      const form = this.form2
      form.validateFields((err, values) => {
        if (!err) {
          modifySecurity(values).then(response => {
            if (response.code === 0) {
              this.$message.success('操作成功')
              form.resetFields() // 清理表单数据（可不做）
              this.get()
              this.modifyStateVisible = false
            } else {
              this.$message.error(response.message)
            }
          }).catch(error => {
            this.$message.error(error + '')
          })
        }
      })
    }
  }
}
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 150px;
  height: 150px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
