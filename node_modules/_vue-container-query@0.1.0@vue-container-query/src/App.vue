<template>
  <container-query :query="query" v-model="params">
    <pre class="app">{{ params }}</pre>
  </container-query>
</template>

<script>
import { ContainerQuery } from './'

const query = {
  'width-between-400-and-599': {
    minWidth: 400,
    maxWidth: 599
  },
  'width-larger-than-600': {
    minWidth: 600
  }
}

export default {
  name: 'app',
  components: { ContainerQuery },
  data () {
    return { query, params: {} }
  }
}
</script>

<style>
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
  margin-top: 60px;
  background: #2c3e50;
  padding: 30px 100px;
}
</style>
