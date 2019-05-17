<template>
    <div>
      <v-chart :force-fit="true" :height="height" :data="dataSource" :scale="scale" :padding="[36, 0, 22, 0]">
        <v-tooltip />
          <v-axis></v-axis>
        <v-smooth-line position="x*y" :size="2" />
        <v-smooth-area position="x*y" />
      </v-chart>
    </div>
</template>

<script>
export default {
  name: 'MiniSmoothArea',
  props: {
    prefixCls: {
      type: String,
    },
    scale: {
      type: [Object, Array],
      required: true
    },
    dataSource: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      height: 132
    }
  }
}
</script>

<style lang="less" scoped>
</style>
