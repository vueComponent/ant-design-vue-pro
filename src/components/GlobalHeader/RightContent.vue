<template>
  <div :class="wrpCls">
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="actionClassName" />
    <select-lang :class="actionClassName" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang
  },
  props: {
    theme: {
      type: String,
      default: 'light'
    }
  },
  data () {
    this.actionClassName = 'ant-pro-global-header-index-action'
    return {
      showMenu: true,
      currentUser: {}
    }
  },
  computed: {
    wrpCls () {
      return { 'ant-pro-global-header-index-right': true, [`ant-pro-global-header-index-${this.theme}`]: true }
    }
  },
  mounted () {
    setTimeout(() => {
      this.currentUser = {
        name: 'Serati Ma'
      }
    }, 1500)
  }
}
</script>
