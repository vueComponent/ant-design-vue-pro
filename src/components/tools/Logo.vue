<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}" style="overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">
      <img src="~@/assets/logo.svg" alt="logo">
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "Logo",
    props: {
      title: {
        type: String,
        default: 'Ant Design Pro',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      }
    }
  }
</script>