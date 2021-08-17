<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="付款账户"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          placeholder="ant-design@alipay.com"
          v-decorator="['paymentUser', { rules: [{required: true, message: '付款账户必须填写'}] }]">
          <a-select-option value="1">ant-design@alipay.com</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="收款账户"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-group
          style="display: inline-block; vertical-align: middle"
          :compact="true"
        >
          <a-select defaultValue="alipay" style="width: 100px">
            <a-select-option value="alipay">支付宝</a-select-option>
            <a-select-option value="wexinpay">微信</a-select-option>
          </a-select>
          <a-input
            :style="{width: 'calc(100% - 100px)'}"
            v-decorator="['payType', { initialValue: 'test@example.com', rules: [{required: true, message: '收款账户必须填写'}]}]"
          />
        </a-input-group>
      </a-form-item>
      <a-form-item
        label="收款人姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['name', { initialValue: 'Alex', rules: [{required: true, message: '收款人名称必须核对'}] }]"/>
      </a-form-item>
      <a-form-item
        label="转账金额"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input prefix="￥" v-decorator="['momey', { initialValue: '5000', rules: [{required: true, message: '转账金额必须填写'}] }]"/>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
    <div class="step-form-style-desc">
      <h3>说明</h3>
      <h4>转账到支付宝账户</h4>
      <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
      <h4>转账到银行卡</h4>
      <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step1',
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$emit('nextStep')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
