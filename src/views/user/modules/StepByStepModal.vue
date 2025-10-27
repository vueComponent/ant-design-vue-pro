<template>
  <a-modal
    title="分步对话框"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-steps :current="currentStep" :style="{ marginBottom: '28px' }" size="small">
        <a-step title="基本信息" />
        <a-step title="配置规则属性" />
        <a-step title="设定调度周期" />
      </a-steps>
      <a-form :form="form">
        <!-- step1 -->
        <div v-show="currentStep === 0">
          <a-form-item
            label="规则名称"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['name', {rules: [{required: true}]}]" />
          </a-form-item>
          <a-form-item
            label="规则描述"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-textarea :rows="4" v-decorator="['desc', {rules: [{required: true}]}]"></a-textarea>
          </a-form-item>
        </div>
        <div v-show="currentStep === 1">
          <a-form-item
            label="监控对象"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select v-decorator="['target', {initialValue: 0, rules: [{required: true}]}]" style="width: 100%">
              <a-select-option :value="0">表一</a-select-option>
              <a-select-option :value="1">表二</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="规则模板"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select v-decorator="['template', { initialValue: 0, rules: [{required: true}]}]" style="width: 100%">
              <a-select-option :value="0">规则模板一</a-select-option>
              <a-select-option :value="1">规则模板二</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="规则类型"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-radio-group v-decorator="['type', {initialValue: 0, rules: [{required: true}]}]" style="width: 100%">
              <a-radio :value="0">强</a-radio>
              <a-radio :value="1">弱</a-radio>
            </a-radio-group>
          </a-form-item>
        </div>

        <div v-show="currentStep === 2">
          <a-form-item
            label="开始时间"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-date-picker v-decorator="['time', {rules: [{ type: 'object', required: true, message: 'Please select time!' }]}]" style="width: 100%" />
          </a-form-item>
          <a-form-item
            label="调度周期"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select v-decorator="['frequency', { initialValue: 'month', rules: [{required: true}]}]" style="width: 100%">
              <a-select-option value="month">月</a-select-option>
              <a-select-option value="week">周</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <!-- step1 end -->
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="backward" v-if="currentStep > 0" :style="{ float: 'left' }" >上一步</a-button>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleNext(currentStep)">{{ currentStep === 2 && '完成' || '下一步' }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

const stepForms = [
  ['name', 'desc'],
  ['target', 'template', 'type'],
  ['time', 'frequency']
]

export default {
  name: 'StepByStepModal',
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
      currentStep: 0,
      mdl: {},

      form: this.$form.createForm(this)
    }
  },
  methods: {
    edit (record) {
      this.visible = true
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, []))
      })
    },
    handleNext (step) {
      const { form: { validateFields } } = this
      const currentStep = step + 1
      if (currentStep <= 2) {
        // stepForms
        validateFields(stepForms[ this.currentStep ], (errors, values) => {
          if (!errors) {
            this.currentStep = currentStep
          }
        })
        return
      }
      // last step
      this.confirmLoading = true
      validateFields((errors, values) => {
        console.log('errors:', errors, 'val:', values)
        if (!errors) {
          console.log('values:', values)
          setTimeout(() => {
            this.confirmLoading = false
            this.$emit('ok', values)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    backward () {
      this.currentStep--
    },
    handleCancel () {
      // clear form & currentStep
      this.visible = false
      this.currentStep = 0
    }
  }
}
</script>
