<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loadding">
        <a-tabs>
          <a-tab-pane :tab="$t('lang.menuNoticelconNotice')" key="1">
            <a-list>
              <a-list-item>
                <a-list-item-meta
                  :title="$t('lang.menuNoticelconTitle1')"
                  :description="$t('lang.menuNoticelconTime1')"
                >
                  <a-avatar
                    style="background-color: white"
                    slot="avatar"
                    src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"
                  />
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta
                  :title="$t('lang.menuNoticelconTitle2')"
                  :description="$t('lang.menuNoticelconTime2')"
                >
                  <a-avatar
                    style="background-color: white"
                    slot="avatar"
                    src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"
                  />
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta
                  :title="$t('lang.menuNoticelconTitle3')"
                  :description="$t('lang.menuNoticelconTime3')"
                >
                  <a-avatar
                    style="background-color: white"
                    slot="avatar"
                    src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"
                  />
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane :tab="$t('lang.menuNoticelconNews')" key="2">123</a-tab-pane>
          <a-tab-pane :tab="$t('lang.menuNoticelconWaiting')" key="3">123</a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice">
      <a-badge count="12">
        <a-icon style="font-size: 16px; padding: 4px" type="bell"/>
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
export default {
  name: 'HeaderNotice',
  data() {
    return {
      loadding: false,
      visible: false
    }
  },
  methods: {
    fetchNotice() {
      if (!this.visible) {
        this.loadding = true
        setTimeout(() => {
          this.loadding = false
        }, 2000)
      } else {
        this.loadding = false
      }
      this.visible = !this.visible
    }
  }
}
</script>

<style lang="css">
.header-notice-wrapper {
  top: 50px !important;
}
</style>
<style lang="less" scoped>
.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }
}
</style>
