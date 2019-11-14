<template>
  <quill-editor ref="myQuillEditor" v-model="content" :options="editorOption"></quill-editor>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.snow.css'
  import quillConfig from '@/utils/quillConfig'
  export default {
    name: 'QuillEditor',
    components: {
      quillEditor
    },
    props: {
      value: {
        type: String
      }
    },
    data() {
      return {
        content: null,
        editorOption: quillConfig
      }
    },
    watch: {
      value(val) {
        this.content = val
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    methods: {
      onEditorBlur(quill) {
        console.log('editor blur!', quill)
      },
      onEditorFocus(quill) {
        console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        console.log('editor ready!', quill)
      },
      onEditorChange({ quill, html, text }) {
        console.log('editor change!', quill, html, text)
        this.$emit('change', html)
      }
    }
  }
</script>

<style lang="less" scoped>
  .ql-editor {
    height: 350px;
  }
</style>
