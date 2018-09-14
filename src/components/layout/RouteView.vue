<template>
  <keep-alive v-if="$route.meta.keepAlive">
    <router-view></router-view>
  </keep-alive>
  <router-view v-else></router-view>
</template>

<script>
  export default {
    name: "RouteView"
  }
</script>

<style scoped>

</style>