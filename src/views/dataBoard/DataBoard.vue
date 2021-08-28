<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :span='7' :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="帖子总数" :total="postingNumber" :bordered='true'>
            <a-tooltip title="帖子总数" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
          </chart-card>
        </a-col>
        <a-col :span='7' :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="总浏览量" :total="totalViews" :bordered='true'>
            <a-tooltip title="总浏览量" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
          </chart-card>
        </a-col>
        <a-col :span='7' :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="被收藏量" :total="beCollectedNumber" :bordered='true'>
            <a-tooltip title="被收藏量" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
          </chart-card>
        </a-col>
      </a-row>

      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>今日</a>
              <a>本周</a>
              <a>本月</a>
            </div>
            <a-range-picker :style="{width: '256px'}" />
          </div>
          <a-tab-pane loading="true" tab="浏览量" key="1">
            <bar :data="barData" title="浏览量趋势" style='font-size: 16px;font-weight: bold'/>
          </a-tab-pane>
          <a-tab-pane tab="被收藏" key="2">
            <bar :data="barData2" title="收藏量趋势" style='font-size: 16px;font-weight: bold'/>
          </a-tab-pane>
        </a-tabs>
      </div>
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
  name: 'DataBoard',
  data () {
    return {
      postingNumber: 56,
      totalViews: 126560,
      beCollectedNumber: 126560,
      barData,
      barData2
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
