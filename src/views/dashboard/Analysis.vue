<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('lang.analysistotalsales')" total="￥126,560">
          <a-tooltip :title="$t('lang.analysisintroduce')" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">{{$t('lang.analysisweek')}}</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">{{$t('lang.analysisday')}}</span>
              11%
            </trend>
          </div>
          <template slot="footer">
            {{$t('lang.analysisdaysales')}}
            <span>￥ 234.56</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="loading"
          :title="$t('lang.analysisvisits')"
          :total="8846 | NumberFormat"
        >
          <a-tooltip :title="$t('lang.analysisintroduce')" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-area/>
          </div>
          <template slot="footer">
            {{$t('lang.analysisdayvisits')}}
            <span>{{ '1234' | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="loading"
          :title="$t('lang.analysispayments')"
          :total="6560 | NumberFormat"
        >
          <a-tooltip :title="$t('lang.analysisintroduce')" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-bar/>
          </div>
          <template slot="footer">
            {{$t('lang.analysisconversionrate')}}
            <span>60%</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('lang.analysisoperationaleffect')" total="78%">
          <a-tooltip :title="$t('lang.analysisintroduce')" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px"/>
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">{{$t('lang.analysisweek')}}</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">{{$t('lang.analysisday')}}</span>
              80%
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs
          default-active-key="1"
          size="large"
          :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}"
        >
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>{{$t('lang.analysisallday')}}</a>
              <a>{{$t('lang.analysisallweek')}}</a>
              <a>{{$t('lang.analysisallmonth')}}</a>
              <a>{{$t('lang.analysisallyear')}}</a>
            </div>
            <a-range-picker :style="{width: '256px'}"/>
          </div>
          <a-tab-pane loading="true" :tab="$t('lang.analysissales')" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :title="$t('lang.analysissalestrend')"/>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list :title="$t('lang.analysissalesranking')" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane :tab="$t('lang.analysisvisits')" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :title="$t('lang.analysisvisitstrend')"/>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list :title="$t('lang.analysisvisitsranking')" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <div
      class="antd-pro-pages-dashboard-analysis-twoColLayout"
      :class="isDesktop() ? 'desktop' : ''"
    >
      <a-row :gutter="24">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            :loading="loading"
            :bordered="false"
            :title="$t('lang.analysisonlinetopsearch')"
            :style="{ marginTop: '24px', minHeight: '500px' }"
          >
            <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
              <a class="ant-dropdown-link" href="#">
                <a-icon type="ellipsis"/>
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">{{$t('lang.analysisHandle1')}}</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">{{$t('lang.analysisHandle2')}}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-row :gutter="68">
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                <number-info :total="12321" :sub-total="17.1">
                  <span slot="subtitle">
                    <span>{{$t('lang.analysissearchusers')}}</span>
                    <a-tooltip :title="$t('lang.analysisintroduce')" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }"/>
                    </a-tooltip>
                  </span>
                </number-info>
                <!-- miniChart -->
                <div>
                  <mini-smooth-area
                    :style="{ height: '45px' }"
                    :dataSource="searchUserData"
                    :scale="searchUserScale"
                  />
                </div>
              </a-col>
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                <number-info :total="2.7" :sub-total="26.2" status="down">
                  <span slot="subtitle">
                    <span>{{$t('lang.analysispercapitasearch')}}</span>
                    <a-tooltip :title="$t('lang.analysisintroduce')" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }"/>
                    </a-tooltip>
                  </span>
                </number-info>
                <!-- miniChart -->
                <div>
                  <mini-smooth-area
                    :style="{ height: '45px' }"
                    :dataSource="searchUserData"
                    :scale="searchUserScale"
                  />
                </div>
              </a-col>
            </a-row>
            <div class="ant-table-wrapper">
              <a-table
                row-key="index"
                size="small"
                :columns="searchTableColumns"
                :dataSource="searchData"
                :pagination="{ pageSize: 5 }"
              >
                <span slot="range" slot-scope="text, record">
                  <trend :flag="record.status === 0 ? 'up' : 'down'">{{ text }}%</trend>
                </span>
              </a-table>
            </div>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="antd-pro-pages-dashboard-analysis-salesCard"
            :loading="loading"
            :bordered="false"
            :title="$t('lang.analysistheproportionofsales')"
            :style="{ marginTop: '24px', minHeight: '500px' }"
          >
            <div slot="extra" style="height: inherit;">
              <!-- style="bottom: 12px;display: inline-block;" -->
              <span class="dashboard-analysis-iconGroup">
                <a-dropdown :trigger="['click']" placement="bottomLeft">
                  <a-icon type="ellipsis" class="ant-dropdown-link"/>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a href="javascript:;">{{$t('lang.analysisHandle1')}}</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">{{$t('lang.analysisHandle2')}}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
              <div class="analysis-salesTypeRadio">
                <a-radio-group defaultValue="a">
                  <a-radio-button value="a">{{$t('lang.analysischannelall')}}</a-radio-button>
                  <a-radio-button value="b">{{$t('lang.analysischannelonline')}}</a-radio-button>
                  <a-radio-button value="c">{{$t('lang.analysischannelstores')}}</a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <h4>{{$t('lang.analysissales')}}</h4>
            <div>
              <!-- style="width: calc(100% - 240px);" -->
              <div>
                <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                  <v-tooltip :showTitle="false" data-key="item*percent"/>
                  <v-axis/>
                  <!-- position="right" :offsetX="-140" -->
                  <v-legend data-key="item"/>
                  <v-pie position="percent" color="item" :vStyle="pieStyle"/>
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6"/>
                </v-chart>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
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
import { mixinDevice } from '@/utils/mixin'
import store from '../../store'
let langs = store.getters.language

