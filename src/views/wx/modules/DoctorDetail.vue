<template>
  <a-modal :title="title" okText="保存" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="医生姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['doctorName', requiredRule]" placeholder="请输入医生姓名" />
        </a-form-item>
        <a-form-item label="职称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['job', requiredRule]" placeholder="请输入职称" />
        </a-form-item>
        <a-form-item label="科室" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['department', requiredRule]" placeholder="请输入科室" />
        </a-form-item>
        <a-form-item label="所属中心" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['centerId',  requiredRule]" placeholder="请选择模块类型">
            <template v-for="item in centerList">
              <a-select-option :value="item.centerId" :key="item.centerId">{{item.name}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item class="textarea" label="医生简介" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <quill-editor v-decorator="['detail', requiredRule]"></quill-editor> -->
          <a-textarea rows="5" v-decorator="['detail', requiredRule]" placeholder="请输入医生简介" />
        </a-form-item>
        <a-form-item class="textarea" label="擅长领域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <quill-editor v-decorator="['disease', requiredRule]"></quill-editor> -->
          <a-input v-decorator="['disease', requiredRule]" placeholder="请输入擅长领域" />
        </a-form-item>
        <a-form-item class="textarea" label="获得荣誉" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <quill-editor v-decorator="['honor', requiredRule]"></quill-editor> -->
          <a-textarea rows="8" v-decorator="['honor', requiredRule]" placeholder="请输入获得荣誉" />
        </a-form-item>
        <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['isUser', requiredRule]">
            <a-radio value="1">启用</a-radio>
            <a-radio value="0">停用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import { getDoctorDetail, saveDoctor, getCenter } from '@/api/famousDoctor'
  //   import QuillEditor from '@/components/Editor/QuillEditor'
  export default {
    // components: {
    //   QuillEditor
    // },
    data() {
      return {
        title: '',
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
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 }
        },
        requiredRule: { rules: [{ required: true, message: '该选项必填' }] },
        doctorId: '',
        centerList: [],
        creatorId: ''
      }
    },
    methods: {
      show(id) {
        this.visible = true

        this.getCenterList()

        this.doctorId = id

        if (id) {
          this.title = '编辑'
          this.confirmLoading = true

          const params = {
            doctorDetailId: id
          }
          getDoctorDetail(params).then(res => {
            this.confirmLoading = false

            this.creatorId = res.data.doctorDetail.creatorId
            this.form.setFieldsValue({
              doctorName: res.data.doctorDetail.doctorName,
              job: res.data.doctorDetail.job,
              department: res.data.doctorDetail.department,
              centerId: res.data.doctorDetail.centerId,
              detail: res.data.doctorDetail.detail,
              disease: res.data.doctorDetail.disease,
              honor: res.data.doctorDetail.honor,
              isUser: String(res.data.doctorDetail.isUser)
            });
          })
        } else {
          this.title = '新增'
        }
      },
      getCenterList() {
        getCenter().then(res => {
          this.centerList = res.data.centerList
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
          const params = {
            doctorDetail: {
              ...this.form.getFieldsValue(),
              isUser: Number(fieldsValue['isUser'])
            }
          }

          if (this.doctorId) {
            params.doctorDetail.doctorDetailId = this.doctorId
            params.doctorDetail.creatorId = this.creatorId
          }

          saveDoctor(params).then(res => {
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
  .textarea {
    /deep/.ant-form-item-control {
      line-height: 1;
    }
  }
</style>