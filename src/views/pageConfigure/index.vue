<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <a-spin :spinning="isLoading">
      <a-row class="btns" type="flex" justify="end">
        <a-button type="primary" :loading="isLoading" @click="save">保存</a-button>
      </a-row>
      <a-row class="content">
        <a-divider orientation="left">Banner</a-divider>
        <a-row class="block-item" type="flex" justify="space-between">
          <a-col class="banner-item" v-for="(item, index) in bannerData" :key="index">
            <a-row class="banner-item-top" type="flex" justify="space-between" align="middle">
              <span class="title">banner{{index+1}}</span>
              <a-upload v-if="item.src" :beforeUpload="(res)=>beforeUpload(res,index)" :showUploadList="false" :action="action" @change="handleBannerChange">
                <a-button>
                  <a-icon type="upload" />替换
                </a-button>
              </a-upload>
            </a-row>
            <div class="banner-item-img" :class="item.src ? 'active' : ''">
              <img v-if="item.src" :src="attachsPrefix + item.src">
              <a-upload-dragger v-else :beforeUpload="(res)=>beforeUpload(res,index)" :showUploadList="false" :action="action" @change="handleBannerChange">
                <p class="ant-upload-drag-icon">
                  <a-icon type="upload" />
                </p>
                <p class="ant-upload-text">上传图片</p>
              </a-upload-dragger>
            </div>
            <a-row type="flex" align="middle">
              <span class="tip-icon"></span>
              <span>文件尺寸1100*400px，小于1MB</span>
            </a-row>
          </a-col>
        </a-row>

        <a-divider orientation="left">项目介绍</a-divider>
        <a-row class="block-item">
          <quill-editor v-model="text" :options="editorOption"></quill-editor>
        </a-row>

        <a-divider orientation="left">项目轮播图</a-divider>
        <a-row class="block-item" type="flex" justify="space-between">
          <a-col class="lunbo-item" v-for="(item, index) in lunboData" :key="index">
            <a-row class="lunbo-item-top" type="flex" justify="space-between" align="middle">
              <span class="title">轮播图{{index+1}}</span>
              <a-upload v-if="item.src" :beforeUpload="(res)=>beforeUpload(res,index)" :showUploadList="false" :action="action" @change="handleLunboChange">
                <a-button>
                  <a-icon type="upload" />替换
                </a-button>
              </a-upload>
            </a-row>
            <div class="lunbo-item-img" :class="item.src ? 'active' : ''">
              <img v-if="item.src" :src="attachsPrefix + item.src">
              <a-upload-dragger v-else :beforeUpload="(res)=>beforeUpload(res,index)" :showUploadList="false" :action="action" @change="handleLunboChange">
                <p class="ant-upload-drag-icon">
                  <a-icon type="upload" />
                </p>
                <p class="ant-upload-text">上传图片</p>
              </a-upload-dragger>
            </div>
            <a-row type="flex" align="middle">
              <span class="tip-icon"></span>
              <span>文件尺寸320*240px，小于500KB</span>
            </a-row>
            <a-row style="margin-top:10px">
              <a-input v-model="item.remake" placeholder="填写图片说明" />
            </a-row>
          </a-col>
        </a-row>

        <a-divider orientation="left">友情链接</a-divider>
        <a-row type="flex" justify="space-between">
          <a-col class="blog-item" v-for="(item, index) in blogData" :key="index">
            <a-row class="blog-item-top" type="flex" justify="space-between" align="middle">
              <span class="title">友情链接{{index+1}}</span>
              <a-upload v-if="item.url" :beforeUpload="(res)=>beforeUpload(res,index)" :showUploadList="false" :action="action" @change="handleBlogChange">
                <a-button>
                  <a-icon type="upload" />替换
                </a-button>
              </a-upload>
            </a-row>
            <div class="blog-item-img" :class="item.url ? 'active' : ''">
              <img v-if="item.url" :src="attachsPrefix + item.url">
              <a-upload-dragger v-else :beforeUpload="(res)=>beforeUpload(res,index)" :showUploadList="false" :action="action" @change="handleBlogChange">
                <p class="ant-upload-drag-icon">
                  <a-icon type="upload" />
                </p>
                <p class="ant-upload-text">上传图片</p>
              </a-upload-dragger>
            </div>
            <a-row type="flex" align="middle">
              <span class="tip-icon"></span>
              <span>文件尺寸320*240px，小于500KB</span>
            </a-row>
            <a-row style="margin-top:10px">
              <a-input v-model="item.link" placeholder="链接地址" />
            </a-row>
          </a-col>
        </a-row>
      </a-row>
    </a-spin>
  </a-card>
</template>

