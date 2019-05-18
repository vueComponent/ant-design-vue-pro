<template>
  <div>
    <v-chart :height="height" :padding="0" :data="propData" :scale="scale" :forceFit="true">
      <v-tooltip :show-title="false"/>
      <v-coord type="rect" direction="TL"/>
      <v-point position="x*y" color="text" shape="cloud" tooltip="value*category"/>
    </v-chart>
  </div>
</template>
<script>
import { registerShape } from 'viser-vue'
const DataSet = require('@antv/data-set')

const scale = [{ dataKey: 'x', nice: false }, { dataKey: 'y', nice: false }]

registerShape('point', 'cloud', {
  draw (cfg, container) {
    return container.addShape('text', {
      attrs: {
        fillOpacity: cfg.opacity,
        fontSize: cfg.origin._origin.size,
        rotate: cfg.origin._origin.rotate,
        text: cfg.origin._origin.text,
        textAlign: 'center',
        fontFamily: cfg.origin._origin.font,
        fill: cfg.color,
        textBaseline: 'Alphabetic',
        ...cfg.style,
        x: cfg.x,
        y: cfg.y
      }
    })
  }
})

export default {
  created () {
    const dv = new DataSet.View().source(this.data)
    const range = dv.range('value')
    const [min, max] = range
    dv.transform({
      type: 'tag-cloud',
      fields: ['name', 'value'],
      size: [250, 161],
      font: 'Verdana',
      padding: 0,
      timeInterval: 5000,
      rotate () {
        return 0
      },
      fontSize (d) {
        return Math.pow((d.value - min) / (max - min), 2) * (17.5 - 5) + 5
      }
    })
    this.$data.propData = dv.rows
  },
  data () {
    return {
      scale,
      propData: []
    }
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    height: {
      type: Number,
      default: 161
    }
  }
}
</script>
