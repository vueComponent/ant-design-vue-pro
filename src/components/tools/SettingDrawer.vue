<template>
  <div class="setting-drawer">
    <a-drawer
      width="300"
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="visible"
      :style="{}"
    >
      <div class="setting-drawer-index-content">

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">整体风格设置</h3>

          <div class="setting-drawer-index-blockChecbox">
            <div class="setting-drawer-index-item" @click="changeMenuTheme('dark')">
              <img src="https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg" alt="dark">
              <div class="setting-drawer-index-selectIcon" v-if="theme === 'dark'">
                <a-icon type="check"/>
              </div>
            </div>
            <div class="setting-drawer-index-item" @click="changeMenuTheme('light')">
              <img src="https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg" alt="light">
              <div class="setting-drawer-index-selectIcon" v-if="theme !== 'dark'">
                <a-icon type="check"/>
              </div>
            </div>
          </div>
        </div>

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">主题色</h3>

          <div>
            <a-tooltip class="setting-drawer-theme-color-colorBlock" v-for="(item, index) in colorList" :key="index">
              <template slot='title'>
                {{ item.key }}
              </template>
              <a-tag :color="item.color" @click="changeColor(item)">
                <a-icon type="check" v-if="item.color === colorObj.color"></a-icon>
              </a-tag>
            </a-tooltip>

          </div>
        </div>
      </div>
      <div class="setting-drawer-index-handle" @click="toggle">
        <a-icon type="setting" v-if="!visible"/>
        <a-icon type="close" v-else/>
      </div>
    </a-drawer>
  </div>
</template>

<script>
  import DetailList from '@/components/tools/DetailList'
  import config from '@/defaultConfig'
  import { updateTheme } from '@/components/tools/setting'

  import { mapState } from 'vuex'

  const colorList = [
    {
      key: 'dust',
      color: '#F5222D',
    },
    {
      key: 'volcano',
      color: '#FA541C',
    },
    {
      key: 'sunset',
      color: '#FAAD14',
    },
    {
      key: 'cyan',
      color: '#13C2C2',
    },
    {
      key: 'green',
      color: '#52C41A',
    },
    {
      key: 'daybreak',
      color: '#1890FF',
    },
    {
      key: 'geekblue',
      color: '#2F54EB',
    },
    {
      key: 'purple',
      color: '#722ED1',
    },
  ];

  export default {
    components: {
      DetailList
    },
    data() {
      return {
        visible: true,
        colorList,
      }
    },
    computed: {
      ...mapState({
        theme: state => state.app.theme,
        colorObj: state => state.app.color,
      })
    },
    mounted () {
      const vm = this
      setTimeout(() => {
        vm.visible = false
      }, 1)
      // 当主题色不是默认色时，才进行主题编译
      if (this.colorObj.color !== config.color.color) {
        updateTheme(this.colorObj.color)
      }
    },
    methods: {
      showDrawer() {
        this.visible = true
      },
      onClose() {
        this.visible = false
      },
      toggle() {
        this.visible = !this.visible
      },
      changeMenuTheme(theme) {
        this.$store.dispatch('ToggleTheme', theme)
      },
      changeColor(color) {
        if (this.colorObj.color !== color.color) {
          this.$store.dispatch('ToggleColor', color)
          updateTheme(color.color)
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

  .setting-drawer-index-content {

    .setting-drawer-index-title {
      font-size: 14px;
      color: rgba(0, 0, 0, .85);
      line-height: 22px;
      margin-bottom: 12px;
    }
    .setting-drawer-index-blockChecbox {
      display: flex;

      .setting-drawer-index-item {
        margin-right: 16px;
        position: relative;
        border-radius: 4px;
        cursor: pointer;

        img {
          width: 48px;
        }

        .setting-drawer-index-selectIcon {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          padding-top: 15px;
          padding-left: 24px;
          height: 100%;
          color: #1890ff;
          font-size: 14px;
          font-weight: 700;
        }
      }
    }
    .setting-drawer-theme-color-colorBlock {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      float: left;
      cursor: pointer;
      margin-right: 8px;
      padding-left: 0px;
      padding-right: 0px;
      text-align: center;
      color: #fff;
      font-weight: 700;

      i {
        font-size: 14px;
      }
    }
  }

  .setting-drawer-index-handle {
    position: absolute;
    top: 240px;
    background: #1890ff;
    width: 48px;
    height: 48px;
    right: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    pointer-events: auto;
    z-index: 1001;
    text-align: center;
    font-size: 16px;
    border-radius: 4px 0 0 4px;

    i {
      color: rgb(255, 255, 255);
      font-size: 20px;
    }
  }
</style>