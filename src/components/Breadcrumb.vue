<template>
    <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item v-for="(item, index) in breadList" :key="index">
            <router-link v-if="item.name != name" :to="{ path: item.path }">
                {{ item.meta.title }}
            </router-link>
            <span v-else>{{ item.meta.title }}</span>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>

<script>
export default {
    data() {
      return {
        name: '',
        breadList: [],
      }
    },
  created () {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      this.breadList = this.$route.matched
      this.name = this.$route.name
      this.$route.matched.forEach((item) => {
        // item.meta.name === 'dashboard' ? item.path = '/dashboard' : this.$route.path === item.path
        if (item.name === undefined) {
          item.meta.title = '首页'
        }
      })
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  }
}
</script>

<style scoped>

</style>