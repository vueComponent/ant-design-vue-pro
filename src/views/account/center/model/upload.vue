<template>
   <div class="clearfix">
    <a-upload
      name="file"
      :action="url"
      listType="picture-card"
      @preview="handlePreview"
      @change="handleChange"
      @remove="handleRemove"
    >
     <div v-if="fileList.length<1">
        <a-icon type="plus" />
        <div class="ant-upload-text">OCR识别</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import { ocrResult } from '@/api/report';

export default {
  props:{
    basisMaskId:{
      type:[String,Number],
      default:''
    },
    reportCollectBaseId:{
      type:[String,Number],
      default:''
    }
  },
  data() {
    return {
      url: process.env.VUE_APP_API_BASE_URL,
       previewVisible: false,
      previewImage: '',
      fileList:[]
    };
  },
  methods: {
     handleCancel () {
      this.previewVisible = false
    },
    handleRemove(file){
        this.fileList=[]
        console.log("file11",file)
    },
    handlePreview (file) {
      console.log("file",file)
      this.previewImage = file.response.data.src;
      this.previewVisible = true;
    },
    handleChange(info) {
      const that=this;
      const status = info.file.status;
      if (status !== 'uploading') {
      }
      if (status === 'done') {
        const Params = new URLSearchParams();
        if (info.file.response.data.src) {
          that.fileList.push(info.file)
          Params.append('url', info.file.response.data.src);
          Params.append('basisMarkId', that.basisMaskId);
          Params.append('reportCollectBaseId', that.reportCollectBaseId);
          ocrResult(Params).then(res => {
            that.$emit('OCRload', res)
            that.$message.success(`识别成功`);
          });
        }
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    }
  }
};
</script>
<style>
  /* you can make up upload button and sample style by using stylesheets */
  .clearfix{
    display: inline-block;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
