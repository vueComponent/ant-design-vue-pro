<template>
    <layout-view>
        <route-view />
    </layout-view>
</template>

<script>
  import LayoutView from './LayoutView'
  import RouteView from './RouteView'

  export default {
    name: "GlobalView",
    components: {
      LayoutView,
      RouteView
    }
  }
</script>

<style scoped>

</style>