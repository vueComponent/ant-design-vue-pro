<template>
  <div :class="prefixCls">
    <div ref="editor" class="editor-wrapper"></div>
  </div>
</template>

<script>
import WEditor from 'wangeditor'

export default {
  name: 'WangEditor',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-wang'
    },
    // eslint-disable-next-line
    value: {
      type: String
    },
    content: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      editor: null,
      editorContent: null
    }
  },
  watch: {
    value (val) {
      this.editorContent = val
      this.editor.txt.html(val)
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      console.log('yyy')
      const that = this
      this.editor = new WEditor(this.$refs.editor)
      console.log(this.content)
      // this.editor.txt.html(this.content)
      // this.editor.onchangeTimeout = 200
      // this.editor.customConfig.onchange = (html) => {
      //   this.editorContent = html
      //   this.$emit('change', this.editorContent)
      // }
      this.editor.customConfig.onchange = function (newHtml) {
        // console.log('change 之后最新的 html', newHtml)
        that.$emit('editorChange', newHtml)
      }
      // editor.config.uploadImgServer = '/upload-img'
      this.editor.customConfig.uploadImgServer = process.env.VUE_APP_API_FULL_URL+'posting/jishiUploadPhotosNew'
      // this.editor.customConfig.uploadImgServer = 'http://localhost:8080/posting/jishiUploadPhotosNew'

      this.editor.customConfig.uploadFileName = 'files'
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 控制图片大小
      this.editor.customConfig.onchangeTimeout = this.changeInterval
      this.editor.customConfig.uploadImgTimeout = 10*1000
      // 可使用监听函数在上传图片的不同阶段做相应处理
      this.editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function (xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        fail: function (xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function (xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function (xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          result.data.forEach((result) => {
            const url = result.url
            insertImg(url)
          })
          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      }
      this.editor.create()
      console.log(this.content)
      // if (this.content) {
      //   this.editor.txt.html(this.content)
      // }
    }
  }
}
</script>

<style lang="less">
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
}
.w-e-toolbar{
  z-index: 1 !important;
}
.w-e-text-container{
  z-index: 1 !important;
}
.w-e-menu{
  z-index: 2 !important;
}
</style>
