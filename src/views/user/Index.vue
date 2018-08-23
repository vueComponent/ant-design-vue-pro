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

  export default {
    name: "Index",
    components: {
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
  }
</script>

<style scoped>

</style>