let rankList = [],
  rankListZh = [],
  rankListEn = []
for (let i = 0; i < 7; i++) {
  rankListZh.push({
    name: `白鹭岛${i + 1} 号店`,
    total: 1234.56 - i * 100
  })
  rankListEn.push({
    name: `Bailudao No.${i + 1} Shop`,
    total: 1234.56 - i * 100
  })
}

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment()
      .add(i, 'days')
      .format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}

let searchUserScale = []
let searchUserScaleZh = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0,
    max: 10
  }
]
let searchUserScaleEn = [
  {
    dataKey: 'x',
    alias: 'time'
  },
  {
    dataKey: 'y',
    alias: 'User Number',
    min: 0,
    max: 10
  }
]

let searchTableColumns = []
const searchTableColumnsZh = [
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
const searchTableColumnsEn = [
  {
    dataIndex: 'index',
    title: 'Ranking',
    width: 90
  },
  {
    dataIndex: 'keyword',
    title: 'Search keywords'
  },
  {
    dataIndex: 'count',
    title: 'User number'
  },
  {
    dataIndex: 'range',
    title: 'Weekly gain',
    align: 'right',
    sorter: (a, b) => a.range - b.range,
    scopedSlots: { customRender: 'range' }
  }
]
let searchData = []
let searchDataZh = []
let searchDataEn = []

for (let i = 0; i < 50; i += 1) {
  searchDataZh.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
  searchDataEn.push({
    index: i + 1,
    keyword: `Search Keywords-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
}

const DataSet = require('@antv/data-set')

let sourceData = []
let sourceDataZh = [
  { item: '家用电器', count: 32.2 },
  { item: '食用酒水', count: 21 },
  { item: '个护健康', count: 17 },
  { item: '服饰箱包', count: 13 },
  { item: '母婴产品', count: 9 },
  { item: '其他', count: 7.8 }
]
let sourceDataEn = [
  { item: 'Household Electric Appliances', count: 32.2 },
  { item: 'Edible wine', count: 21 },
  { item: 'Health care', count: 17 },
  { item: 'Clothing bags', count: 13 },
  { item: 'Mother infant products', count: 9 },
  { item: 'Others', count: 7.8 }
]
// 防刷新处理

const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
]
const dvZh = new DataSet.View().source(sourceDataZh)
dvZh.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
})
const dvEn = new DataSet.View().source(sourceDataEn)
dvEn.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
})

let pieData
if (langs == 'zh-CN') {
  pieData = dvZh.rows
} else if (langs == 'en-US') {
  pieData = dvEn.rows
}
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
  data() {
    return {
      loading: true,
      rankList,
      rankListZh,
      rankListEn,
      // 搜索用户数
      searchUserData,
      searchUserScale,
      searchUserScaleZh,
      searchUserScaleEn,
      searchTableColumns,
      searchData,
      searchDataZh,
      searchDataEn,
      //
      pieScale,
      pieData,
      sourceData,
      sourceDataZh,
      sourceDataEn,
      dvZh,
      dvEn,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    if (this.language == 'zh-CN') {
      this.searchTableColumns = searchTableColumnsZh
      this.sourceData = this.sourceDataZh
      this.searchData = this.searchDataZh
      this.rankList = this.rankListZh
      this.searchUserScale = this.searchUserScaleZh
      this.pieData = this.dvZh.rows
    } else if (this.language == 'en-US') {
      this.searchTableColumns = searchTableColumnsEn
      this.sourceData = this.sourceDataEn
      this.searchData = this.searchDataEn
      this.rankList = this.rankListEn
      this.searchUserScale = this.searchUserScaleEn
      this.pieData = this.dvEn.rows
    }
  },
  watch: {
    language(val) {
      if (val == 'zh-CN') {
        this.searchTableColumns = searchTableColumnsZh
        this.sourceData = this.sourceDataZh
        this.searchData = this.searchDataZh
        this.rankList = this.rankListZh
        this.searchUserScale = this.searchUserScaleZh
        this.pieData = this.dvZh.rows
      } else if (val == 'en-US') {
        this.searchTableColumns = searchTableColumnsEn
        this.sourceData = this.sourceDataEn
        this.searchData = this.searchDataEn
        this.rankList = this.rankListEn
        this.searchUserScale = this.searchUserScaleEn
        this.pieData = this.dvEn.rows
      }
    }
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

  &.desktop div[class^='ant-col']:last-child {
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
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>
