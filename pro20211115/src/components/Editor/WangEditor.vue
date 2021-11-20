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
      this.editor.customConfig.uploadImgServer = 'https://www.wallbreaker.top/posting/jishiUploadPhotosNew'
      this.editor.create()
      console.log(this.content)
      // if (this.content) {
      //   this.editor.txt.html(this.content)
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
}
</style>
