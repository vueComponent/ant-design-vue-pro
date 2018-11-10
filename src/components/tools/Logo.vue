<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <img src="~@/assets/logo.svg" alt="logo">
      <h1>Ant Design Pro</h1>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "Logo"
  }
</script>