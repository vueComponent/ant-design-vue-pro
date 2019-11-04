<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <a-spin :spinning="isLoading">
      <a-row class="btns" type="flex" justify="end">
        <a-button type="primary" :loading="isLoading">保存</a-button>
      </a-row>
      <a-row class="content">
        <a-divider orientation="left">Banner</a-divider>
        <a-row class="block-item" type="flex" justify="space-between">
          <a-col class="banner-item" v-for="(item, index) in bannerData" :key="index">
            <a-row class="banner-item-top" type="flex" justify="space-between" align="middle">
              <span class="title">banner{{index+1}}</span>
              <a-upload v-if="item.src" name="file" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange">
                <a-button>
                  <a-icon type="upload" />替换
                </a-button>
              </a-upload>
            </a-row>
            <div class="banner-item-img">
              <img v-if="item.src" :src="item.src">
              <a-upload-dragger v-else name="file" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange">
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
          <quill-editor v-model="text"></quill-editor>
        </a-row>

        <a-divider orientation="left">项目轮播图</a-divider>
        <a-row class="block-item" type="flex" justify="space-between">
          <a-col class="lunbo-item" v-for="(item, index) in lunboData" :key="index">
            <a-row class="lunbo-item-top" type="flex" justify="space-between" align="middle">
              <span class="title">轮播图{{index+1}}</span>
              <a-upload v-if="item.src" name="file" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange">
                <a-button>
                  <a-icon type="upload" />替换
                </a-button>
              </a-upload>
            </a-row>
            <div class="lunbo-item-img">
              <img v-if="item.src" :src="item.src">
              <a-upload-dragger v-else name="file" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange">
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
          </a-col>
        </a-row>

        <a-divider orientation="left">友情链接</a-divider>
        <a-row type="flex" justify="space-between">
          <a-col class="blog-item" v-for="(item, index) in blogData" :key="index">
            <a-row class="blog-item-top" type="flex" justify="space-between" align="middle">
              <span class="title">友情链接{{index+1}}</span>
              <a-upload v-if="item.src" name="file" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange">
                <a-button>
                  <a-icon type="upload" />替换
                </a-button>
              </a-upload>
            </a-row>
            <div class="blog-item-img">
              <img v-if="item.src" :src="item.src">
              <a-upload-dragger v-else name="file" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange">
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
          </a-col>
        </a-row>
      </a-row>
    </a-spin>
  </a-card>
</template>

<script>
  import { getDataList } from '@/api/textGwLb'
  import QuillEditor from '@/components/Editor/QuillEditor'
  export default {
    components: {
      QuillEditor
    },
    data() {
      return {
        bodyStyle: {
          padding: '10px'
        },
        isLoading: false,
        bannerData: [
          { src: require('../../assets/loginBg.jpg') },
          { src: '' },
          { src: '' }
        ],
        text: '',
        lunboData: [
          { src: require('../../assets/loginBg.jpg') },
          { src: '' },
          { src: '' }
        ],
        blogData: [
          { src: require('../../assets/loginBg.jpg') },
          { src: '' },
          { src: '' },
          { src: '' }
        ],
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        // this.isLoading = true
        getDataList().then(res => {
          this.isLoading = false
        })
      },
      handleChange(e) {

      }
    },
  }
</script>

<style lang="less" scoped>
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
  .banner-item {
    width: 450px;
    &-top {
      height: 36px;
    }
    &-img {
      height: 180px;
      margin: 15px 0;
    }
  }
  .lunbo-item {
    width: 350px;
    &-top {
      height: 36px;
    }
    &-img {
      height: 200px;
      margin: 15px 0;
    }
  }
  .blog-item {
    width: 300px;
    &-top {
      height: 36px;
    }
    &-img {
      height: 120px;
      margin: 15px 0;
    }
  }
</style>