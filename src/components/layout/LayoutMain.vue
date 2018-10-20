<template>
  <a-layout class="layout" :class="device">

    <a-drawer 
      v-if="device === 'mobile'"
      :wrapClassName="'drawer-sider ' + theme"
      placement="left"
      @close="() => this.collapsed = false"
      :closable="false"
      :visible="collapsed"
    >
      <sider-menu
        mode="inline"
        :menus="menus"
        @menuSelect="menuSelect"
        :theme="theme"
        :collapsed="false"
        :collapsible="true"></sider-menu>
    </a-drawer>
    <sider-menu
      v-else
      :menus="menus"
      :theme="theme"
      :mode="menuMode"
      :collapsed="collapsed"
      :collapsible="true"></sider-menu>

    <a-layout>
      <!-- layout header -->
      <layout-header :collapsed="collapsed" :device="device" @toggle="toggle"/>
      <!-- layout content -->
      <a-layout-content :style="{ margin: '24px 24px 0', height: '100%' }">
        <!-- content -->
        <slot/>
      </a-layout-content>

      <a-layout-footer style="padding: 0px">
        <layout-footer/>
      </a-layout-footer>
    </a-layout>

    <setting-drawer></setting-drawer>
  </a-layout>
</template>

<script>
  import SiderMenu from '@/components/menu/SiderMenu'
  import LayoutHeader from './LayoutHeader'
  import LayoutFooter from './LayoutFooter'
  import SettingDrawer from '@/components/tools/SettingDrawer'
  import { mapState, mapActions } from 'vuex'


  export default {
    name: "LayoutView",
    components: {
      SiderMenu,
      LayoutHeader,
      LayoutFooter,
      SettingDrawer
    },
    data() {
      return {
        // light, dark
        menuTheme: 'light',
        // inline, horizontal
        menuMode: 'inline',
        collapsed: false,
        menus: []
      }
    },
    created() {
      this.menus = this.mainMenu
    },
    computed: {
      ...mapState({
        mainMenu: state => state.permission.addRouters,
        sidebarOpened: state => state.app.sidebar.opened,
        theme: state => state.app.theme,
        device: state => state.app.device,
      })
    },
    mounted() {
      this.collapsed = this.sidebarOpened
    },
    methods: {
      ...mapActions(['setSidebar']),
      toggle() {
        this.collapsed = !this.collapsed;
        this.setSidebar(this.collapsed)
      },
      menuSelect() {
        if (this.device !== 'desktop') {
          this.collapsed = false
        }
      }
    }
  }
</script>

<style lang="scss">

  body {
    // 打开滚动条固定显示
    overflow-y: scroll;

    &.userLayout {
      overflow-y: auto;
    }
  }

  .layout {
    min-height: 100vh;
    overflow-x: hidden;

    &.mobile {

      .ant-layout-content {

        .content {
          margin: 24px 0 0;
        }
      }

      .ant-table-wrapper {
        .ant-table-body {
          overflow-y: auto;
        }
      }
    }

    &.ant-layout-has-sider {
      flex-direction: row;
    }

    .trigger {
      font-size: 20px;
      line-height: 64px;
      padding: 0 24px;
      cursor: pointer;
      transition: color .3s;
      &:hover {
        color: #1890ff;
        background: #e6f7ff;
      }
    }

    .header {
      height: 64px;
      padding: 0 12px 0 0;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
      position: relative;

      .user-wrapper {
        float: right;
        height: 100%;

        .action {
          cursor: pointer;
          padding: 0 12px;
          display: inline-block;
          transition: all .3s;
          height: 100%;

          &:hover {
            background: #e6f7ff;
          }

          .avatar {
            margin: 20px 8px 20px 0;
            color: #1890ff;
            background: hsla(0, 0%, 100%, .85);
            vertical-align: middle;
          }

          .icon {
            font-size: 16px;
            padding: 4px;
          }
        }
      }
    }

    // 内容区
    .layout-content {
      margin: 24px 24px 0px;
      height: 100%;
    }

  }

  // drawer-sider 自定义
  .ant-drawer.drawer-sider {
    .sider {
      box-shadow: none;
    }

    &.dark {
      .ant-drawer-content {
        background-color: rgb(0, 21, 41);
      }
    }
    &.light {
      box-shadow: none;
      .ant-drawer-content {
        background-color: #fff;
      }
    }

    .ant-drawer-body {
      padding: 0
    }
  }

  // 菜单样式
  .sider {
    box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
    position: relative;
    z-index: 10;

    .logo {
      height: 64px;
      position: relative;
      line-height: 64px;
      padding-left: 24px;
      -webkit-transition: all .3s;
      transition: all .3s;
      background: #002140;
      overflow: hidden;

      img, h1 {
        display: inline-block;
        vertical-align: middle;
      }

      img {
        height: 32px;
      }

      h1 {
        color: #fff;
        font-size: 20px;
        margin: 0 0 0 12px;
        font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: 600;
      }
    }

    &.light {
      background-color: #fff;
      box-shadow: 2px 0px 8px 0px rgba(29, 35, 41, 0.05);

      .logo {
        background: #fff;
        box-shadow: 1px 1px 0px 0px #e8e8e8;

        h1 {
          color: unset;
        }
      }

      .ant-menu-light {
        border-right-color: transparent;
      }
    }

  }

  // 外置的样式控制
  .user-dropdown-menu-wrapper.ant-dropdown-menu {
    padding: 4px 0;

    .ant-dropdown-menu-item {
      width: 160px;
    }

    .ant-dropdown-menu-item > .anticon:first-child,
    .ant-dropdown-menu-item > a > .anticon:first-child,
    .ant-dropdown-menu-submenu-title > .anticon:first-child
    .ant-dropdown-menu-submenu-title > a > .anticon:first-child {
      min-width: 12px;
      margin-right: 8px;
    }

  }

  // 数据列表 样式
  .table-alert {
    margin-bottom: 16px;
  }

  .table-page-search-wrapper {

    .ant-form-inline {

      .ant-form-item {
        display: flex;
        margin-bottom: 24px;
        margin-right: 0;

        .ant-form-item-control-wrapper {
          flex: 1 1;
          display: inline-block;
          vertical-align: middle;
        }

        >.ant-form-item-label {
          line-height: 32px;
          padding-right: 8px;
          width: auto;
        }
        .ant-form-item-control {
          height: 32px;
          line-height: 32px;
        }
      }
    }

    .table-page-search-submitButtons {
      display: block;
      margin-bottom: 24px;
      white-space: nowrap;
    }

  }

  .content {



    .table-operator {
      margin-bottom: 18px;

      button {
        margin-right: 8px;
      }
    }
  }
</style>