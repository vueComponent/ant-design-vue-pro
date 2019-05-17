<template>
  <div>
    <v-chart :height="161" :padding="pad" :data="data" :scale="scale" :forceFit="true">
      <v-tooltip :show-title="false" />
      <v-coord type="rect" direction="TL" />
      <v-point position="x*y" color="text" shape="cloud" tooltip="value*category" />
    </v-chart>
  </div>
</template>
<script>
import { registerShape } from 'viser-vue';
const DataSet = require('@antv/data-set');

const scale = [
  { dataKey: 'x', nice: false },
  { dataKey: 'y', nice: false },
];

registerShape('point', 'cloud', {
  draw(cfg, container) {
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
        y: cfg.y,
      },
    });
  }
});

const data=[
  {
    "x": "Germany",
    "value": 123,
    "category": "europe"
  },
  {
    "x": "Democratic Republic of the Congo",
    "value": 322,
    "category": "africa"
  },
  {
    "x": "Iran",
    "value": 133,
    "category": "asia"
  },
  {
    "x": "Turkey",
    "value": 333,
    "category": "asia"
  },
  {
    "x": "Thailand",
    "value":111,
    "category": "asia"
  },
  {
    "x": "France",
    "value": 333,
    "category": "europe"
  },
  {
    "x": "United Kingdom",
    "value": 111,
    "category": "europe"
  },
  {
    "x": "Italy",
    "value": 333,
    "category": "europe"
  },
  {
    "x": "Tanzania",
    "value": 111,
    "category": "africa"
  },
  {
    "x": "South Africa",
    "value": 111,
    "category": "africa"
  },
  {
    "x": "Myanmar",
    "value": 333,
    "category": "asia"
  },
  {
    "x": "South Korea",
    "value":332,
    "category": "asia"
  },
  {
    "x": "Colombia",
    "value": 123,
    "category": "america"
  },
  {
    "x": "Kenya",
    "value": 321,
    "category": "africa"
  },
]
export default {
  mounted() {
      const dv = new DataSet.View().source(data);
      const range = dv.range('value');
      const min = range[0];
      const max = range[1];
      dv.transform({
        type: 'tag-cloud',
        fields: ['x', 'value'],
        size: [250, 161],
        font: 'Verdana',
        padding: 0,
        timeInterval: 5000, // max execute time
        rotate() {
          return 0
        },
        fontSize(d) {
          // eslint-disable-next-line
          return Math.pow((d.value - min) / (max - min), 2) * (17.5 - 5) + 5;
        },
      });
      this.$data.data = dv.rows;
  },
  data() {
    return {
      pad:[0],
      data: [],
      scale,
    };
  }
};
</script>
