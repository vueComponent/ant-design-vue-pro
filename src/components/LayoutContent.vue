<template>
    <a-layout-content class="layout-content">
        <div style="margin: -24px -24px 0px;" v-if="!$route.meta.hideHeader">

            <!-- pageHeader , route meta hideHeader:true on hide -->
            <s-page-header></s-page-header>
            <div class="content">
                <s-route-view></s-route-view>
            </div>
        </div>

        <s-route-view v-else></s-route-view>

    </a-layout-content>
</template>

<script>
  import PageHeader from './PageHeader'
  import RouteView from './RouteView'

  export default {
    name: "LayoutContent",
    components: {
      "s-page-header": PageHeader,
      "s-route-view": RouteView
    }
  }
</script>

<style scoped>

</style>