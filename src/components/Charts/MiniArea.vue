<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="data" :padding="[36, 0, 18, 0]">
        <v-smooth-area position="x*本月访视" />
      </v-chart>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
const data = []
const beginDay = new Date().getTime()

for (let i = 0; i < 10; i++) {
  data.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    '本月访视': Math.round(Math.random() * 10)
  })
}

const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
]
const scale = [{
  dataKey: 'x',
  min: 2
}]

export default {
  name: 'MiniArea',
  data () {
    return {
      data,
      tooltip,
      scale,
      height: 100
    }
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
