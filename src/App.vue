<template>
  <a-locale-provider :locale="locale">
  <div id="app">
    <router-view/>
  </div>
  </a-locale-provider>
</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import enquireScreen from '@/utils/device'

  export default {
    data () {
      return {
        locale: zhCN,
      }
    },
    created () {
      let that = this
      enquireScreen(isMobile => {
        if (isMobile) {
          that.$store.commit('app/TOGGLE_DEVICE', true)
        } else {
          that.$store.commit('app/TOGGLE_SIDEBAR', true)
        }

      })
    }
  }
</script>
<style>
  #app {
    height: 100%;
  }
</style>