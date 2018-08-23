<template>
  <layout-main>
    <page-view />
  </layout-main>
</template>

<script>
  import LayoutMain from './LayoutMain'
  import PageView from './PageView'

  export default {
    name: "GlobalView",
    components: {
      LayoutMain,
      PageView
    }
  }
</script>

<style scoped>

</style>