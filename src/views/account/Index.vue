<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 0' }">
    <div class="account-settings-info-main">
      <div class="account-settings-info-left">
        <a-menu
          mode="inline"
          :defaultSelectedKeys="['1']"
          type="inner"
          @openChange="onOpenChange"
        >
          <a-menu-item key="1">
            <router-link :to="{ name: 'BaseSettings' }">
              <a-icon type="mail" />
              基本设置
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link :to="{ name: 'SecuritySettings' }">
              <a-icon type="mail" />
              安全设置
            </router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link :to="{ name: 'CustomSettings' }">
              <a-icon type="mail" />
              个性化
            </router-link>
          </a-menu-item>
          <a-menu-item key="4">
            <a-icon type="mail" />
            账户绑定
          </a-menu-item>
          <a-menu-item key="5">
            <a-icon type="mail" />
            新消息通知
          </a-menu-item>
        </a-menu>
      </div>
      <div class="account-settings-info-right">
        <div class="account-settings-info-title">
          <span>{{ $route.meta.title }}</span>
        </div>
        <route-view></route-view>
      </div>
    </div>
  </a-card>
</template>

<script>
  import PageLayout from '@/components/layout/PageLayout'
  import RouteView from "@/components/layout/RouteView";

  export default {
    components: {
      RouteView,
      PageLayout
    },
    data () {
      return {
        // cropper
        preview: {},
        option: {
          img: '/avatar2.jpg',
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
        },

        pageTitle: ''
      }
    },
    created () {

    },
    methods: {
      onOpenChange (openKeys) {

      },
    },
  }
</script>

<style lang="scss" scoped>
  .account-settings-info-main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;

    .account-settings-info-left {
      border-right: 1px solid #e8e8e8;
      width: 224px;
    }

    .account-settings-info-right {
      flex: 1 1;
      padding: 8px 40px;

      .account-settings-info-title {
        color: rgba(0,0,0,.85);
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 12px;
      }
      .account-settings-info-view {
        padding-top: 12px;
      }
    }
  }
</style>