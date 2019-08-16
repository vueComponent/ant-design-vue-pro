

<template>
  <div>
     <p class="formSubtitle">{{formSubtitle}} <span @click="show"></span></p>
      <a-upload-dragger name="file" :multiple="true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange">
       <p class="ant-upload-drag-icon">
         <a-icon type="inbox" />
       </p>
       <p class="ant-upload-text">Click or drag file to this area to upload</p>
       <p class="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
     </a-upload-dragger>
  </div>
 
</template>
<script>
export default {
  name:"dagger",
  props:{
    formSubtitle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShow:false
    }
  },
  methods: {
    handleChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    show(){
      this.isShow=!this.isShow
    }
  },
}
</script>