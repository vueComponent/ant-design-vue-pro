<template>
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)">
    </quill-editor>

</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
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
  data () {
    return {
      content: null,
      editorOption: {
        // some quill options
          placeholder: '请输入内容',
      }
    }
  },
  watch: {
    value (val) {
      this.content = val
    }
  },
  methods: {
    onEditorBlur (quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange ({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.$emit('change', html)
    }
  }
}
</script>

<style lang="less" scoped>
  .quill-editor {
    display: flex;
    flex-direction: column;
    height: 300px;
  }
</style>
