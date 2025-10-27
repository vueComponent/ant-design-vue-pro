<template>
  <page-header-wrapper v-if="pageShow">
    <template v-slot:extra>
      <a-tooltip title="刷新页面">
        <a-icon
          type="reload"
          style="font-size: 24px; cursor: pointer; color: #151515"
          @click="refresh"
        />
      </a-tooltip>
    </template>
    <template v-slot:content>
      <div class="page-header-content">
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="邀请码" :value="inviteCode" />
        </div>
        <div class="stat-item">
          <a-statistic title="用户数" :value="userStatData.total" />
        </div>
        <div class="stat-item">
          <a-statistic title="昨日新增" :value="userStatData.yesterdayAdd" />
        </div>
        <div class="stat-item">
          <a-statistic title="本月新增" :value="userStatData.monthAdd" />
        </div>
        <div class="stat-item">
          <a-statistic title="禁用" :value="userStatData.disabledNum" />
        </div>
      </div>
    </template>
    <div>
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="总余额" :total="moneyStatData.total">
            <template slot="footer">
              <span>实际余额: {{ moneyStatData.actual }}</span>
              <span style="float: right;">虚拟余额: {{ moneyStatData.virtually || 0 }}
                <a-tooltip title="高级版用户余额" slot="action">
                <a-icon type="info-circle-o" />
              </a-tooltip>
              </span>
              </template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="总收益" :total="settleAmountStatData.total">
            <template slot="footer">
              <span>上月: {{ settleAmountStatData.lastMonth }}</span><span style="float: right;">本月: {{ settleAmountStatData.currentMonth }}</span>
            </template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="总利润" :total="manageSettleAmountStatData.total">
            <!--
            <a-tooltip title="1010101010" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <mini-bar />
            </div>
            -->
            <template slot="footer">
              <span>上月: {{ manageSettleAmountStatData.lastMonth }}</span><span style="float: right;">本月: {{ manageSettleAmountStatData.currentMonth }}</span>
            </template>
          </chart-card>
        </a-col>
      </a-row>
      <!-- 节点信息 -->
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="总节点" :total="totalNodeStatData.total">
            <div>
              <trend flag="up" style="margin-right: 16px">
                <span slot="term">待审核：</span>
                {{ totalNodeStatData.boundNum }}
              </trend>
              <trend flag="down">
                <span slot="term">服务中：</span>
                {{ totalNodeStatData.inserviceNum }}
              </trend>
            </div>
            <template slot="footer"><span>X86: {{ totalNodeStatData.x86Num }}</span><span style="float: right;">盒子: {{ totalNodeStatData.boxNum }}</span></template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="在线节点" :total="onlineNodeStatData.total">
            <div>
            </div>
            <template slot="footer"><span>X86: {{ onlineNodeStatData.x86Num }}</span><span style="float: right;">盒子: {{ onlineNodeStatData.boxNum }}</span></template
            >
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="离线节点" :total="outlineNodeStatData.total">
            <div>
            </div>
            <template slot="footer"><span>X86: {{ outlineNodeStatData.x86Num }}</span><span style="float: right;">盒子: {{ outlineNodeStatData.boxNum }}</span></template>
          </chart-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { mapState } from "vuex";
import { PageHeaderWrapper } from "@ant-design-vue/pro-layout";
import { UserStat, TotalNodeStat, OnlineNodeStat, OutlineNodeStat, SettleAmountStat, ManageSettleAmountStat, MoneyStat, GetInviteCode } from '@/api/index/workplace'
import { ChartCard, MiniArea, MiniBar, MiniProgress } from "@/components";

export default {
  name: "Workplace",
  components: {
    PageHeaderWrapper,
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
  },
  data() {
    return {
      // 页面是否显示
      pageShow: true,
      loading: false,
      userStatData: {},
      totalNodeStatData: {},
      onlineNodeStatData: {},
      outlineNodeStatData: {},
      settleAmountStatData: {},
      manageSettleAmountStatData: {},
      moneyStatData: {},
      // 邀请码
      inviteCode: ''
    };
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome,
    }),
    currentUser() {
      return {
        name: "Serati Ma",
        avatar:
          "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
      };
    },
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  created() {
    this.user = this.userInfo;
    this.avatar = this.userInfo.avatar;
  },
  mounted() {
    this.userStat();
    this.totalNodeStat();
    this.onlineNodeStat();
    this.outlineNodeStat();
    this.settleAmountStat();
    this.manageSettleAmountStat();
    this.moneyStat();
    this.getInviteCode()
  },
  methods: {
    // 刷新lyAffair
    refresh() {
      this.pageShow = false;
      this.$nextTick(function () {
        this.pageShow = true;
        this.userStat();
        this.totalNodeStat();
        this.onlineNodeStat();
        this.outlineNodeStat();
        this.settleAmountStat();
        this.manageSettleAmountStat();
        this.moneyStat();
        this.getInviteCode()
      });
    },
    /**
     * 获取用户统计数据
     */
    async userStat() {
      const res = await UserStat();
      if (res.code === 0) {
        this.userStatData= res.result;
      }
    },
    /**
     * 获取总节点统计数据
     */
    async totalNodeStat() {
      const res = await TotalNodeStat();
      if (res.code === 0) {
        this.totalNodeStatData = res.result;
      }
    },
    /**
     * 获取在线节点统计数据
     */
    async onlineNodeStat() {
      const res = await OnlineNodeStat();
      if (res.code === 0) {
        this.onlineNodeStatData = res.result;
      }
    },
    /**
     * 获取离线节点统计数据
     */
    async outlineNodeStat() {
      const res = await OutlineNodeStat();
      if (res.code === 0) {
        this.outlineNodeStatData = res.result;
      }
    },
    /**
     * 获取结算金额统计数据
     */
    async settleAmountStat() {
      const res = await SettleAmountStat();
      if (res.code === 0) {
        this.settleAmountStatData = res.result;
      }
    },
    async manageSettleAmountStat() {
      const res = await ManageSettleAmountStat();
      if (res.code === 0) {
        this.manageSettleAmountStatData = res.result;
      }
    },
    /**
     * 余额统计
     */
    async moneyStat() {
      const res = await MoneyStat();
      if (res.code === 0) {
        this.moneyStatData = res.result;
      }
    },
    /**
     * 获取邀请码
     */
    async getInviteCode() {
      const res = await GetInviteCode();
      if (res.code === 0) {
        this.inviteCode = res.result;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "./Workplace.less";

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  div {
    display: inline-block;
    margin-bottom: 13px;
    width: 33.33%;
    a {
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
    }
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
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
