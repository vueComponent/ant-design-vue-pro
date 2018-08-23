<template>
  <layout-main>
    <route-view/>
  </layout-main>
</template>

<script>
  import LayoutMain from './LayoutMain'
  import RouteView from './RouteView'

  export default {
    name: "GlobalView",
    components: {
      LayoutMain,
      RouteView
    }
  }
</script>

<style scoped>

</style>