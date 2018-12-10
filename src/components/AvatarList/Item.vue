<template>
  <div>
    item
  </div>
</template>

<script>
  export default {
    name: "AvatarItem",
    props: {
      tips: {
        type: String,
        default: '',
        required: false
      },
      src: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>