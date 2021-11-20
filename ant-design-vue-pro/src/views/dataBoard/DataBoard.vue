<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :span='7' :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="帖子总数" :total="data.postingNumber" :bordered='true'>
            <a-tooltip title="帖子总数" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
          </chart-card>
        </a-col>
        <a-col :span='7' :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="总浏览量" :total="data.totalViews" :bordered='true'>
            <a-tooltip title="总浏览量" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
          </chart-card>
        </a-col>
        <a-col :span='7' :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="被收藏量" :total="data.beCollectedNumber" :bordered='true'>
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
              <a @click="changeViewsOfThisWeek">本周</a>
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
import request from '@/utils/request'
const barData = []
const barData2 = []
const data = []
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
      loading: true,
      data,
      barData,
      barData2,
      viewsOfThisWeek: [],
      viewsOfThisMonth: []
    }
  },
  created () {
    this.updatePostingCount()
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    this.testFunction()
  },
  methods: {
    updatePostingCount () {
      request({
        url: '/posting/organizationPostingCount',
        method: 'get'
      })
        .then(res => {
          console.log(res)
          const data = res.data
          this.data = {
            postingNumber: data.publishedCount,
            totalViews: data.viewCount,
            beCollectedNumber: data.likeCount
          }
        })
    },
    testFunction () {
        request({
          url: '/posting/organizationQueryYesterday24hUV',
          method: 'get',
          data: {
            // id: this.$route.params.postingId,
            // ...value,
            // content: this.content
          }
        })
          .then(res => {
            console.log(res)
            const data = []
            for (let i = 0; i < 24; i += 1) {
              data.push({
                x: `${i }时`,
                y: res.data.value[i]
              })
            }
            this.barData = data
          })
    },
    changeViewsOfThisWeek () {
      if (!this.viewsOfThisWeek.length) {
        this.requestViewsOfDailyOffset(7)
      }
    },
    requestViewsOfDailyOffset (offset) {
      request({
        url: '/posting/organizationQueryTodayOffsetUV',
        method: 'get',
        data: {
          offset
        }
      })
        .then(res => {
          console.log(res)
        //   const data = []
        //   for (let i = 0; i < offset; i += 1) {
        //     data.push({
        //       x: `${i }时`,
        //       y: res.data.value[i]
        //     })
        //   }
        //   this.barData = data
        })
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
