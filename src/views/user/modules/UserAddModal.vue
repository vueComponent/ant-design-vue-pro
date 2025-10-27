<template>
  <a-modal
    title="添加用户"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    okText="确定"
    cancelText="取消"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="会员类型">
          <a-select v-decorator="['userType', { rules: [{ required: true, message: '还未选择会员类型' }] }]" placeholder="请选择">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option value="2">会员</a-select-option>
            <a-select-option value="1">代理商</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="手机号">
          <a-input placeholder="请输入手机号" v-decorator="['userName', { rules: [{ required: true, min: 11, message: '请输入11位手机号码' }] }]" />
        </a-form-item>
        <a-form-item label="登录密码">
          <a-input type="password" placeholder="请输入登录密码" v-decorator="['password', { rules: [{ required: true, min: 8, message: '登录密码最低8位' }] }]" />
        </a-form-item>
        <a-form-item label="确认登录密码">
          <a-input type="password" placeholder="请再次输入登录密码" v-decorator="['repassword', { rules: [{ required: true, min: 8, message: '登录密码最低8位' }] }]" />
        </a-form-item>
        <a-form-item label="支付密码">
          <a-input type="password" placeholder="请输入支付密码(6位数字)" v-decorator="['payPassword', { rules: [{ required: true, len: 6, message: '支付密码必须为6位数字' }] }]" />
        </a-form-item>
        <a-form-item label="确认支付密码">
          <a-input type="password" placeholder="请再次输入支付密码" v-decorator="['repayPassword', { rules: [{ required: true, len: 6, message: '支付密码必须为6位数字' }] }]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
/**
 * 添加用户
 */

import pick from 'lodash.pick'
// 表单字段
const fields = ['description', 'id']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this)
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
