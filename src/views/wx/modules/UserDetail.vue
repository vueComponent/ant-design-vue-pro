<template>
  <a-modal title="微信用户绑定" okText="绑定" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <div class="patientDetail-box">
        <a-divider orientation="left">微信用户信息</a-divider>
        <div class="patient">
          <a-row>
            <a-col :span="8">
              <p>患者姓名：{{userInfo.name}}</p>
            </a-col>
            <a-col :span="8">
              <p>微信号：{{userInfo.wxCode}}</p>
            </a-col>
            <a-col :span="8">
              <p>手机号码：{{userInfo.telephone}}</p>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <p>微信昵称：{{userInfo.wxName}}</p>
            </a-col>
            <a-col :span="8">
              <p>身份证号：{{userInfo.card}}</p>
            </a-col>
            <a-col :span="8">
              <p>注册时间：{{userInfo.registeredDate}}</p>
            </a-col>
          </a-row>
        </div>

        <a-divider orientation="left">患者病例信息</a-divider>
        <div v-if="JSON.stringify(patient) != '{}'">
          <case-info :patient="patient"></case-info>
        </div>
        <div v-else class="tip">{{ tipMsg }}</div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
  import { wxPatientReview, wxBind } from '@/api/distract'
  import CaseInfo from './CaseInfo'
  export default {
    components: {
      CaseInfo
    },
    data() {
      return {
        bodyStyle: {
          height: '500px',
          overflow: 'auto'
        },
        maskClosable: false,
        centered: true,
        destroyOnClose: true,
        visible: false,
        confirmLoading: false,
        userInfo: {},
        patient: {},
        tipMsg: ''
      }
    },
    methods: {
      show(recode) {
        this.visible = true;
        this.confirmLoading = true
        this.userInfo = recode

        const params = new FormData()
        params.append('card', recode.card)
        wxPatientReview(params).then(res => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.patient = res.data
          } else {
            this.tipMsg = res.msg
          }
        })
      },
      handleSubmit() {
        this.confirmLoading = true
        const params = {
          patientId: this.patient.patientId,
          wxPatient: this.userInfo
        }
        wxBind(params).then(res => {
          this.$message.success(res.msg);
          this.visible = false
          this.confirmLoading = false
          this.$emit('ok')
        })
      },
      handleCancel() {
        this.visible = false
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .ant-divider-horizontal.ant-divider-with-text-left {
    color: #1890ff;
  }

  .patientDetail-box {
    font-size: 18px;
    .title {
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      padding-left: 15px;
      margin-bottom: 15px;
      background-color: #fafafa;
    }
    .patient {
      border: 1px solid rgba(22, 143, 253, 0.15);
      background: #f5f9fd;
      padding: 15px 25px;
    }
    .tip {
      height: 100px;
      line-height: 100px;
      font-size: 16px;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
    }
    p {
      font-size: 14px;
    }
  }
</style>