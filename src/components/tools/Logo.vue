<template>
  <div class="logo">
    <router-link :to="{name:'Analysis'}">
      <!--      <LogoSvg alt="logo" /> -->
      <span class="logosImg"></span>
      <!-- <img src="~@/assets/logo.png" class="logoImg" alt="logoImg"> -->
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
  padding-left: 18px !important;

}

.logo h1 {
  margin-left: 0.1875rem !important;
}

.logo h1 .logowords {
  width: 100px !important;
  height: 40px !important;
}
.logosImg {
    vertical-align:middle;
    display:inline-block;
    background-color: #fff;
    width: 46px;
    height: 40px;
    padding-left: 0px;
}

.logo .router-link-active .logoImg {
  height: 40px;
  width: 46px;
  padding-left: 0px;
}
</style>