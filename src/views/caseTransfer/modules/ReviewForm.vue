<template>
  <a-modal title="病例转移审核" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="申请单号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['distractCode']" readOnly />
        </a-form-item>
        <a-form-item label="档案号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['fileCode']" readOnly />
        </a-form-item>
        <a-form-item label="患者姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['patientName']" readOnly />
        </a-form-item>
        <a-form-item label="身份号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['card']" readOnly />
        </a-form-item>
        <a-form-item label="申请中心" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['centerName']" readOnly />
        </a-form-item>
        <a-form-item label="申请时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker style="width: 100%" format="YYYY-MM-DD" v-decorator="['createDate']" disabled />
        </a-form-item>
        <a-form-item label="申请理由" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['reason']" readOnly />
        </a-form-item>
        <a-form-item label="审核" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['executeStatus', requiredRule]">
            <a-radio value="1">通过</a-radio>
            <a-radio value="0">驳回</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('executeStatus') == 0" label="驳回理由" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea rows="3" v-decorator="['rejectionReason', requiredRule]" placeholder="请输入驳回理由" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { verifyDistract } from '@/api/distract'
  export default {
    data() {
      return {
        bodyStyle: {
          height: '500px',
          overflow: 'auto'
        },
        maskClosable: false,
        centered: true,
        destroyOnClose: true,
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        targetCenterId: '',
        distractId: '',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 }
        },
        requiredRule: { rules: [{ required: true, message: '该选项必填' }] },

      }
    },
    methods: {
      show(recode) {
        this.visible = true;
        this.confirmLoading = false;
        this.targetCenterId = recode.targetCenterId
        this.distractId = recode.distractId
        this.$nextTick(() => {
          this.form.setFieldsValue(recode);
        })
      },
      handleSubmit() {
        this.confirmLoading = true;

        const { form: { validateFields } } = this;

        validateFields((errors, fieldsValue) => {
          const that = this;
          if (errors) {
            this.confirmLoading = false;
            return;
          }
          const params = new FormData();
          const distract = {
            ...this.form.getFieldsValue(),
            targetCenterId: this.targetCenterId,
            distractId: this.distractId,
            createDate: fieldsValue['createDate'].format('YYYY-MM-DD')
          }
          params.append('distract', JSON.stringify(distract))
          verifyDistract(params).then(res => {
            that.$message.success(res.msg);
            that.visible = false;
            that.confirmLoading = false;
            that.$emit('ok')
          })
        })
      },
      handleCancel() {
        this.visible = false
      }
    },
  }
</script>

<style lang="less" scoped>
  /deep/ .ant-form-item:last-child {
    margin-bottom: 0;
  }
</style>