<script>
  import { getDataList, saveData } from '@/api/textGwLb'
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.snow.css'
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],                                        // remove formatting button
    ['link', 'image']
  ]
  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        bodyStyle: {
          padding: '10px'
        },
        isLoading: false,
        bannerData: [
          { src: '' },
          { src: '' },
          { src: '' }
        ],
        text: '',
        editorOption: {
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
            }
          }
        },
        lunboData: [
          { src: '', remake: '' },
          { src: '', remake: '' },
          { src: '', remake: '' }
        ],
        blogData: [
          { src: '', link: '' },
          { src: '', link: '' },
          { src: '', link: '' },
          { src: '', link: '' }
        ],
        activeIndex: 0,
        action: process.env.VUE_APP_API_UPLOAD_URL,
        attachsPrefix: process.env.VUE_APP_API_VIEW_PIC_URL,
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        this.isLoading = true
        getDataList().then(res => {
          this.isLoading = false

          this.bannerData[0].src = res.data.textGwLb.topUrl1
          this.bannerData[1].src = res.data.textGwLb.topUrl2
          this.bannerData[2].src = res.data.textGwLb.topUrl3
          this.lunboData[0].src = res.data.textGwLb.projectUrl1
          this.lunboData[1].src = res.data.textGwLb.projectUrl2
          this.lunboData[2].src = res.data.textGwLb.projectUrl3
          this.lunboData[0].remake = res.data.textGwLb.url1Remake
          this.lunboData[1].remake = res.data.textGwLb.url2Remake
          this.lunboData[2].remake = res.data.textGwLb.url3Remake
          this.text = res.data.textGwLb.text

          res.data.textGwLbDetailList.forEach((item, index) => {
            this.blogData[index].url = item.url
            this.blogData[index].link = item.link
          })
        })
      },
      beforeUpload(file, index) {
        this.activeIndex = index
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        if (!(isJPG || isPNG)) {
          this.$message.error('只能上传jpg或png格式的图片！');
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          this.$message.error('图片大小不能超过1MB！');
        }
        return (isJPG || isPNG) && isLt1M;
      },
      handleBannerChange(info) {
        if (info.file.status === 'done') {
          this.bannerData[this.activeIndex].src = info.file.response.fileName
        }
      },
      handleLunboChange(info) {
        if (info.file.status === 'done') {
          this.lunboData[this.activeIndex].src = info.file.response.fileName
        }
      },
      handleBlogChange(info) {
        if (info.file.status === 'done') {
          this.blogData[this.activeIndex].url = info.file.response.fileName
        }
      },
      save() {
        const params = new FormData()
        const textGwLb = {
          textId: 1,
          top_url1: this.bannerData[0].src,
          top_url2: this.bannerData[1].src,
          top_url3: this.bannerData[2].src,
          text: this.text,
          project_url1: this.lunboData[0].src,
          url1Remake: this.lunboData[0].remake,
          project_url2: this.lunboData[1].src,
          url2Remake: this.lunboData[1].remake,
          project_url3: this.lunboData[2].src,
          url3Remake: this.lunboData[2].remake,
        }
        params.append('textGwLb', JSON.stringify(textGwLb))
        params.append('entity', JSON.stringify(this.blogData))

        this.isLoading = true
        saveData(params).then(res => {
          this.isLoading = false
          this.$message.success(res.msg)
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  /deep/ .quill-editor {
    display: flex;
    flex-direction: column;
    height: 350px;
  }
  /deep/ .ant-spin-nested-loading > div > .ant-spin {
    max-height: inherit;
  }
  /deep/ .ant-divider-horizontal.ant-divider-with-text-left {
    margin: 10px 0;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .btns {
    padding-bottom: 10px;
  }
  .content {
    height: 780px;
    padding: 0 20px 20px;
    overflow: auto;
  }
  .block-item {
    margin-bottom: 80px;
  }
  .title {
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    font-weight: bold;
    border-left: 5px solid #1890ff;
    padding-left: 5px;
  }
  .tip-icon {
    width: 16px;
    height: 20px;
    background-image: url('../../assets/tip-icon.png');
    background-size: 100% 100%;
    margin-right: 5px;
  }
  .active {
    // border: 2px solid #40a9ff;
    border: 2px solid rgba(64, 169, 255, 0.6);
    padding: 5px;
  }
  .banner-item {
    width: 450px;
    &-top {
      height: 36px;
    }
    &-img {
      height: 170px;
      margin: 15px 0;
    }
  }
  .lunbo-item {
    width: 350px;
    &-top {
      height: 36px;
    }
    &-img {
      height: 250px;
      margin: 15px 0;
    }
  }
  .blog-item {
    width: 300px;
    &-top {
      height: 36px;
    }
    &-img {
      height: 130px;
      margin: 15px 0;
    }
  }
</style>