<template>
    <a-layout class="layout">
        <a-layout-sider
                class="sider"
                :trigger="null"
                :width="256"
                collapsible
                v-model="collapsed">
            <div class="logo">
                <router-link :to="{name:'dashboard'}">
                    <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMHB4IiB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNDcuMSAoNDU0MjIpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPkdyb3VwIDI4IENvcHkgNTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNjIuMTAyMzI3MyUiIHkxPSIwJSIgeDI9IjEwOC4xOTcxOCUiIHkyPSIzNy44NjM1NzY0JSIgaWQ9ImxpbmVhckdyYWRpZW50LTEiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNDI4NUVCIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMyRUM3RkYiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI2OS42NDQxMTYlIiB5MT0iMCUiIHgyPSI1NC4wNDI4OTc1JSIgeTI9IjEwOC40NTY3MTQlIiBpZD0ibGluZWFyR3JhZGllbnQtMiI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMyOUNERkYiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzE0OEVGRiIgb2Zmc2V0PSIzNy44NjAwNjg3JSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMEE2MEZGIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNjkuNjkwODE2NSUiIHkxPSItMTIuOTc0MzU4NyUiIHgyPSIxNi43MjI4OTgxJSIgeTI9IjExNy4zOTEyNDglIiBpZD0ibGluZWFyR3JhZGllbnQtMyI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGQTgxNkUiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0Y3NEE1QyIgb2Zmc2V0PSI0MS40NzI2MDYlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGNTFEMkMiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI2OC4xMjc5ODcyJSIgeTE9Ii0zNS42OTA1NzM3JSIgeDI9IjMwLjQ0MDA5MTQlIiB5Mj0iMTE0Ljk0MjY3OSUiIGlkPSJsaW5lYXJHcmFkaWVudC00Ij4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0ZBOEU3RCIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRjc0QTVDIiBvZmZzZXQ9IjUxLjI2MzUxOTElIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGNTFEMkMiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0ibG9nbyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwLjAwMDAwMCwgLTIwLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMjgtQ29weS01IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMC4wMDAwMDAsIDIwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTI3LUNvcHktMyI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTI1IiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iMiI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTEuNTg4MDg2Myw0LjE3NjUyODIzIEw0LjE3OTk2NTQ0LDkxLjUxMjc3MjggQy0wLjUxOTI0MDYwNSw5Ni4yMDgxMTQ2IC0wLjUxOTI0MDYwNSwxMDMuNzkxODg1IDQuMTc5OTY1NDQsMTA4LjQ4NzIyNyBMOTEuNTg4MDg2MywxOTUuODIzNDcyIEM5Ni4yODcyOTIzLDIwMC41MTg4MTQgMTAzLjg3NzMwNCwyMDAuNTE4ODE0IDEwOC41NzY1MSwxOTUuODIzNDcyIEwxNDUuMjI1NDg3LDE1OS4yMDQ2MzIgQzE0OS40MzM5NjksMTU0Ljk5OTYxMSAxNDkuNDMzOTY5LDE0OC4xODE5MjQgMTQ1LjIyNTQ4NywxNDMuOTc2OTAzIEMxNDEuMDE3MDA1LDEzOS43NzE4ODEgMTM0LjE5MzcwNywxMzkuNzcxODgxIDEyOS45ODUyMjUsMTQzLjk3NjkwMyBMMTAyLjIwMTkzLDE3MS43MzczNTIgQzEwMS4wMzIzMDUsMTcyLjkwNjAxNSA5OS4yNTcxNjA5LDE3Mi45MDYwMTUgOTguMDg3NTM1OSwxNzEuNzM3MzUyIEwyOC4yODU5MDgsMTAxLjk5MzEyMiBDMjcuMTE2MjgzMSwxMDAuODI0NDU5IDI3LjExNjI4MzEsOTkuMDUwNzc1IDI4LjI4NTkwOCw5Ny44ODIxMTE4IEw5OC4wODc1MzU5LDI4LjEzNzg4MjMgQzk5LjI1NzE2MDksMjYuOTY5MjE5MSAxMDEuMDMyMzA1LDI2Ljk2OTIxOTEgMTAyLjIwMTkzLDI4LjEzNzg4MjMgTDEyOS45ODUyMjUsNTUuODk4MzMxNCBDMTM0LjE5MzcwNyw2MC4xMDMzNTI4IDE0MS4wMTcwMDUsNjAuMTAzMzUyOCAxNDUuMjI1NDg3LDU1Ljg5ODMzMTQgQzE0OS40MzM5NjksNTEuNjkzMzEgMTQ5LjQzMzk2OSw0NC44NzU2MjMyIDE0NS4yMjU0ODcsNDAuNjcwNjAxOCBMMTA4LjU4MDU1LDQuMDU1NzQ1OTIgQzEwMy44NjIwNDksLTAuNTM3OTg2ODQ2IDk2LjI2OTI2MTgsLTAuNTAwNzk3OTA2IDkxLjU4ODA4NjMsNC4xNzY1MjgyMyBaIiBpZD0iU2hhcGUiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMSkiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05MS41ODgwODYzLDQuMTc2NTI4MjMgTDQuMTc5OTY1NDQsOTEuNTEyNzcyOCBDLTAuNTE5MjQwNjA1LDk2LjIwODExNDYgLTAuNTE5MjQwNjA1LDEwMy43OTE4ODUgNC4xNzk5NjU0NCwxMDguNDg3MjI3IEw5MS41ODgwODYzLDE5NS44MjM0NzIgQzk2LjI4NzI5MjMsMjAwLjUxODgxNCAxMDMuODc3MzA0LDIwMC41MTg4MTQgMTA4LjU3NjUxLDE5NS44MjM0NzIgTDE0NS4yMjU0ODcsMTU5LjIwNDYzMiBDMTQ5LjQzMzk2OSwxNTQuOTk5NjExIDE0OS40MzM5NjksMTQ4LjE4MTkyNCAxNDUuMjI1NDg3LDE0My45NzY5MDMgQzE0MS4wMTcwMDUsMTM5Ljc3MTg4MSAxMzQuMTkzNzA3LDEzOS43NzE4ODEgMTI5Ljk4NTIyNSwxNDMuOTc2OTAzIEwxMDIuMjAxOTMsMTcxLjczNzM1MiBDMTAxLjAzMjMwNSwxNzIuOTA2MDE1IDk5LjI1NzE2MDksMTcyLjkwNjAxNSA5OC4wODc1MzU5LDE3MS43MzczNTIgTDI4LjI4NTkwOCwxMDEuOTkzMTIyIEMyNy4xMTYyODMxLDEwMC44MjQ0NTkgMjcuMTE2MjgzMSw5OS4wNTA3NzUgMjguMjg1OTA4LDk3Ljg4MjExMTggTDk4LjA4NzUzNTksMjguMTM3ODgyMyBDMTAwLjk5OTg2NCwyNS42MjcxODM2IDEwNS43NTE2NDIsMjAuNTQxODI0IDExMi43Mjk2NTIsMTkuMzUyNDQ4NyBDMTE3LjkxNTU4NSwxOC40Njg1MjYxIDEyMy41ODUyMTksMjAuNDE0MDIzOSAxMjkuNzM4NTU0LDI1LjE4ODk0MjQgQzEyNS42MjQ2NjMsMjEuMDc4NDI5MiAxMTguNTcxOTk1LDE0LjAzNDAzMDQgMTA4LjU4MDU1LDQuMDU1NzQ1OTIgQzEwMy44NjIwNDksLTAuNTM3OTg2ODQ2IDk2LjI2OTI2MTgsLTAuNTAwNzk3OTA2IDkxLjU4ODA4NjMsNC4xNzY1MjgyMyBaIiBpZD0iU2hhcGUiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMikiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTUzLjY4NTYzMywxMzUuODU0NTc5IEMxNTcuODk0MTE1LDE0MC4wNTk2IDE2NC43MTc0MTIsMTQwLjA1OTYgMTY4LjkyNTg5NCwxMzUuODU0NTc5IEwxOTUuOTU5OTc3LDEwOC44NDI3MjYgQzIwMC42NTkxODMsMTA0LjE0NzM4NCAyMDAuNjU5MTgzLDk2LjU2MzYxMzMgMTk1Ljk2MDUyNyw5MS44Njg4MTk0IEwxNjguNjkwNzc3LDY0LjcxODExNTkgQzE2NC40NzIzMzIsNjAuNTE4MDg1OCAxNTcuNjQ2ODY4LDYwLjUyNDE0MjUgMTUzLjQzNTg5NSw2NC43MzE2NTI2IEMxNDkuMjI3NDEzLDY4LjkzNjY3NCAxNDkuMjI3NDEzLDc1Ljc1NDM2MDcgMTUzLjQzNTg5NSw3OS45NTkzODIxIEwxNzEuODU0MDM1LDk4LjM2MjM3NjUgQzE3My4wMjM2Niw5OS41MzEwMzk2IDE3My4wMjM2NiwxMDEuMzA0NzI0IDE3MS44NTQwMzUsMTAyLjQ3MzM4NyBMMTUzLjY4NTYzMywxMjAuNjI2ODQ5IEMxNDkuNDc3MTUsMTI0LjgzMTg3IDE0OS40NzcxNSwxMzEuNjQ5NTU3IDE1My42ODU2MzMsMTM1Ljg1NDU3OSBaIiBpZD0iU2hhcGUiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMykiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPGVsbGlwc2UgaWQ9IkNvbWJpbmVkLVNoYXBlIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTQpIiBjeD0iMTAwLjUxOTMzOSIgY3k9IjEwMC40MzY2ODEiIHJ4PSIyMy42MDAxOTI2IiByeT0iMjMuNTgwNzg2Ij48L2VsbGlwc2U+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==" alt="logo">
                    <h1>Ant Design Pro</h1>
                </router-link>
            </div>

            <s-navmenu></s-navmenu>

        </a-layout-sider>

        <a-layout>
            <!-- layout header -->
            <a-layout-header style="padding: 0px;">
                <div class="header">
                    <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click.native="toggle"/>
                    <div class="user-wrapper">
                        <span class="action">
                            <a-icon type="question-circle-o"></a-icon>
                        </span>
                        <span class="action">
                          <a-badge count="12">
                            <a-icon class="icon" type="bell"></a-icon>
                          </a-badge>
                        </span>
                        <a-dropdown>
                            <span class="action ant-dropdown-link user-dropdown-menu">
                              <a-avatar class="avatar" size="small" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                              <span>Sendya</span>
                            </span>
                            <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
                                    <a-menu-item key="0">
                                        <a href="javascript:;">
                                            <a-icon type="user"/>
                                            <span>个人中心</span>
                                        </a>
                                    </a-menu-item>
                                    <a-menu-item key="1">
                                        <a href="javascript:;">
                                            <a-icon type="setting" />
                                            <span>账户设置</span>
                                        </a>
                                    </a-menu-item>
                                    <a-menu-item key="2" disabled>
                                        <a-icon type="setting" />
                                        <span>测试</span>
                                    </a-menu-item>
                                    <a-menu-divider />
                                    <a-menu-item key="3">
                                        <a href="javascript:;">
                                            <a-icon type="logout" />
                                            <span>退出登录</span>
                                        </a>
                                    </a-menu-item>
                                </a-menu>
                        </a-dropdown>
                    </div>
                </div>
            </a-layout-header>
            <!-- layout content -->
            <a-layout-content class="layout-content">
                <div style="margin: -24px -24px 0px;">
                    <!-- pageHeader , route meta hideHeader:true on hide -->
                    <div class="pageHeader" v-if="!$route.meta.hideHeader">

                        <s-breadcrumb></s-breadcrumb>

                        <div class="detail">
                            <div class="main">
                                <div class="row">
                                    <h1 class="title" v-text="$route.meta.title"></h1>
                                </div>
                                <div class="row"></div>
                            </div>
                        </div>
                    </div>

                    <keep-alive v-if="$route.meta.keepAlive">
                        <router-view></router-view>
                    </keep-alive>
                    <router-view v-else></router-view>
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
import NavMenu from '@/components/NavMenu'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: "Layout",
  components: {
    "s-navmenu": NavMenu,
    "s-breadcrumb": Breadcrumb
  },
  data() {
    return {
      collapsed: false,
    }
  },
  created () {

  },
  methods: {
    toggle() {
      this.collapsed = !this.collapsed;
    }
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
            font-size: 18px;
            line-height: 64px;
            padding: 0 24px;
            cursor: pointer;
            transition: color .3s;
            &:hover {
                color: #1890ff;
                background: #e6f7ff;
            }
        }

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
                font-family: "Myriad Pro","Helvetica Neue",Arial,Helvetica,sans-serif;
                font-weight: 600;
            }
        }

        .sider {
            box-shadow: 2px 0 6px rgba(0,21,41,.35);
        }

        .header {
            height: 64px;
            padding: 0 12px 0 0;
            background: #fff;
            box-shadow: 0 1px 4px rgba(0,21,41,.08);
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
                        background: hsla(0,0%,100%,.85);
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

            .pageHeader {
                background: #fff;
                padding: 16px 32px 0;
                border-bottom: 1px solid #e8e8e8;

                .breadcrumb {
                    margin-bottom: 16px;
                }
                .detail {
                    display: flex;

                    .main {
                        width: 100%;
                        .row {
                            display: flex;
                            width: 100%;
                        }
                    }
                    .title {
                        font-size: 20px;
                        font-weight: 500;
                    }
                }
                .title {
                    margin-bottom: 16px;
                    flex: auto;
                }
            }

            .content {
                margin: 24px 24px 0;

                .ant-card {
                    min-height: 400px;
                }
            }

        }

    }

    // 外置的样式控制
    .user-dropdown-menu-wrapper {
        padding: 4px 0;

        .ant-dropdown-menu-item {
            width: 160px;
        }

    }

    // 数据列表 样式
    .tableList {

        .table-search {

            &.open-more-condition {
                .more-condition {
                    display: block;
                }
            }

            .more-condition {
                display: none;
            }

            .ant-form-item {
                display: flex;
                margin-bottom: 24px;

                &>.ant-form-item-label {
                    flex: unset;
                }

                .ant-form-item-control-wrapper {
                    flex: 1 1;
                }
            }
        }

        .ant-alert, .table-operator {
            margin-bottom: 16px;
        }

    }
</style>