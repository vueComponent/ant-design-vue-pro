<template>
  <div>
    <a-form :form="form" @submit="handleSubmit">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="规则编号"
        hasFeedback
        validateStatus="success"
      >
        <a-input
          placeholder="规则编号"
          v-decorator="[
            'no',
            {rules: [{ required: true, message: '请输入规则编号' }]}
          ]"
        ></a-input>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="服务调用次数"
        hasFeedback
        validateStatus="success"
      >
        <a-input-number :min="1" style="width: 100%" v-decorator="['callNo', {rules: [{ required: true }]}]" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="状态"
        hasFeedback
        validateStatus="warning"
      >
        <a-select defaultValue="1" v-decorator="['status', {rules: [{ required: true, message: '请选择状态' }]}]">
          <a-select-option value="1">Option 1</a-select-option>
          <a-select-option value="2">Option 2</a-select-option>
          <a-select-option value="3">Option 3</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述"
        hasFeedback
        help="请填写一段描述"
      >
        <a-textarea :rows="5" placeholder="..." v-decorator="['description', {rules: [{ required: true }]}]" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="更新时间"
        hasFeedback
        validateStatus="error"
      >
        <a-date-picker
          style="width: 100%"
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="Select Time"
        />
      </a-form-item>

    </a-form>
  </div>
</template>

<script>
export default {
  name: 'TableEdit',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      form: null,
      id: 0
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    }
  },
  methods: {
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    loadEditInfo () {
      const { from } = this
      // ajax
      console.log(`将加载 ${this.id} 信息到表单`)
      new Promise((resolve) => {
        setTimeout(resolve, 1500)
      }).then(() => {
        from.setFieldsValue({ no: '1', callNo: '999' })
      })
    }
  },
  watch: {
    id (val, oldVal) {
      console.log('val', val, 'oldVal', oldVal)
      this.loadEditInfo()
    }
  }
}
</script>
