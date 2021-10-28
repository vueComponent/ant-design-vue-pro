<template>
  <a-modal :title="options.title" :width="400" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :destroyOnClose="destroyOnClose" :centered="centered" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <div style="color: red; margin-bottom: 10px; text-align: center; font-size: 17px;">请务必确保填写数据的真实性和准确性</div>
      <a-form :form="form">
        <a-form-item label="提交人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['submitName', requiredRule]" />
        </a-form-item>
        <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['submitTelephone', { rules: [ { required: true, validator: phoneValid }] }]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import moment from 'moment';
import _ from 'lodash';
export default {
  data() {
    return {
      options: {},
      residences: [],
      nationList: [],
      professionList: [],
      censusList: [],
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      maskClosable: false,
      payTypeList: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      agrWrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 18,
          offset: 6
        }
      },
      visible: false,
      confirmLoading: false,
      centered: true,
      destroyOnClose: true,
      bodyStyle: {
        height: '200px',
        overflow: 'auto'
      },
      form: this.$form.createForm(this),
      requiredRule: { rules: [{ required: true, message: '该选项必填！' }] },
      patientId: undefined
    };
  },
  methods: {
    phoneValid(rule, value, callback) {
      if (!value) {
        callback('该选项必填！')
        return
      } else if (!/^\d{11}$/.test(value)) {
        callback('请输入正确的手机号！')
        return
      }
      callback()
    },
    add() {
      this.options.title = '填写提交信息'
      this.visible = true
    },
    handleSubmit() {
      this.confirmLoading = true
      this.form.validateFieldsAndScroll((errors, fieldsValue) => {
        const that = this;
        if (errors) {
          this.confirmLoading = false
          return
        }
        const values = {
          ...fieldsValue
        };
        that.visible = false
        that.confirmLoading = false
        that.$emit('ok', values);
      });
    },
    handleCancel() {
      this.visible = false
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ant-form-item:last-child {
  margin-bottom: 0;
}
</style>