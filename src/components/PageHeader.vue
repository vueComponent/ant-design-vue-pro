<template>
    <div class="pageHeader">

        <s-breadcrumb></s-breadcrumb>

        <div class="detail">
            <div class="main">
                <div class="row">
                    <h1 class="title" v-text="$route.meta.title"></h1>
                </div>
                <div class="row"></div>
            </div>
        </div>
    </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'

  export default {
    name: "PageHeader",
    components: {
      "s-breadcrumb": Breadcrumb
    }
  }
</script>

<style scoped>

</style>