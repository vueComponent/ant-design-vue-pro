<template>
  <a-modal :title="title" okText="保存" :width="1000" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="医生姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['doctorName', requiredRule]" placeholder="请输入医生姓名" />
        </a-form-item>
        <a-form-item label="头像上传" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload v-decorator="[ 'url', { ...requiredRule, valuePropName: 'fileList', getValueFromEvent: normFile }]" :action="action" list-type="picture" @preview="handlePreview" :remove="handleRemove">
            <a-button v-if="!isFileLen">
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
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
          <quill-editor v-decorator="['detail', requiredRule]"></quill-editor>
          <!-- <a-textarea rows="5" v-decorator="['detail', requiredRule]" placeholder="请输入医生简介" /> -->
        </a-form-item>
        <a-form-item label="擅长领域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['disease', requiredRule]" placeholder="请输入擅长领域" />
        </a-form-item>
        <a-form-item class="textarea" label="获得荣誉" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <quill-editor v-decorator="['honor', requiredRule]"></quill-editor>
          <!-- <a-textarea rows="8" v-decorator="['honor', requiredRule]" placeholder="请输入获得荣誉" /> -->
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
  import { getDoctorDetail, saveDoctor, getCenter } from '@/api/famousDoctor'
  import QuillEditor from '@/components/Editor/QuillEditor'
  export default {
    components: {
      QuillEditor
    },
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
        creatorId: '',
        previewVisible: false,
        previewImage: '',
        action: process.env.VUE_APP_API_UPLOAD_URL,
        attachsPrefix: process.env.VUE_APP_API_VIEW_PIC_URL,
        fileName: '',
        isFileLen: false
      }
    },
    mounted() {
      this.getCenterList()
    },
    methods: {
      show(id) {
        this.visible = true

        this.doctorId = id

        if (id) {
          this.title = '编辑'
          this.confirmLoading = true

          const params = new FormData()
          params.append('doctorDetailId', id)
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
            if (res.data.annexList[0].annexAddress) {
              this.form.setFieldsValue({
                url: [{
                  uid: '1',
                  name: res.data.annexList[0].annexAddress,
                  status: 'done',
                  url: this.attachsPrefix + res.data.annexList[0].annexAddress
                }],
              })
            }
            this.fileName = res.data.annexList[0].annexAddress
            this.isFileLen = true
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
      normFile(e) {
        if (Array.isArray(e)) {
          return e;
        }
        const isJPG = e.file.type === 'image/jpeg';
        const isPNG = e.file.type === 'image/png';
        if (!(isJPG || isPNG)) {
          this.$message.error('请上传正确的图片格式');
        } else {
          if (e.file.status == 'done') {
            this.fileName = e.file.response.fileName
            this.isFileLen = true
          }
          return e && e.fileList;
        }
      },
      handleRemove(file) {
        this.fileName = ''
        this.isFileLen = false
      },
      handlePreview(file) {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
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
              doctorName: fieldsValue['doctorName'],
              job: fieldsValue['job'],
              department: fieldsValue['department'],
              centerId: fieldsValue['centerId'],
              detail: fieldsValue['detail'],
              disease: fieldsValue['disease'],
              honor: fieldsValue['honor'],
              isUser: Number(fieldsValue['isUser'])
            },
            fileName: this.fileName
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