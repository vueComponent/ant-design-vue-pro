<template>
  <a-modal title="患者报告审阅" okText="审阅" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="报告标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['reportTitle']" readOnly />
        </a-form-item>
        <a-form-item label="报告详情" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea rows="3" v-decorator="['reprotDescription']" readOnly />
        </a-form-item>
        <a-form-item label="上报时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker style="width: 100%" format="YYYY-MM-DD" v-decorator="['uploadDate']" disabled />
        </a-form-item>
        <a-form-item label="报告附件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <ul>
            <li v-for="item in imgList" :key="item.id">
              <img :src="`${attachsPrefix}${item.annexAddress}`">
            </li>
          </ul>
        </a-form-item>
        <a-form-item label="反馈意见" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0">
          <a-textarea rows="3" v-decorator="['feedback', requiredRule]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import { getReportInfo, updateReport } from '@/api/reportCheck'
  export default {
    data() {
      return {
        bodyStyle: {
          height: '550px',
          overflow: 'auto'
        },
        maskClosable: false,
        centered: true,
        destroyOnClose: true,
        visible: false,
        confirmLoading: false,
        checkId: '',
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        requiredRule: { rules: [{ required: true, message: '该选项必填' }] },
        attachsPrefix: '',
        imgList: []
      }
    },
    methods: {
      show(id) {
        this.visible = true;
        this.checkId = id

        this.confirmLoading = true

        const params = new FormData()
        params.append('checkId', id)
        getReportInfo(params).then(res => {
          this.confirmLoading = false
          this.imgList = res.data.annexList
          this.attachsPrefix = res.data.attachsPrefix

          this.form.setFieldsValue({
            reportTitle: res.data.reportCheck.reportTitle,
            reprotDescription: res.data.reportCheck.reprotDescription,
            uploadDate: moment(res.data.reportCheck.uploadDate, 'x'),
            feedback: res.data.reportCheck.feedback
          });
        })
      },
      handleSubmit() {
        this.confirmLoading = true
        const { form: { validateFields } } = this;
        validateFields((errors, fieldsValue) => {
          if (errors) {
            this.confirmLoading = false;
            return;
          }
          const params = new FormData()
          params.append('checkId', this.checkId)
          params.append('feedback', fieldsValue['feedback'])
          updateReport(params).then(res => {
            this.$message.success(res.msg);
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok')
          })
        })
      },
      handleCancel() {
        this.visible = false
      }
    }
  }
</script>

<style lang="less" scoped>
  ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
  }
  li {
    list-style: none;
    width: 25%;
    height: 150px;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>