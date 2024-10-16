<template>
  <a-modal :title="title" okText="发布" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="文章标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['title', requiredRule]" />
        </a-form-item>
        <a-form-item label="标题配图" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload v-decorator="[ 'url', { ...requiredRule, valuePropName: 'fileList', getValueFromEvent: normFile }]" :action="action" list-type="picture" @preview="handlePreview" :remove="handleRemove">
            <a-button v-if="!fileName">
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item label="模块类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select style="width: 100%" v-decorator="['type', requiredRule]">
            <a-select-option value="1">新闻动态</a-select-option>
            <a-select-option value="2">通知公告</a-select-option>
            <a-select-option value="3">前沿热点</a-select-option>
            <a-select-option value="4">继教学院</a-select-option>
            <a-select-option value="6">科普文章</a-select-option>
            <a-select-option value="7">患教课件</a-select-option>
            <a-select-option value="8">关于我们</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="文章发布人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['publisher', requiredRule]" />
        </a-form-item>
        <a-form-item class="textarea" label="文章内容" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0">
          <quill-editor v-decorator="['text', { valuePropName: 'value', getValueFromEvent: normEditor }]" :options="editorOption"></quill-editor>
        </a-form-item>
        <a-form-item label="附件上传" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload v-decorator="[ 'annexUrl', { valuePropName: 'fileList', getValueFromEvent: normFile2 }]" :action="action" list-type="text" :remove="handleRemove2">
            <a-button v-if="!fileName2">
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getArticleDetail, addOrEdit } from '@/api/text'
import { quillEditor, Quill } from 'vue-quill-editor'
import Video from '@/utils/quill-video.js'
import 'quill/dist/quill.snow.css'
import quillConfig from '@/utils/quillConfig'
Quill.register(Video, true)
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      editorOption: quillConfig,
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
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      requiredRule: { rules: [{ required: true, message: '该选项必填' }] },
      textId: '',
      previewVisible: false,
      previewImage: '',
      action: process.env.VUE_APP_API_UPLOAD_URL,
      attachsPrefix: process.env.VUE_APP_API_VIEW_PIC_URL,
      fileName: '',
      fileName2: '',
      originalFileName: ''
    }
  },
  methods: {
    show(textId) {
      this.visible = true;
      this.textId = textId;

      if (textId) {
        this.confirmLoading = true
        this.title = '修改文章'
        const params = {
          textId,
          terminal: '2'
        }
        getArticleDetail(params).then(res => {
          this.confirmLoading = false
          this.form.setFieldsValue({
            title: res.data.title,
            type: String(res.data.type),
            publisher: res.data.publisher,
            text: res.data.text
          });
          if (res.data.url) {
            this.form.setFieldsValue({
              url: [{
                uid: '1',
                name: res.data.url,
                status: 'done',
                url: this.attachsPrefix + res.data.url
              }],
            })
          }
          this.fileName = res.data.url
          if (res.data.annexUrl) {
            this.form.setFieldsValue({
              annexUrl: [{
                uid: '2',
                name: res.data.annexUrl,
                status: 'done',
                url: this.attachsPrefix + res.data.annexUrl
              }],
            })
          }
          this.fileName2 = res.data.annexUrl
          this.originalFileName = res.data.originalFileName
        })
      } else {
        this.title = '新增文章'
        this.fileName = ''
        this.fileName2 = ''
        this.originalFileName = ''
      }
    },
    handleChange(e) {
      if (e.target.value) {
        this.form.setFieldsValue({ type: '' })
      }
    },
    normEditor(e) {
      return e && e.html
    },
    normFile(e) {
      if (Array.isArray(e)) {
        return e;
      }
      const isJPG = e.file.type === 'image/jpeg';
      const isPNG = e.file.type === 'image/png';
      if (!(isJPG || isPNG)) {
        this.$message.error('请上传正确的图片格式');
      }
      const isLt1M = e.file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error('图片大小不能超过1MB！');
      }
      if (e.file.status == 'done') {
        this.fileName = e.file.response.fileName
      }
      if ((isJPG || isPNG) && isLt1M) {
        return e && e.fileList;
      }
      return []
    },
    normFile2(e) {
      if (Array.isArray(e)) {
        return e;
      }
      if (e.file.status == 'done') {
        this.fileName2 = e.file.response.fileName
        this.originalFileName = e.file.response.originalFileName
      }
      return e && e.fileList
    },
    handleRemove(file) {
      this.fileName = ''
    },
    handleRemove2(file) {
      this.fileName2 = ''
      this.originalFileName = ''
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleSubmit() {
      this.confirmLoading = true

      const { form: { validateFieldsAndScroll } } = this;

      validateFieldsAndScroll((errors, fieldsValue) => {
        if (errors) {
          this.confirmLoading = false;
          return;
        }

        const params = new FormData()
        const textWx = {
          ...fieldsValue,
          terminal: '2',
          url: this.fileName,
          annexUrl: this.fileName2,
          originalFileName: this.originalFileName
        }
        if (this.textId) {
          textWx.textId = this.textId
        }
        params.append('entity', JSON.stringify(textWx))

        addOrEdit(params).then(res => {
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

/deep/ .ql-editor {
  height: 350px;
}
/deep/ .ql-video[type='file'] {
  display: none;
}
/deep/ .ql-editor .ql-video {
  width: 100%;
}
</style>