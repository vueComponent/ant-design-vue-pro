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
          :disabled="true"
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
        <a-select v-decorator="['status', {rules: [{ required: true, message: '请选择状态' }], initialValue: '1'}]">
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

      <a-form-item
        v-bind="buttonCol"
      >
        <a-row>
          <a-col span="6">
            <a-button type="primary" html-type="submit">提交</a-button>
          </a-col>
          <a-col span="10">
            <a-button @click="handleGoBack">返回</a-button>
          </a-col>
          <a-col span="8"></a-col>
        </a-row>
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
      buttonCol: {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12, offset: 5 }
        }
      },
      form: this.$form.createForm(this),
      id: 0
    }
  },
  mounted () {
    this.loadEditInfo()
  },
  methods: {
    handleGoBack () {
      // TODO
      // 改为动态组件时应该把这个方法派发出去，交由父组件处理
      this.$router.back()
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    loadEditInfo (data) {
      const { form } = this
      // ajax
      console.log(`将加载 ${this.id} 信息到表单`)
      new Promise((resolve) => {
        setTimeout(resolve, 1500)
      }).then(() => {
        form.setFieldsValue({ no: '1', callNo: '999' })
      })
    }
  }
}
</script>
