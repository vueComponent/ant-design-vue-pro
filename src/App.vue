<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'
  import { version } from 'ant-design-vue'

  export default {
    data () {
      return {
        locale: zhCN,
        version
      }
    },
    mounted () {
      const { $store } = this
      console.log('use Ant-Design Of Vue:', version)
      deviceEnquire(deviceType => {

        switch (deviceType) {
          case DEVICE_TYPE.DESKTOP:
            $store.commit('TOGGLE_DEVICE', 'desktop')
            $store.dispatch('setSidebar', true)
            break
          case DEVICE_TYPE.TABLET:
            console.log('tablet')
            $store.dispatch('ToggleDevice', 'tablet')
            $store.dispatch('setSidebar', false)
            break
          case DEVICE_TYPE.MOBILE:
          default:
            $store.commit('TOGGLE_DEVICE', 'mobile')
            $store.dispatch('setSidebar', false)
            break
        }
        console.log('deviceType', deviceType)
      })
    }
  }
</script>