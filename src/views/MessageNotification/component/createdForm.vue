<template>
  <a-modal
    :title="options.title"
    :width="800"
    :bodyStyle="bodyStyle"
    :maskClosable="maskClosable"
    :destroyOnClose="destroyOnClose"
    :centered="centered"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入标题" v-decorator="['title', isIdCardNo]" />
        </a-form-item>
        <a-form-item label="发送内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="textarea" rows="6" v-decorator="['content', requiredRule]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { saveOrUpdateData } from '@/api/message'
export default {
  data () {
    return {
      options: {},
      residences: [],
      nationList: [],
      professionList: [],
      censusList: [],
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      maskClosable: false,
      payTypeList: [],
      isShowPat: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      visible: false,
      confirmLoading: false,
      centered: true,
      destroyOnClose: true,
      bodyStyle: {
        height: '300px',
        overflow: 'auto'
      },
      form: this.$form.createForm(this),
      requiredRule: { rules: [{ required: true, message: '该选项必填！' }] },
      isIdCardNo: { rules: [{ required: true, message: '该选项必填！' }] },
      announcementId: ''
    }
  },
  created () {},
  methods: {
    add () {
      this.options.title = '新建消息'
      this.patientId = ''
      this.visible = true
    },
    edit (value) {
      this.options.title = '编辑消息'
      this.announcementId = value.announcementId
      setTimeout(() => {
        this.form.setFieldsValue({
          title: value.title,
          content: value.content
        })
      }, 0)
      this.visible = true
    },
    handleSubmit () {
      if (!this.confirmLoading) {
        this.confirmLoading = true
        this.form.validateFieldsAndScroll((errors, fieldsValue) => {
          const that = this
          if (errors) {
            this.confirmLoading = false
            return
          }
          const values = {
            ...fieldsValue,
            announcementId: this.announcementId
          }
          console.log(values)
          saveOrUpdateData(values).then((res) => {
            console.log(res)
            that.visible = false
            that.confirmLoading = false
            that.$message.success(res.msg)
            that.$emit('ok', values)
          })
        })
      }
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-form-item:last-child {
  margin-bottom: 0;
}

/deep/ .aaa .ant-form-item-label {
  position: relative;
  left: -18px;
}

.aaa .ant-form-item-children > i {
  position: absolute !important;
  left: -22px !important;
  top: 4px;
}
</style>