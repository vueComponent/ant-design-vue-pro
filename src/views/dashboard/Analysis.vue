<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总销售额" total="￥126,560">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              11%
            </trend>
          </div>
          <template slot="footer">日均销售额<span>￥ 234.56</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="访问量" :total="8846 | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">日访问量<span> {{ '1234' | NumberFormat }}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="支付笔数" :total="6560 | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">转化率 <span>60%</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="运营活动效果" total="78%">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              80%
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :sm="48" :md="24" :xl="12" :style="{ marginBottom: '24px' }">
        <a-card :loading="loading" title="我的工作" total="￥126,560">
          <a-row :gutter="24">
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                 <div class="card-wait-data">
                   <p>
                       访视代办
                   </p>
                   <h1>
                     120
                   </h1>
                 </div>
            </a-col>
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                                <div class="card-wait-data">
                 <p>
                     访视代办
                 </p>
                 <h1>
                   120
                 </h1>
               </div>
            </a-col>
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                                <div class="card-wait-data">
                 <p>
                     访视代办
                 </p>
                 <h1>
                   120
                 </h1>
               </div>
            </a-col>
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                                 <div class="card-wait-data">
                  <p>
                      访视代办
                  </p>
                  <h1>
                    120
                  </h1>
                </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :sm="48" :md="24" :xl="12" :style="{ marginBottom: '24px' }">
          <a-card :loading="loading" title="我的工作" >
             <div>
              <v-chart :force-fit="true" :height="262" :data="pieData" :scale="pieScale">
                <v-tooltip :showTitle="true" dataKey="item*percent" />
                <v-axis />
                <!-- position="right" :offsetX="-140" -->
                <v-legend dataKey="item"/>
                <v-pie position="percent" color="item" :vStyle="pieStyle" />
                <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
              </v-chart>
            </div>
          </a-card>
      </a-col>
     
    </a-row>
    <a-row :gutter="24">
      <a-col :sm="48" :md="24" :lg="14" :style="{ marginBottom: '24px' }">
         <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
          <div class="salesCard">
            <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
              <a-tab-pane loading="true" tab="销售额" key="1">
                <a-row>
                  <a-col :push="1" :xl="22" :lg="22" :md="22" :sm="24" :xs="24">
                    <bar :data="barData" title="销售额排行" />
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane tab="访问量" key="2">
                <a-row>
                  <a-col :push="1" :xl="22" :lg="22" :md="22" :sm="24" :xs="24">
                    <bar :data="barData2" title="销售额趋势" />
                  </a-col>
                </a-row>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="48" :md="24" :lg="10" :style="{ marginBottom: '24px'}">
        <a-card :loading="loading" title="门店销售排行榜"  :bordered="false" :body-style="{padding: '0'}" :style="{height:'411px'}">
          <div class="salesCard">
             <rank-list  :list="rankList"/>
          </div>
        </a-card>
      </a-col>
    </a-row>

   

    
  </div>
</template>

<script>
import moment from 'moment'
import { ChartCard, MiniArea, MiniBar, MiniProgress, RankList, Bar, Trend, NumberInfo, MiniSmoothArea } from '@/components'
import { mixinDevice } from '@/utils/mixin'

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

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0,
    max: 10
  }]

const searchTableColumns = [
  {
    dataIndex: 'index',
    title: '排名',
    width: 90
  },
  {
    dataIndex: 'keyword',
    title: '搜索关键词'
  },
  {
    dataIndex: 'count',
    title: '用户数'
  },
  {
    dataIndex: 'range',
    title: '周涨幅',
    align: 'right',
    sorter: (a, b) => a.range - b.range,
    scopedSlots: { customRender: 'range' }
  }
]
const searchData = []
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
}

const DataSet = require('@antv/data-set')

const sourceData = [
  { item: '家用电器', count: 32.2 },
  { item: '食用酒水', count: 21 },
  { item: '个护健康', count: 17 },
  { item: '服饰箱包', count: 13 },
  { item: '母婴产品', count: 9 },
  { item: '其他', count: 7.8 }
]

const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%'
}]

const dv = new DataSet.View().source(sourceData)
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
})
const pieData = dv.rows

export default {
  name: 'Analysis',
  mixins: [mixinDevice],
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
  },
  data () {
    return {
      loading: true,
      rankList,

      // 搜索用户数
      searchUserData,
      searchUserScale,
      searchTableColumns,
      searchData,

      barData,
      barData2,

      //
      pieScale,
      pieData,
      sourceData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
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

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;

    &.desktop div[class^=ant-col]:last-child {
      position: absolute;
      right: 0;
      height: 100%;
    }
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
  .card-wait-data{
    box-sizing: border-box;
    padding: 20px 20px 20px 60px;
    background-color: #F7F8F8;
    height: 110px;
    background-image: url('');
    p{
      margin-bottom: 0px;
    }
    h1{
      font-size: 30px;
      font-weight: normal;
      color: #000000;
    }
  }
</style>
