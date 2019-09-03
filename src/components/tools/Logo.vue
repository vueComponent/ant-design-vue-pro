<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
<!--      <LogoSvg alt="logo" /> -->
        <img src="~@/assets/logo.png" class="logoImg" alt="logoImg">
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: '支扩联盟',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
<style>
 .logo   .router-link-active .logoImg{
        height: 40px;
    width: 46px;
    padding-left: 0px;
  }
</style>
