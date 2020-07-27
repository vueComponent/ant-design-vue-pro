<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="任务名称"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-input v-decorator="['title', {rules:[{required: true, message: '请输入任务名称'}]}]" />
    </a-form-item>
    <a-form-item
      label="开始时间"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-date-picker
        style="width: 100%"
        valueFormat="YYYY-MM-DD HH:mm"
        v-decorator="['startAt', {rules:[{required: true, message: '请选择开始时间'}]}]"
      />
    </a-form-item>
    <a-form-item
      label="任务负责人"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-select v-decorator="['owner', {rules:[{required: true, message: '请选择开始时间'}]}]">
        <a-select-option :value="0">付晓晓</a-select-option>
        <a-select-option :value="1">周毛毛</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="产品描述"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-textarea v-decorator="['description']"></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'

const fields = ['title', 'startAt', 'owner', 'description']

export default {
  name: 'TaskForm',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this)
    }
  },
  mounted () {
    this.record && this.form.setFieldsValue(pick(this.record, fields))
  },
  methods: {
    onOk () {
      console.log('监听了 modal ok 事件')
      return new Promise(resolve => {
        resolve(true)
      })
    },
    onCancel () {
      console.log('监听了 modal cancel 事件')
      return new Promise(resolve => {
        resolve(true)
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
        }
      })
    }
  }
}
</script>
