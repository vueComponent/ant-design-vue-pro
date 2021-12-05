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
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}" @change="changeBarData">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a @click="barIndex==1?showViewsOfToday():showFavoriteOfToday()">今日</a>
              <a @click="barIndex==1?showViewsOfThisWeek():showFavoriteOfThisWeek()">本周</a>
              <a @click="barIndex==1?showViewsOfThisMonth():showFavoriteOfThisMonth()">本月</a>
            </div>
            <a-range-picker :style="{width: '256px'}" @change="datePickerChange"/>
          </div>
          <a-tab-pane :loading="loading" tab="浏览量" key="1">
            <bar :data="barData" title="浏览量趋势" style='font-size: 16px;font-weight: bold'/>
          </a-tab-pane>
          <a-tab-pane :loading="loading" tab="被收藏" key="2">
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
//
// const barData = []
// const barData2 = []
// const data = []
// for (let i = 0; i < 12; i += 1) {
//   barData.push({
//     x: `${i + 1}月`,
//     y: Math.floor(Math.random() * 1000) + 200
//   })
//   barData2.push({
//     x: `${i + 1}月`,
//     y: Math.floor(Math.random() * 1000) + 200
//   })
// }

export default {
  name: 'DataBoard',
  data () {
    return {
      loading: true,
      barIndex: 1,
      timeIndex: 1,
      data: [],
      barData: [],
      barData2: [],
      viewsOfToday: [],
      viewsOfThisWeek: [],
      viewsOfThisMonth: [],
      favoriteOfToday: [],
      favoriteOfThisWeek: [],
      favoriteOfThisMonth: [],
      datePickerData: {}
    }
  },
  created () {
    this.updatePostingCount()
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    this.showViewsOfToday()
  },
  methods: {
    updatePostingCount () {
      request({
        url: '/posting/organizationPostingCount',
        method: 'get'
      })
        .then(res => {
          const data = res.data
          this.data = {
            postingNumber: data.publishedCount,
            totalViews: data.viewCount,
            beCollectedNumber: data.likeCount
          }
        })
    },
    changeBarData (index) {
      this.loading = true
      this.barIndex = index
      if (index === '1') {
        switch (this.timeIndex) {
          case 1:
            this.showViewsOfToday()
            break
          case 2:
            this.showViewsOfThisWeek()
            break
          case 3:
            this.showViewsOfThisMonth()
            break
          case 4:
            this.getDataOfDatePicker()
            break
        }
      } else {
        switch (this.timeIndex) {
          case 1:
            this.showFavoriteOfToday()
            break
          case 2:
            this.showFavoriteOfThisWeek()
            break
          case 3:
            this.showFavoriteOfThisMonth()
            break
          case 4:
            this.getDataOfDatePicker()
            break
        }
      }
      this.loading = false
    },
    datePickerChange(event, time) {
      // console.log(event, time)
      this.datePickerData = {
        startTime: time[0] + ' 00:00:00',
        endTime: time[1] + ' 00:00:00'
      }
      this.getDataOfDatePicker()
    },
    getDataOfDatePicker () {
      this.timeIndex = 4
      const urlSuffix = this.barIndex==1?'PVNew':'Favorite'
      request({
        url: '/posting/organizationQueryStartEnd' + urlSuffix,
        method: 'get',
        params: this.datePickerData
      })
        .then(res => {
          const resData = res.data
          console.log(resData)
          const data = []
          for (let i in resData.time) {
            data.push({
              x: resData.time[i],
              y: resData.value[i]
            })
          }
          this.barIndex==1?this.barData = data:this.barData2 = data
        })
    },
    showViewsOfToday () {
      console.log('viewsToday')
      this.timeIndex = 1
      if (!this.viewsOfToday.length) {
        request({
          url: '/posting/organizationQueryYesterdayPV',
          method: 'get'
        })
          .then(res => {
            const data = []
            for (let i = 0; i < 24; i += 1) {
              data.push({
                x: `${i }时`,
                y: res.data.value[i]
              })
            }
            this.viewsOfToday = data
            this.barData = data
          })
      } else {
        this.barData = this.viewsOfToday
      }
    },
    showViewsOfThisWeek () {
      console.log('viewsThisWeek')
      this.timeIndex = 2
      if (!this.viewsOfThisWeek.length) {
        this.requestViewsOfDailyOffset(7)
        .then(res => {
          const resData =res.data
          const data = []
          for (let i = 0; i < 7; i++) {
            data.push({
              x: resData.time[i],
              y: resData.value[i]
            })
          }
          this.viewsOfThisWeek = data
          this.barData = data
        })
      } else {
        this.barData = this.viewsOfThisWeek
      }
    },
    showViewsOfThisMonth () {
      console.log('viewsThisMonth')
      this.timeIndex = 3
      if (!this.viewsOfThisMonth.length) {
        this.requestViewsOfDailyOffset(31)
          .then(res => {
            const resData = res.data
            const data = []
            for (let i = 0; i < 31; i++) {
              data.push({
                x: resData.time[i],
                y: resData.value[i]
              })
            }
            this.viewsOfThisMonth = data
            this.barData = data
          })
      } else {
        this.barData = this.viewsOfThisMonth
      }
    },
    showFavoriteOfToday () {
      console.log('favoriteToday')
      this.timeIndex = 1
      if (!this.favoriteOfToday.length) {
        request({
          url: '/posting/organizationQueryYesterdayFavorite',
          method: 'get'
        })
          .then(res => {
            const data = []
            for (let i = 0; i < 24; i += 1) {
              data.push({
                x: `${i }时`,
                y: res.data.value[i]
              })
            }
            this.favoriteOfToday = data
            this.barData2 = data
          })
      } else {
        this.barData2 = this.favoriteOfToday
      }
    },
    showFavoriteOfThisWeek () {
      console.log('favoriteThisWeek')
      this.timeIndex = 2
      if (!this.favoriteOfThisWeek.length) {
        this.requestFavoriteOfDailyOffset(7)
          .then(res => {
            const resData = res.data
            const data = []
            for (let i = 0; i < 7; i++) {
              data.push({
                x: resData.time[i],
                y: resData.value[i]
              })
            }
            this.favoriteOfThisWeek = data
            this.barData2 = data
          })
      } else {
        this.barData2 = this.favoriteOfThisWeek
      }
    },
    showFavoriteOfThisMonth () {
      console.log('favoriteThisMonth')
      this.timeIndex = 3
      if (!this.favoriteOfThisMonth.length) {
        this.requestFavoriteOfDailyOffset(31)
          .then(res => {
            const resData = res.data
            const data = []
            for (let i = 0; i < 31; i++) {
              data.push({
                x: resData.time[i],
                y: resData.value[i]
              })
            }
            this.favoriteOfThisMonth = data
            this.barData2 = data
          })
      } else {
        this.barData2 = this.favoriteOfThisMonth
      }
    },
    requestViewsOfDailyOffset (offset) {
      return request({
        url: '/posting/organizationQueryTodayOffsetPVNew',
        method: 'get',
        params: {
          offset: offset
        }
      })
    },
    requestFavoriteOfDailyOffset (offset) {
      return request({
        url: '/posting/organizationQueryTodayOffsetFavorite',
        method: 'get',
        params: {
          offset: offset
        }
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
