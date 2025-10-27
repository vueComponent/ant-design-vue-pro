<template>
  <div :class="wrpCls">
    <!--<pending-remind :pending="pending" :class="prefixCls" />-->
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!--<select-lang :class="prefixCls" />-->
    <audio ref="audio" src="../../assets/audio/remind.mp3"></audio>
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
// import PendingRemind from './PendingRemind'
// import SelectLang from '@/components/SelectLang'
import { mapState } from 'vuex'
export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    // PendingRemind
    // SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      currentUser: {},
      user: {},
      pending: {}
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    },
    ...mapState({
      name: state => state.user.name,
    })
  },
  mounted () {
    /*
    setTimeout(() => {
      this.currentUser = {
        name: this.name
      }
    }, 1500)
    */
    // setInterval(() => {
      this.currentUser = {
        name: this.name
      }
    // }, 5000)
  }
}
</script>
