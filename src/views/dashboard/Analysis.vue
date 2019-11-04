<template>
  <div class="page-header-index-wide">
    <a-row :gutter="10">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
        <chart-card :loading="loading" title="本月患者数" :total="indexData.currMonthPatients">
          <a-tooltip title="指标说明" slot="action"><a-icon type="info-circle-o" /></a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">月同比</span>
              {{ indexData.compareMonth }}%
            </trend>
          </div>
          <template slot="footer">
            上月患者数
            <span>{{ indexData.lastMonthPatients }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
        <chart-card :loading="loading" title="本月访视数" :total="indexData.currMonthBasis">
          <a-tooltip title="指标说明" slot="action"><a-icon type="info-circle-o" /></a-tooltip>
          <div><mini-area /></div>
          <template slot="footer">
            上月访视数
            <span>{{ indexData.lastMonthBasis }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
        <chart-card :loading="loading" title="本年患者数" :total="indexData.currYearPatients">
          <a-tooltip title="指标说明" slot="action"><a-icon type="info-circle-o" /></a-tooltip>
          <div><mini-bar /></div>
          <template slot="footer">
            上年患者数
            <span>{{ indexData.currYearPatients }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
        <chart-card :loading="loading" title="患者总数" :total="indexData.realNum">
          <a-tooltip title="指标说明" slot="action"><a-icon type="info-circle-o" /></a-tooltip>
          <div><mini-progress color="rgb(24,144,255)" :target="indexData.completionRate" :percentage="indexData.completionRate" height="8px" /></div>
          <template slot="footer">
            <p style="margin-right: 16px;display: inline-block;margin-bottom: 0;">
               <span slot="term" >计划数</span>
              {{ indexData.planNum }}
            </p>
             
            <trend flag="up" style="float: right;">
              <span slot="term">完成率</span>
              {{ indexData.completionRate }}%
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>
    <a-row :gutter="10">
      <a-col :sm="48" :md="24" :xl="12" :style="{ marginBottom: '10px' }">
        <a-card :loading="loading" :bodyStyle="bodyStyle" title="我的工作" total="￥126,560">
          <a-row :gutter="10">
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 12px' }">
              <div class="card-wait-data">
                <span class="myIcon"><my-icon type="iconziyuan1" /></span>
                <div>
                  <p>待办访视</p>
                  <h1>{{ myWork.nodoVisitsNum }}</h1>
                </div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 12px' }">
              <div class="card-wait-data">
                <span class="myIcon"><my-icon type="iconziyuan1" /></span>
                <div>
                                  <p>待审转移病例</p>
                  <h1>{{ myWork.noDoPatientTransferNum }}</h1>
                </div>

              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 12px' }">
              <div class="card-wait-data">
                <span class="myIcon"><my-icon type="iconziyuan" /></span>
                <div>
                                  <p>待审问卷</p>
                  <h1>{{ myWork.noDoQuestionNum }}</h1>
                </div>

              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 12px' }">
              <div class="card-wait-data">
                <span class="myIcon"><my-icon type="iconziyuan" /></span>
                <div>
                                  <p>其他待办</p>
                  <h1>{{ myWork.otherNum }}</h1>
                </div>

              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :sm="48" :md="24" :xl="12" :style="{ marginBottom: '10px' }">
        <a-card :loading="loading" title="病例省份占比">
          <div>
            <pie></pie>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="10">
      <a-col :sm="48" :md="24" :lg="14" :style="{ marginBottom: '10px' }">
        <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
          <div class="salesCard tooltip-y">
            <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '10px', paddingLeft: '16px' }">
              <a-tab-pane loading="true" tab="新增病例数" key="1">
                <a-row>
                  <a-col :push="1" :xl="22" :lg="22" :md="22" :sm="24" :xs="24"><bar :data="eachMonthPatients" title="新增病例数" /></a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane tab="新增访视数" key="2">
                <a-row>
                  <a-col :push="1" :xl="22" :lg="22" :md="22" :sm="24" :xs="24"><bar :data="eachMonthBasiss" title="新增访视数" /></a-col>
                </a-row>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="48" :md="24" :lg="10" :style="{ marginBottom: '10px' }">
        <a-card :loading="loading" title="操作培训" :bordered="false" :body-style="{ padding: '0' }" :style="{ height: '360px' }">
          <div class="salesCard"><rank-list :list="rankList" /></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment';
import { Pie, ChartCard, MiniArea, MiniBar, MiniProgress, RankList, Bar, Trend, NumberInfo, MiniSmoothArea } from '@/components';
import { mixinDevice } from '@/utils/mixin';
import { getAllNumbers, getMyWork, getPatientsAndBasiss, getProvinceCompare } from '@/api/home';
import { MyIcon } from '@/components/_util/util';

const rankList = [];
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '数据网络平台演示' + (i + 1) ,
    total: 1234.56 - i * 100
  });
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
    NumberInfo,
    MiniSmoothArea,
    Pie,
    MyIcon,
    Trend
  },
  data() {
    return {
      bodyStyle:{
        padding:'12px 20px',
      },
      indexData: {},
      myWork: {},
      loading: true,
      rankList,
      eachMonthPatients:[],
      eachMonthBasiss:[],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    };
  },
  created() {
    getAllNumbers().then(res => {
      this.indexData = res.data.allNumbers;
    });
    getMyWork().then(res => {
      this.myWork = res.data.myWork;
    });
    getPatientsAndBasiss().then(res => {
      const that=this;
      const keyMap = { monthDate: 'x', monthPatients: 'y' };
       const keyMap1={monthDate: 'x', monthBasis: 'y' }
      _.each(res.data.eachMonthPatients, function(item, index) {
        //  console.log(item)
        item.monthDate=item.monthDate+"月";
        // item.monthPatients=item.monthPatients;
        that.eachMonthPatients[index] = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap[key] || key;
          newData[newKey] = item[key];
          return newData;
        }, {});
      });
       _.each(res.data.eachMonthBasiss, function(item, index) {
        //  console.log(item)
        item.monthDate=item.monthDate+"月";
        that.eachMonthBasiss[index] = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap1[key] || key;
          newData[newKey] = item[key];
          return newData;
        }, {});
      });
    });
    setTimeout(() => {
      this.loading = !this.loading;
    }, 1000);
  }
};
</script>

<style lang="less" scoped>
/deep/.ant-pro-trend .up {
  color: #1aa355;
}
/deep/.ant-tabs .ant-tabs-large-bar .ant-tabs-tab {
    padding: 12px 16px;
}
/deep/.ant-card-head-title{
  padding: 10px 0px;
}

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
.card-wait-data {
  box-sizing: border-box;
  padding: 20px;
  background-color: #f7f8f8;
  height: 90px;
  background-image: url('');
  span.myIcon {
    display: inline-block;
    vertical-align: top;
    width: 40px;
    .anticon {
      font-size: 25px;
    }
  }
  div {
    display: inline-block;
    p {
      margin-bottom: 0px;
    }
    h1 {
      font-size: 30px;
      font-weight: normal;
      color: #000000;
    }
  }
}
/deep/.tooltip-y{
  /deep/.g2-tooltip-list li{
    font-size: 0px;
    position: relative;
    /deep/.g2-tooltip-marker{
      display: none !important;
    }
    /deep/.g2-tooltip-value{
      position: absolute;
      font-size: 12px;
      left: -30px;
    }
  }
}

</style>
