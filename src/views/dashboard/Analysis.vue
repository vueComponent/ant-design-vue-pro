<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总销售额" total="￥126,560">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <div style="display: inline-block; font-size: 14px; line-height: 22px; margin-right: 16px">
              同周比
              <span>12%</span>
              <span style="color: #f5222d; font-size: 12px"><a-icon type="caret-up" /></span>
            </div>
            <div style="display: inline-block; font-size: 14px; line-height: 22px;">
              日环比
              <span>11%</span>
              <span style="color: #52c41a; font-size: 12px"><a-icon type="caret-down" /></span>
            </div>
          </div>
          <div slot="footer">日均销售额<span>￥ 234.56</span></div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总销售额" total="￥126,560">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area />
          </div>
          <div slot="footer">日均销售额<span>￥ 234.56</span></div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总销售额" total="￥126,560">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <div style="display: inline-block; font-size: 14px; line-height: 22px; margin-right: 16px">
              同周比
              <span>12%</span>
              <span style="color: #f5222d; font-size: 12px"><a-icon type="caret-up" /></span>
            </div>
            <div style="display: inline-block; font-size: 14px; line-height: 22px;">
              日环比
              <span>11%</span>
              <span style="color: #52c41a; font-size: 12px"><a-icon type="caret-down" /></span>
            </div>
          </div>
          <div slot="footer">日均销售额<span>￥ 234.56</span></div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总销售额" total="￥126,560">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <div style="display: inline-block; font-size: 14px; line-height: 22px; margin-right: 16px">
              同周比
              <span>12%</span>
              <span style="color: #f5222d; font-size: 12px"><a-icon type="caret-up" /></span>
            </div>
            <div style="display: inline-block; font-size: 14px; line-height: 22px;">
              日环比
              <span>11%</span>
              <span style="color: #52c41a; font-size: 12px"><a-icon type="caret-down" /></span>
            </div>
          </div>
          <div slot="footer">日均销售额<span>￥ 234.56</span></div>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>今日</a>
              <a>本周</a>
              <a>本月</a>
              <a>本年</a>
            </div>
            <a-range-picker :style="{width: '256px'}" />
          </div>
          <a-tab-pane loading="true" tab="销售额" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="销售额排行" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="访问量" key="2"><a-row>
            <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
              <bar title="销售额趋势" />
            </a-col>
            <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <rank-list title="门店销售排行榜" :list="rankList"/>
            </a-col>
          </a-row></a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <a-row :gutter="12">
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card :loading="loading" :bordered="false" title="线上热门搜索" :style="{ marginTop: '24px' }">
          <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
            <a class="ant-dropdown-link" href="#">
              <a-icon type="ellipsis" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;">操作一</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">操作二</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <p>card content</p>
          <p>card content</p>
          <p>card content</p>
        </a-card>
      </a-col>
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card :loading="loading" :bordered="false" title="销售额类别占比" :style="{ marginTop: '24px' }">
          <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
            <a class="ant-dropdown-link" href="#">
              <a-icon type="ellipsis" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;">操作一</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">操作二</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <p>card content</p>
          <p>card content</p>
          <p>card content</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import moment from "moment"
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import MiniArea from '@/components/chart/MiniArea'
  import RankList from '@/components/chart/RankList'
  import Bar from '@/components/chart/Bar'

  const rankList = []
  for (let i = 0; i < 7; i++) {
    rankList.push({
      name: '白鹭岛 ' + (i+1) + ' 号店',
      total: 1234.56 - i * 100
    })
  }

  export default {
    name: "Analysis",
    components: {
      ATooltip,
      ACol,
      ChartCard,
      MiniArea,
      RankList,
      Bar
    },
    data() {
      return {
        moment,
        loading: true,
        rankList
      }
    },
    created() {
      setTimeout(() => {
        this.loading = !this.loading
      }, 1000)
    }
  }
</script>

<style lang="scss" scoped>
    .extra-wrapper {
        line-height: 55px;
        padding-right: 24px;

        .extra-item{
            display: inline-block;
            margin-right: 24px;

            a {
                margin-left: 24px;
            }
        }
    }
</style>