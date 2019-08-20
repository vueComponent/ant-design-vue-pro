<template>
  <a-modal
    title="患者详情"
    :width="800"
    :bodyStyle="bodyStyle"
    :maskClosable="maskClosable"
    :centered="centered"
    :destroyOnClose="destroyOnClose"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
     @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <user-detail :option="patient"></user-detail>
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="详细信息" key="1">
          <div class="userCard">
            <a-row id="userInfo">
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>患者同意注册日期：</span>
                  {{ patient.registerDate | fromDate }}
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
                  {{ patient.visit |visitStatus}}
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
                  {{ patient.ceateDate| fromDate }}
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
        <a-tab-pane tab="待访视任务" key="2" forceRender><div class="userCard"></div></a-tab-pane>
        <a-tab-pane tab="访视情况" key="3">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
import { getPatientDetail } from '@/api/patient';
import UserDetail from './UserDetailTop';
import moment from 'moment';
import _ from 'lodash';
export default {
  components: {
    UserDetail
  },
  data() {
    return {
      patientBasisList: {},
      visitTasks: {},
      patient: {},
      visible: false,
      confirmLoading: false,
      centered: true,
      maskClosable: false,
      destroyOnClose: true,
      bodyStyle: {
        height: '600px',
        overflow: 'auto'
      }
    };
  },
  filters: {
    fromDate(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    visitStatus(value){
        const visitMap = {
          '1': '忽略',
          '2': '未执行',
          '3': '执行中',
          '4': '已完成',
        }
        return visitMap[value]
    }
  },
  methods: {
    show(value) {
      this.visible = true;
      this.confirmLoading = true;
      const Params = new URLSearchParams();
      Params.append('patientId', value.patientId);
      getPatientDetail(Params).then(res => {
        this.patient = res.data.patient;
        this.patientBasisList = res.data.patientBasisList;
        this.visitTasks = res.data.visitTasks;
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
    },
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
  height: 300px;
  overflow: auto;
  #userInfo {
    p.userInfoItem {
      color: #000000;
      span {
        color: #888888;
      }
    }
  }
}
</style>
