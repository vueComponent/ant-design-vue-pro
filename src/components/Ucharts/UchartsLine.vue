<template>
  <div class="chart-container">
    <div v-if="title" class="title" :style="titleStyle">{{ title }}</div>
    <div class="charts-box">
      <qiun-data-charts
        v-if="shouldRenderChart"
        :type="type"
        :ontouch="enableTouch"
        :canvasId="canvasId"
        :canvas2d="true"
        :opts="mergedOpts"
        :chartData="processedChartData"
        @touch="handleTouch"
      />
    </div>
  </div>
</template>

<script>
// 导入秋云图表组件
import QiunVueUcharts from "@/components/qiun-vue-ucharts/qiun-vue-ucharts.vue";

export default {
  name: 'UchartsLine',
  components: {
    'qiun-data-charts': QiunVueUcharts,
  },
  props: {
    title: String,
    type: {
      type: String,
      default: 'demotype'
    },
    canvasId: {
      type: String,
      default: 'defaultCanvas'
    },
    categories: {
      type: Array,
      default: () => []
    },
    series: {
      type: Array,
      default: () => []
    },
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: 240
    },
    config: {
      type: Object,
      default: () => ({})
    },
    titleStyle: {
      type: Object,
      default: () => ({})
    },
    enableTouch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultOpts: {
        fontSize: 11,
        padding: [15, 20, 20, 10],
        enableScroll: false,
        dataLabel: false,
        dataPointShape: false,
        xAxis: {
          fontSize: 10,
          disableGrid: true,
          boundaryGap: "justify",
          labelCount: 8,
          marginTop: 0,
        },
        yAxis: {
          disableGrid: false,
          gridType: "dash",
          padding: 4,
          splitNumber: 5,
          format: 'yAxisDemo1'
        },
        extra: {
          line: {
            type: "curve",
            width: 1
          },
        }
      }
    }
  },
  computed: {
    mergedOpts() {
      return {
        ...this.defaultOpts,
        ...this.config,
        xAxis: {
          ...this.defaultOpts.xAxis,
          ...(this.config.xAxis || {})
        },
        yAxis: {
          ...this.defaultOpts.yAxis,
          ...(this.config.yAxis || {})
        }
      }
    },
    processedChartData() {
      return {
        categories: this.categories,
        series: this.series.length > 0 
          ? this.series 
          : [{ name: '', data: [] }]
      }
    },
    shouldRenderChart() {
      return this.series.length > 0 && this.categories.length > 0
    }
  },
  watch: {
    series: {
      handler(newVal) {
        this.$emit('dataUpdate', newVal)
        // 添加图表重绘逻辑
        this.$nextTick(() => {
          this.$emit('chartsUpdate', { 
            canvasId: this.canvasId,
            data: newVal
          })
        })
      },
      deep: true
    },
    categories: {
      handler() {
        // 分类变化时重置横轴配置
        this.$nextTick(() => {
          this.$emit('resize', { canvasId: this.canvasId })
        })
      },
      deep: true
    }
  },
  mounted() {
    // 初始化后强制更新一次
    setTimeout(() => {
      this.$emit('initChart', { canvasId: this.canvasId })
    }, 300)
  },
  methods: {
    handleTouch(e) {
      this.$emit('touch', e)
    },
    // 暴露给父组件的方法
    getCurrentOptions() {
      return this.mergedOpts
    },
    // 手动刷新方法
    forceUpdateChart() {
      uni.$emit('refreshChart', { canvasId: this.canvasId })
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: v-bind('props.width');
  /*height: v-bind('typeof props.height === "number" ? `${props.height}px` : props.height');*/

  .title {
    font-size: 15px;
    font-weight: 550;
    color: #3f3f3f;
    margin: 10px 0;

    &:empty {
      display: none;
    }
  }

  .charts-box {
    width: 100%;
    height: 280px;
    /* 修复 canvas 渲染问题 */
    position: relative;
    z-index: 1;
  }
}
</style>