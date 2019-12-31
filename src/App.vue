<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
// 此处导入3钟语言，如果需要其它语言，自行导入
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW'
import enUs from 'ant-design-vue/lib/locale-provider/en_US'
import ptBR from 'ant-design-vue/lib/locale-provider/pt_BR'
import { AppDeviceEnquire } from '@/utils/mixin'
import { mapState } from 'vuex'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      locale (state) {
        switch (state.i18n.lang) {
          case 'zh-CN': return zhCN
          case 'zh-TW': return zhTW
          case 'en-US': return enUs
          case 'pt-BR': return ptBR
        }
      }
    })
  },
  mounted () {
  }
}
</script>
<style>
  #app {
    height: 100%;
  }
</style>
