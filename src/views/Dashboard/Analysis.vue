<template>
  <div>
    {{ $t("message")["app.dashboard.analysis.timeLabel"] }} :
    <a-date-picker></a-date-picker>
    <Chart :option="chartOption" style="height: 400px" />
    <pre v-highlightjs="chartCode"><code class="html"></code></pre>
  </div>
</template>

<script>
import request from "../../utils/request";
import Chart from "../../components/Chart";
import chartCode from "!!raw-loader!../../components/Chart";
export default {
  data() {
    return {
      chartOption: {},
      chartCode
    };
  },
  mounted() {
    this.getChartData();
    this.interval = setInterval(() => {
      this.getChartData();
    }, 3000);
  },
  methods: {
    getChartData() {
      request({
        url: "/api/dashboard/chart",
        method: "get",
        params: { ID: 12345 }
      }).then(response => {
        this.chartOption = {
          title: {
            text: "ECharts 入门示例"
          },
          tooltip: {},
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [
            {
              name: "销量",
              type: "bar",
              data: response.data
            }
          ]
        };
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  components: {
    Chart
  }
};
</script>

<style></style>
