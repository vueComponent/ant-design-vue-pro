<!--suppress ALL -->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>当日</a>
              <a>近一周</a>
              <a>近一月</a>
              <a>近半年</a>
              <a>近一年</a>
            </div>
            <a-range-picker :style="{width: '256px'}" />
          </div>
          <a-tab-pane loading="true" tab="小程序登陆人数" key="1">
            <bar :data="barData" style="font-size: 16px;font-weight: bold"/>
          </a-tab-pane>
          <a-tab-pane tab="行星号新增用户数" key="2">
            <bar :data="barData2" style="font-size: 16px;font-weight: bold"/>
          </a-tab-pane>
          <a-tab-pane tab="恒星号新增用户" key="3">
            <bar :data="barData2" style="font-size: 16px;font-weight: bold"/>
          </a-tab-pane>
          <a-tab-pane tab="济事动态" key="4">
            <bar :data="barData2" style="font-size: 16px;font-weight: bold"/>
          </a-tab-pane>
          <a-tab-pane tab="济人动态" key="5">
            <bar :data="barData2" style="font-size: 16px;font-weight: bold"/>
          </a-tab-pane>
          <a-tab-pane tab="同德动态" key="6">
            <bar :data="barData2" style="font-size: 16px;font-weight: bold"/>
          </a-tab-pane>
        </a-tabs>
      </div>
      <!--      <ve-line :data="chartData"></ve-line>-->
    </a-card>
  </page-header-wrapper>
</template>

<script>
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea
} from '@/components'
// import VeLine from 'v-charts/lib/line.common'

const barData = []
const barData2 = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

export default {
  name: 'DataRequirement',
  data () {
    return {
      barData,
      barData2,
      chartData: {
        columns: ['日期', '销售额'],
        rows: [
          { '日期': '1月1日', '销售额': 123 },
          { '日期': '1月2日', '销售额': 1223 },
          { '日期': '1月3日', '销售额': 2123 },
          { '日期': '1月4日', '销售额': 4123 },
          { '日期': '1月5日', '销售额': 3123 },
          { '日期': '1月6日', '销售额': 7123 }
        ]
      }
    }
  },
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
    // VeLine
  }
}
</script>

<style lang='less' scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}
</style>
