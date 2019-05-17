<template>
  <div>
    <v-chart
      :forceFit="true"
      :height="height"
      :data="data"
      :scale="scale"
      :padding="[-16, 0, 16, 0]"
    >
      <v-coord type="polar" :startAngle="-225" :endAngle="45" :radius="0.8"></v-coord>
      <v-axis
        data-key="value"
        :zIndex="2"
        :line="null"
        :label="axisLabel"
        :tickLine="null"
        :grid="null"
      ></v-axis>
      <v-axis data-key="1" :show="false"></v-axis>
      <v-series gemo="point" position="value*1" shape="pointer" color="#1890FF" :active="false"></v-series>
      <v-guide
        type="line"
        :start="lineGuide1Start"
        :end="lineGuide1End"
        :lineStyle="lineGuide1LineStyle"
      ></v-guide>
      <v-guide
        type="line"
        :start="lineGuide2Start"
        :end="lineGuide2End"
        :lineStyle="lineGuide2LineStyle"
      ></v-guide>
      <v-guide
        type="line"
        :start="lineGuide3Start"
        :end="lineGuide3End"
        :lineStyle="lineGuide3LineStyle"
      ></v-guide>
      <v-guide
        type="arc"
        :zIndex="0"
        :top="false"
        :start="arcGuide1Start"
        :end="arcGuide1End"
        :vStyle="arcGuide1Style"
      ></v-guide>
      <v-guide
        type="arc"
        :zIndex="1"
        :start="arcGuide2Start"
        :end="arcGuide2End"
        :vStyle="arcGuide2Style"
      ></v-guide>
      <v-guide type="html" :position="htmlGuidePosition" :html="htmlGuideHtml"></v-guide>
    </v-chart>
  </div>
</template>

<script>
import { registerShape } from 'viser-vue'

registerShape('point', 'pointer', {
  draw(cfg, container) {
    let point = cfg.points[0] // 获取第一个标记点
    point = this.parsePoint(point)
    const center = this.parsePoint({
      // 获取极坐标系下画布中心点
      x: 0,
      y: 0
    })
    // 绘制指针
    container.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y,
        stroke: cfg.color,
        lineWidth: 2,
        lineCap: 'round'
      }
    })
    return container.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 6,
        stroke: cfg.color,
        lineWidth: 3,
        fill: '#fff'
      }
    })
  }
})

const scale = [
  {
    dataKey: 'value',
    type: 'linear',
    min: 0,
    max: 10,
    tickCount: 6,
    nice: true
  }
]

const data = [{ value: 6 }]

export default {
  data() {
    return {
      height: 180,
      data: data,
      scale: scale,

      axisLabel: {
        offset: -12,
        formatter: val => {
          switch (val) {
            case '2':
              return '差'
            case '4':
              return '中'
            case '6':
              return '良'
            case '8':
              return '优'
            default:
              return ''
          }
        },
        textStyle: {
          fontSize: 14,
          textAlign: 'center'
        }
      },

      lineGuide1Start: [3, 0.905],
      lineGuide1End: [3, 0.85],
      lineGuide1LineStyle: {
        stroke: '#19AFFA',
        lineDash: null,
        lineWidth: 3
      },

      lineGuide2Start: [5, 0.905],
      lineGuide2End: [5, 0.85],
      lineGuide2LineStyle: {
        stroke: '#19AFFA',
        lineDash: null,
        lineWidth: 3
      },

      lineGuide3Start: [7, 0.905],
      lineGuide3End: [7, 0.85],
      lineGuide3LineStyle: {
        stroke: '#19AFFA',
        lineDash: null,
        lineWidth: 3
      },

      arcGuide1Start: [0, 0.965],
      arcGuide1End: [10, 0.965],
      arcGuide1Style: {
        stroke: '#CBCBCB',
        lineWidth: 10
      },

      arcGuide2Start: [0, 0.965],
      arcGuide2End: [data[0].value, 0.965],
      arcGuide2Style: {
        stroke: '#1890FF',
        lineWidth: 10
      },

      htmlGuidePosition: ['50%', '95%'],
      htmlGuideHtml: `
        <div style="width: 300px;text-align: center;">
          <p style="font-size: 14px;color: #545454;margin: 0;">跳出率</p>
          <p style="font-size:24px;color: #545454;margin: 0;">${data[0].value * 10}%</p>
        </div>
      `
    }
  }
}
</script>
