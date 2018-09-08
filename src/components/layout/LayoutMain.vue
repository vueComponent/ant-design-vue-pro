<template>
  <a-layout class="layout">

    <sider-menu :menus="menus" :theme="menuTheme" v-if="menuMode === 'inline'" :mode="menuMode" :collapsed="!siderOpen || collapsed" :collapsible="true"></sider-menu>

    <a-layout>
      <!-- layout header -->
      <layout-header :collapsed="collapsed" @toggle="toggle">

      </layout-header>
      <!-- layout content -->
      <a-layout-content :style="{ margin: '24px 24px 0', height: '100%' }">
        <!-- content -->
        <slot></slot>
      </a-layout-content>

      <a-layout-footer style="padding: 0px">
        <layout-footer/>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
  import SiderMenu from '@/components/menu/SiderMenu'
  import LayoutHeader from './LayoutHeader'
  import LayoutFooter from './LayoutFooter'
  import {asyncRouterMap} from '@/router/index'
  import { mapState } from 'vuex'

  export default {
    name: "LayoutView",
    components: {
      SiderMenu,
      LayoutHeader,
      LayoutFooter
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
      this.menus = asyncRouterMap
    },
    computed: {
      ...mapState({
        siderOpen: state => state.app.sidebar.opened
      })
    },
    methods: {
      toggle() {
        this.collapsed = !this.collapsed;
      },
    }
  }
</script>

<style lang="scss">

  html {
    // 打开滚动条固定显示
    overflow-y: scroll;
  }

  .layout {
    min-height: 100vh;
    overflow-x: hidden;

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
          font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
          font-weight: 600;
        }
      }

      &.light {
        background-color: #fff;
        box-shadow: 2px 0px 8px 0px rgba(29,35,41,0.05);

        .logo {
          background: #fff;
          box-shadow: 1px 1px 0px 0px #e8e8e8;

          h1 {
            color: #1890ff;
          }
        }

        .ant-menu-light {
          border-right-color: transparent;
        }
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
</style>