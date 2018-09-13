<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
    <div class="account-settings-info-main">
      <div class="account-settings-info-left">
        <a-menu
          mode="inline"
          :style="{ border: '0' }"
          :defaultSelectedKeys="defaultSelectedKeys"
          type="inner"
          @openChange="onOpenChange"
        >
          <a-menu-item key="/account/settings/base">
            <router-link :to="{ name: 'BaseSettings' }">
              基本设置
            </router-link>
          </a-menu-item>
          <a-menu-item key="/account/settings/security">
            <router-link :to="{ name: 'SecuritySettings' }">
              安全设置
            </router-link>
          </a-menu-item>
          <a-menu-item key="/account/settings/custom">
            <router-link :to="{ name: 'CustomSettings' }">
              个性化
            </router-link>
          </a-menu-item>
          <a-menu-item key="/account/settings/binding">
            <router-link :to="{ name: 'BindingSettings' }">
              账户绑定
            </router-link>
          </a-menu-item>
          <a-menu-item key="/account/settings/notification">
            <router-link :to="{ name: 'NotificationSettings' }">
              新消息通知
            </router-link>
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
        defaultSelectedKeys: [],

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
      this.updateMenu()
    },
    methods: {
      onOpenChange (openKeys) {

      },
      updateMenu () {
        let routes = this.$route.matched.concat()
        this.defaultSelectedKeys = [ routes.pop().path ]
      }
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