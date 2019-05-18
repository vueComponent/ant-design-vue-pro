<template>
  <div>
    <v-chart
      :height="height"
      :data="searchUserData"
      :scale="searchUserScale"
      :padding="[36, 0, 22, 0]"
      :forceFit="true"
    >
      <v-tooltip/>
      <v-axis></v-axis>
      <v-smooth-line position="x*y" :size="2"/>
      <v-smooth-area position="x*y"/>
    </v-chart>
  </div>
</template>

<script>
import moment from 'moment'
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0,
    max: 10
  }
]
const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment()
      .add(i, 'days')
      .format('DD'),
    y: Math.ceil(Math.random() * 5)
  })
}
export default {
  name: 'MiniSmoothArea',
  data () {
    return {
      height: 132,
      searchUserData,
      searchUserScale
    }
  }
}
</script>

<style lang="less" scoped>
</style>
