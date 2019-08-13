<template>
  <a-modal
    title="新建规则"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="姓名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['name',{rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item
          label="身份证号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['card', {rules: [{required: true,min:18}]}]" />
        </a-form-item>
        <a-form-item
          label="性别"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
        <a-radio-group v-decorator="['sex', {initialValue: 1, rules: [{required: true}]}]" style="width: 100%">
          <a-radio :value="0">男</a-radio>
          <a-radio :value="1">女</a-radio>
        </a-radio-group>
        </a-form-item>
         </a-form-item>
        <a-form-item
          label="身份证号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-date-picker
          style="width: 100%"
          showTime
          format="YYYY-MM-DD"
          placeholder="请选择"
          v-decorator="['birthday',{rules: [{required: true}]}]"
        />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
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
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this)
    }
  },
  methods: {
    add () {
      this.visible = true
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
