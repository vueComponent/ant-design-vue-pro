<template>
  <a-modal title="患者详情" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" :footer="null" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <user-detail :option="patient"></user-detail>
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="详细信息" key="1">
          <div class="userCard">
            <a-row id="userInfo">
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>患者同意注册日期：</span>
                  {{ patient.registerDate | formDate }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>文化程度：</span>
                  {{ patient.censusName }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>访视状态：</span>
                  {{ patient.visitName }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>医疗费用支付情况：</span>
                  {{ patient.payTypeName }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>职业：</span>
                  {{ patient.workName }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>家庭年收入：</span>
                  {{ patient.income }}万
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>创建机构：</span>
                  {{ patient.centerName }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>创建时间：</span>
                  {{ patient.ceateDate | formDate }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>创建人：</span>
                  {{ patient.creatorName }}
                </p>
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="待访视任务" key="2" forceRender>
          <div class="userCard" v-if="visitTasks.length>0">
            <div class="followupItem" v-for="item in visitTasks" :key="item.id">
              <my-icon class="my-icon-huaban" type="iconshijian_huaban" />
              <p>
                <span>计划时间：</span>
                {{item.planDate | formDate}}
              </p>
              <p>
                <span>随访摘要：</span>
                {{item.typeName}}
              </p>
              <a @click="exec(item.patientBasisId)">
                <a-button type="primary" size="small" style="float:right;">
                  <my-icon type="iconxiangqing_huaban" />
                  执行
                </a-button>
              </a>
            </div>
          </div>
          <div v-else class="userCard">
            <div style="text-align: center;">
              <img src="@/assets/noData.png" alt="">
              <p>暂无数据</p>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="访视情况" key="3">
          <div class="userCard" v-if="patientBasisList.length>0">
            <a-timeline>
              <a-timeline-item v-for="item in patientBasisList" :key="item.id">
                <span class="followupDate">{{item.createDate|formDate}}</span>
                <div class="followupInfoItem">
                  <div class="followupInfoItemType">
                    <p>
                      访视类型:
                      <span>{{item.type|patientBasisType}}</span>
                    </p>
                    <p>访视时间: {{item.wirteDate|formDate}}</p>
                  </div>
                  <div class="followupInfoItemPro">
                    <p>
                      访视进度:
                      <span>{{item.executeStatus == 3 ? '已完成' : '未完成'}}</span>
                    </p>
                    <!-- <p>
                      <a-progress  :percent="item.progress" status="active" />
                    </p> -->
                  </div>
                  <a v-if="item.type == 1" @click="basisDetail(item.patientBasisId)">
                    <a-button type="primary" size="small" style="float:right;margin-top:5px ;">
                      <my-icon type="iconxiangqing_huaban" />
                      详情
                    </a-button>
                  </a>
                  <a v-else-if="item.type == 2||item.type == 3" @click="taskDetail(item.patientBasisId)">
                    <a-button type="primary" size="small" style="float:right;margin-top:5px ;">
                      <my-icon type="iconxiangqing_huaban" />
                      详情
                    </a-button>
                  </a>
                  <a v-else-if="item.type == 4" @click="jxjzq(item.patientBasisId)">
                    <a-button type="primary" size="small" style="float:right;margin-top:5px;">
                      <my-icon type="iconxiangqing_huaban" />
                      详情
                    </a-button>
                  </a>
                </div>
              </a-timeline-item>
            </a-timeline>
          </div>
          <div v-else class="userCard">
            <div style="text-align: center;">
              <img src="@/assets/noData.png" alt="">
              <p>暂无数据</p>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
      <div class="scores" v-if="zkScore != 0">
        <p class="title">支扩评分</p>
        <a-row :gutter="10">
          <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">BSI评分</div>
              <div class="score">{{scoreData.BSI}}分</div>
              <mini-progress color="rgb(24,144,255)" :target="scoreData.BSI" :percentage="scoreData.BSI" height="8px" />
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">FACED评分</div>
              <div class="score">{{scoreData.FACED}}分</div>
              <mini-progress color="rgb(24,144,255)" :target="scoreData.FACED" :percentage="scoreData.FACED" height="8px" />
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">BACI评分</div>
              <div class="score">{{scoreData.BACI}}分</div>
              <mini-progress color="rgb(24,144,255)" :target="scoreData.BACI" :percentage="scoreData.BACI" height="8px" />
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">Reffi评分</div>
              <div class="score">{{scoreData.Reiff}}分</div>
              <mini-progress color="rgb(24,144,255)" :target="scoreData.Reiff" :percentage="scoreData.Reiff" height="8px" />
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="scores" v-if="zkScore != 0">
        <p class="title">问卷评分</p>
        <a-row :gutter="10">
          <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">BHQ评分</div>
              <div class="score">{{scoreData.BHQ.score}}分</div>
              <mini-progress color="rgb(24,144,255)" :target="scoreData.BHQ.score" :percentage="scoreData.BHQ.score" height="8px" />
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">MMRC评分</div>
              <div class="score">{{scoreData.MMRC.score}}分</div>
              <mini-progress color="rgb(24,144,255)" :target="scoreData.MMRC.score" :percentage="scoreData.MMRC.score" height="8px" />
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">HAD评分</div>
              <div class="score">{{scoreData.HAD.score}}分</div>
              <mini-progress color="rgb(24,144,255)" :target="scoreData.HAD.score" :percentage="scoreData.HAD.score" height="8px" />
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">LCQ评分</div>
              <div class="score">总{{scoreData.LCQ.score}}分</div>
              <a-row :gutter="10">
                <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
                  <label>生理</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.LCQ.score1" :percentage="scoreData.LCQ.score1" height="8px" />
                  <label>{{scoreData.LCQ.score1}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
                  <label>心理</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.LCQ.score2" :percentage="scoreData.LCQ.score2" height="8px" />
                  <label>{{scoreData.LCQ.score2}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '10px' }">
                  <label>社会</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.LCQ.score3" :percentage="scoreData.LCQ.score3" height="8px" />
                  <label>{{scoreData.LCQ.score3}}分</label>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '10px' }">
            <div class="block clearfix">
              <div class="name">QoL-B评分</div>
              <a-row :gutter="10">
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>身体功能性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score1" :percentage="scoreData.QOLB.score1" height="8px" />
                  <label>{{scoreData.QOLB.score1}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>角色功能性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score2" :percentage="scoreData.QOLB.score2" height="8px" />
                  <label>{{scoreData.QOLB.score2}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>活力性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score3" :percentage="scoreData.QOLB.score3" height="8px" />
                  <label>{{scoreData.QOLB.score3}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>情绪功能性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score4" :percentage="scoreData.QOLB.score4" height="8px" />
                  <label>{{scoreData.QOLB.score4}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>社会功能性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score5" :percentage="scoreData.QOLB.score5" height="8px" />
                  <label>{{scoreData.QOLB.score5}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>医疗负担性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score6" :percentage="scoreData.QOLB.score6" height="8px" />
                  <label>{{scoreData.QOLB.score6}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>健康感觉性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score7" :percentage="scoreData.QOLB.score7" height="8px" />
                  <label>{{scoreData.QOLB.score7}}分</label>
                </a-col>
                <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '10px' }">
                  <label>呼吸症状性维度</label>
                  <mini-progress color="rgb(24,144,255)" :target="scoreData.QOLB.score8" :percentage="scoreData.QOLB.score8" height="8px" />
                  <label>{{scoreData.QOLB.score8}}分</label>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import { getPatientDetail } from '@/api/patient'
import UserDetail from './UserDetailTop'
import { MyIcon } from '@/components/_util/util'
import { ChartCard, MiniProgress } from '@/components';
import moment from 'moment'
import _ from 'lodash'
import 'url-search-params-polyfill'

export default {
  components: {
    UserDetail,
    MyIcon,
    ChartCard,
    MiniProgress
  },
  data() {
    return {
      patientBasisList: [],
      visitTasks: [],
      patient: {},
      visible: false,
      confirmLoading: false,
      centered: true,
      maskClosable: false,
      destroyOnClose: true,
      bodyStyle: {
        height: '500px',
        overflow: 'auto',
        background: "#F8FBFC"
      },
      zkScore: 0,
      scoreData: {}
    }
  },
  filters: {
    formDate(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    // visitStatus(value) {
    //   const visitMap = {
    //     '1': '忽略',
    //     '2': '未执行',
    //     '3': '执行中',
    //     '4': '已完成'
    //   };
    //   return visitMap[value];
    // },
    patientBasisType(type) {
      const patientBasisTypeMap = ['', '基线', '半年随访', '年访视', '急性加重期随访']
      return patientBasisTypeMap[type];
    }
  },
  methods: {
    show(value) {
      this.visible = true
      this.confirmLoading = true
      const Params = new URLSearchParams()
      Params.append('patientId', value.patientId)
      getPatientDetail(Params).then(res => {
        this.patient = res.data.patient
        this.patientBasisList = res.data.patientBasisList
        this.visitTasks = res.data.visitTasks
        this.confirmLoading = false
        this.zkScore = res.data.zkScore
        this.scoreData = res.data
      });
    },
    handleCancel() {
      this.visible = false
    },
    basisDetail(id) {
      this.visible = false
      this.$router.push('/list/basis/' + id)
    },
    taskDetail(id) {
      this.visible = false
      this.$router.push('/list/task/' + id)
    },
    jxjzq(id) {
      this.visible = false
      this.$router.push('/jxjzq/' + id)
    },
    exec(id) {
      this.visible = false
      this.$router.push('/list/task/' + id)
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ant-modal-body {
  background-color: #fdfdfd;
}

.userCard {
  background: #ffffff;
  padding: 20px;
  border: 1px solid #f1f1f1;
  padding-right: 0px;
  overflow: auto;

  #userInfo {
    p.userInfoItem {
      color: #000000;

      span {
        color: #888888;
      }
    }
  }

  .followupItem {
    border-bottom: 1px dashed #f3f3f3;
    padding-bottom: 10px;
    margin-bottom: 15px;
    padding-right: 20px;

    .my-icon-huaban {
      color: #26adfa;
      font-size: 30px;
      margin-right: 10px;
      vertical-align: middle;
    }

    p {
      display: inline-block;
      margin: 0px;
      margin-right: 40px;
      color: #000000;

      span {
        color: #888888;
      }
    }
  }

  span.followupDate {
    display: inline-block;
    border: 1px solid #dddddd;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 15px;
    vertical-align: top;
    position: relative;
    top: -3px;
  }

  div.followupInfoItem {
    display: inline-block;
    width: 590px;
    background: #F1F8FE;
    margin-left: 20px;
    position: relative;
    top: -11px;
    padding: 5px 20px;

    div.followupInfoItemType {
      display: inline-block;
      width: 200px;
      font-size: 12px;

      p:first-child {
        color: #000;
        margin-bottom: 5px;
        font-size: 14px;

        span {
          color: #F0C070;
        }
      }

      p:nth-child(2) {
        margin: 0;
      }
    }

    div.followupInfoItemPro {
      display: inline-block;
      width: 200px;
      vertical-align: top;

      span {
        font-size: 14px;
        color: #000;
      }

      p {
        //  width: 100px;
        display: inline-block;
        margin: 0;
        margin-left: 10px;
        //  /deep/ .ant-progress-inner{
        //    background-color:#C4C4C4;
        //  }
      }
    }
  }

}

::-webkit-scrollbar-track-piece {
  //滚动条凹槽的颜色，还可以设置边框属性
  background-color: #f8f8f8;
}

::-webkit-scrollbar {
  //滚动条的宽度
  width: 5px;
  height: 9px;
}

::-webkit-scrollbar-thumb {
  //滚动条的设置
  background-color: #dddddd;
  background-clip: padding-box;
  min-height: 28px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}
.scores{
  margin-top: 10px;
  border-top: 2px solid #168ffd;
  background-color: #fff;
  padding: 10px;
  .title{
    color: #096dd9;
    margin-bottom: 10px;
  }
  .block{
    border: 1px solid #eee;
    padding: 10px;
    .name{
      float: left;
    }
    .score{
      float: right;
      color: #096dd9;
      &.no{
        color: gray;
      }
    }
    .chart-mini-progress{
      clear: both;
    }
    .ant-row{
      clear: both;
      margin-top: 30px;
      .chart-mini-progress{
        clear: none;
        float: left;
        width: 56%;
        margin: 0 10px;
      }
      label{
        float: left;
        font-size: 12px;
      }
    }
  }
  
}
</style>