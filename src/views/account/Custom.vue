<template>
  <div>
    主题色：{{ theme | themeFilter }} <a-switch defaultChecked @change='onChange'/>
  </div>
</template>

<script>
  export default {
    name: "Security",
    data () {
      return {
        theme: 'dark'
      }
    },
    filters: {
      themeFilter(theme) {
        const themeMap = {
          'dark': '暗色',
          'light': '白色'
        }
        return themeMap[theme]
      }
    },
    methods: {
      onChange (checked) {
        if (checked) {
          this.theme = 'dark'
        } else {
          this.theme = 'light'
        }
      }
    }
  }
</script>

<style scoped>

</style>