<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
    account center page
  </a-card>
</template>

<script>
  import PageLayout from '@/components/layout/PageLayout'
  import RouteView from "@/components/layout/RouteView";

  export default {
    components: {
      RouteView,
      PageLayout
    },
    data () {
      return {

      }
    },
    methods: {

    },
  }
</script>