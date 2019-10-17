<template>
  <a-modal :title="title" okText="发布" :width="1000" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="文章标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['title', requiredRule]" />
        </a-form-item>
        <a-form-item label="标题配图" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload :fileList="fileList" :action="action" list-type="picture" @preview="handlePreview" @change="handleChange" :remove="handleRemove">
            <div v-if="fileList.length < 1">
              <a-button>
                <a-icon type="upload" />点击上传
              </a-button>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item label="模块类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select style="width: 100%" v-decorator="['type', requiredRule]" placeholder="请选择模块类型">
            <a-select-option value="1">新闻动态</a-select-option>
            <a-select-option value="2">通知公告</a-select-option>
            <a-select-option value="3">科普知识</a-select-option>
            <a-select-option value="4">日常护理</a-select-option>
            <a-select-option value="5">饮食健康</a-select-option>
            <a-select-option value="6">注意事项</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="文章发布人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['publisher', requiredRule]" />
        </a-form-item>
        <a-form-item class="textarea" label="文章内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <quill-editor v-decorator="['text', requiredRule]"></quill-editor> -->
          <a-textarea rows="7" v-decorator="['text', requiredRule]" />
        </a-form-item>
        <a-form-item label="发布终端" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-checkbox-group v-decorator="['terminal', requiredRule]">
            <a-checkbox :value="1">微信端</a-checkbox>
            <a-checkbox :value="2">pc端</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { getWxArticleDetail, addOrEdit, getUrl } from '@/api/text'
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
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        requiredRule: { rules: [{ required: true, message: '该选项必填' }] },
        textId: '',
        action: '',
        attachsPrefix: '',
        previewVisible: false,
        previewImage: '',
        fileList: [],
        fileName: ''
      }
    },
    mounted() {
      getUrl().then(res => {
        this.action = res.data.uploadPicURL
        this.attachsPrefix = res.data.attachsPrefix
      })
    },
    methods: {
      show(id) {
        this.visible = true;
        this.textId = id

        if (id) {
          this.confirmLoading = true
          this.title = '编辑'
          getWxArticleDetail(id).then(res => {
            this.confirmLoading = false
            this.form.setFieldsValue({
              title: res.data.textWx.title,
              type: String(res.data.textWx.type),
              publisher: res.data.textWx.publisher,
              text: res.data.textWx.text,
              terminal: []
            });
            this.fileList = [{
              uid: '1',
              name: '',
              status: 'done',
              url: this.attachsPrefix + res.data.textWx.url
            }]
          })
        } else {
          this.title = '新增'
        }
      },
      handleRemove(file) {
        this.fileList = []
        this.fileName = ''
      },
      handlePreview(file) {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
      },
      handleChange({ file, fileList }) {
        this.fileList = fileList
        this.fileName = file.response.fileName
      },
      handleSubmit() {
        this.confirmLoading = true

        const { form: { validateFields } } = this;

        validateFields((errors, fieldsValue) => {
          if (errors) {
            this.confirmLoading = false;
            return;
          }

          const params = new URLSearchParams()
          const textWx = {
            title: fieldsValue['title'],
            url: this.fileName,
            type: fieldsValue['type'],
            publisher: fieldsValue['publisher'],
            text: fieldsValue['text']
          }
          if (this.textId) {
            textWx.textId = this.textId
          }
          params.append('entity', JSON.stringify(textWx))

          let terminal = fieldsValue['terminal']
          if (terminal.length == 2) {
            terminal = 3
          } else {
            terminal = terminal.join('') == 1 ? 1 : 2
          }
          params.append('terminal', terminal)

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
//   .textarea {
//     /deep/.ant-form-item-control {
//       line-height: 1;
//     }
//   }
</style>