<template>
  <div>
    <quill-editor ref="newEditor" v-model="content" :options="editorOption"></quill-editor>
    <!-- <a-upload :action="action" ref="uniqueId" id="uniqueId" style="display:none" @change="handleChange"></a-upload> -->
  </div>
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
    data() {
      return {
        // action: 'http://www.dtp-cloud.com:18780/file-server/file/uploadFile',
        content: null,
        editorOption: {
          // some quill options
          placeholder: '请输入内容',
          //   modules: {
          //     toolbar: {
          //       container: [
          //         ['bold', 'italic', 'underline', 'strike'],
          //         ['blockquote', 'code-block'],
          //         [{ 'header': 1 }, { 'header': 2 }],
          //         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          //         [{ 'script': 'sub' }, { 'script': 'super' }],
          //         [{ 'indent': '-1' }, { 'indent': '+1' }],
          //         [{ 'direction': 'rtl' }],
          //         [{ 'size': ['small', false, 'large', 'huge'] }],
          //         [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          //         [{ 'color': [] }, { 'background': [] }],
          //         [{ 'font': [] }],
          //         [{ 'align': [] }],
          //         ['clean'],
          //         ['link', 'image', 'video']
          //       ],
          //       handlers: {
          //         'image': val => {
          //           var fileInput = document.querySelector('#uniqueId') //隐藏的file元素
          //           fileInput.click() //触发事件
          //         }
          //       }
          //     }
          //   }
        }
      }
    },
    // methods: {
    //   handleChange(info) {
    //     console.log('info=>', info)
    //     let quill = this.$refs.newEditor.quill
    //     // // 获取光标所在位置
    //     let length = this.quill.getSelection().index;
    //     // // 插入图片 res.info为服务器返回的图片地址
    //     this.quill.insertEmbed(length, 'image', info.file.response.data.src)
    //     // // 调整光标到最后
    //     this.quill.setSelection(length + 1)
    //     console.log(this.quill)
    //   }
    // },
    watch: {
      value(val) {
        this.content = val
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
