<template>
  <layout-main>

    <page-layout :avatar="avatar">
      <div slot="headerContent">
        <div class="title">{{ timeFix }}，{{ user.name }}，{{ welcome }}</div>
        <div>You are not alone.</div>
      </div>
      <div slot="extra">
        <a-row>
          <a-col :sm="8" :xs="24">
            <head-info title="可用节点" content="16" :bordered="true"/>
          </a-col>
          <a-col :sm="8" :xs="24">
            <head-info title="高级节点" content="7/16" :bordered="true"/>
          </a-col>
          <a-col :sm="8" :xs="24">
            <head-info title="剩余流量" content="2,23Gb"/>
          </a-col>
        </a-row>
      </div>

      <a-card>
        <a-form>
          <a-row :gutter="24" :style="{ marginBottom: '24px' }">
            <a-col :sm="12" :xs="24" :style="{ height: '250px' }">
              <vue-cropper
                style="width: 300px;position: absolute; left: 50%"
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="option.info"
                :autoCrop="option.autoCrop"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :fixedBox="option.fixedBox"
                @realTime="realTime"
              >
              </vue-cropper>
            </a-col>
            <a-col :sm="12" :xs="24" :style="{ height: '250px' }">
              <div class="ant-upload-preview">
                <img :src="preview.url" :style="preview.img"/>
              </div>
            </a-col>
          </a-row>

          <a-form-item
            label="昵称"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
          >
            <a-input placeholder="给自己起个名字" />
          </a-form-item>
          <a-form-item
            label="Bio"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
          >
            <a-textarea rows="4" placeholder="You are not alone."/>
          </a-form-item>

          <a-form-item
            label="电子邮件"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
            :required="false"
          >
            <a-input placeholder="exp@admin.com"/>
          </a-form-item>
          <a-form-item
            label="加密方式"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
            :required="false"
          >
            <a-select defaultValue="aes-256-cfb">
              <a-select-option value="aes-256-cfb">aes-256-cfb</a-select-option>
              <a-select-option value="aes-128-cfb">aes-128-cfb</a-select-option>
              <a-select-option value="chacha20">chacha20</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="连接密码"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
            :required="false"
          >
            <a-input placeholder="h3gSbecd"/>
          </a-form-item>
          <a-form-item
            label="登陆密码"
            :labelCol="{span: 7}"
            :wrapperCol="{span: 10}"
            :required="false"
          >
            <a-input placeholder="密码"/>
          </a-form-item>

          <a-form-item :wrapperCol="{span: 10, offset: 7}">
            <a-button type="primary">提交</a-button>
            <a-button style="margin-left: 8px">保存</a-button>
          </a-form-item>
        </a-form>
      </a-card>

    </page-layout>

  </layout-main>
</template>

<script>
  import {timeFix, welcome} from "../../utils/util"
  import LayoutMain from '@/components/layout/LayoutMain'
  import PageLayout from '@/components/layout/PageLayout'

  import HeadInfo from '@/components/tools/HeadInfo'
  import ASelect from "ant-design-vue/es/select";
  import AForm from "ant-design-vue/es/form/Form";
  import VueCropper from "vue-cropper/example/src/vue-cropper/vue-cropper";

  export default {
    name: "Index",
    components: {
      VueCropper,
      AForm,
      ASelect,
      LayoutMain,
      PageLayout,
      HeadInfo
    },
    data () {
      return {
        timeFix: timeFix(),
        welcome: welcome(),
        avatar: '',
        user: {},

        // cropper
        preview: {},
        option: {
          img: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 180,
          autoCropHeight: 180,
          fixedBox: true,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1]
        }
      }
    },
    computed: {
      userInfo() {
        return this.$store.getters.userInfo
      }
    },
    created() {
      this.user = this.userInfo
      this.avatar = this.userInfo.avatar
    },
    methods: {

      realTime (data) {
        this.preview = data
      }
    }
  }
</script>

<style lang="scss" scoped>
  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    position: absolute;
    top: 50%;
    left: 15%;
    margin-top: -90px;
    overflow: hidden;
  }
</style>