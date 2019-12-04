<template>
  <div class="logo">
    <router-link :to="{name:'Analysis'}">
      <!--      <LogoSvg alt="logo" /> -->
      <img src="~@/assets/logo.png" class="logoImg" alt="logoImg">
      <h1 v-if="showTitle">
        <img src="~@/assets/logowords.png" class="logowords" alt="">
      </h1>
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
      default: '支扩中国',
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
.logo {
  padding-left: 15px !important;
}

.logo h1 .logowords {
  width: 100px!important;
  height: 36px!important;
}
</style>