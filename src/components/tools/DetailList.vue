<template>
  <div :class="['detail-list', size === 'small' ? 'small' : 'large', layout === 'vertical' ? 'vertical': 'horizontal']">
    <div v-if="title" class="title">{{ title }}</div>
    <a-row>
      <slot></slot>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: "DetailList",
    props: {
      term: {
        type: String,
        default: null
      }
    },
    inject: {
      col: {
        type: Number
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>