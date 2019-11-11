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
        <div v-if="code == 0">
          <case-info :patient="patient"></case-info>
        </div>
        <div v-else-if="code == -1" class="tip">未查询到该患者病例，是否<span class="add" @click="$refs.createModal.add()">新增患者病例</span>?</div>
        <div v-else-if="code == 1" class="tip">该患者病例不在本分支中心，请进行病例转移申请</div>
      </div>
      <create-form ref="createModal" @ok="handleOk" />
    </a-spin>
  </a-modal>
</template>

<script>
  import { wxPatientReview, wxBind } from '@/api/distract'
  import CaseInfo from './CaseInfo'
  import CreateForm from '../../list/modules/CreateForm';
  export default {
    components: {
      CaseInfo,
      CreateForm
    },
    data() {
      return {
        bodyStyle: {
          height: '500px',
          paddingTop: '0',
          overflow: 'auto'
        },
        maskClosable: false,
        centered: true,
        destroyOnClose: true,
        visible: false,
        confirmLoading: false,
        userInfo: {},
        patient: {},
        code: 0
      }
    },
    methods: {
      handleOk() {
        this.show(this.userInfo)
      },
      show(recode) {
        this.visible = true;
        this.confirmLoading = true
        this.patient = {}
        this.userInfo = recode

        const params = new FormData()
        params.append('card', recode.card)
        wxPatientReview(params).then(res => {
          this.confirmLoading = false
          this.code = res.code
          if (res.code == 0) {
            this.patient = res.data
          }
        })
      },
      handleSubmit() {
        if (JSON.stringify(this.patient) == '{}') {
          this.$message.error('患者病例信息为空无法绑定！');
          return
        }
        this.confirmLoading = true
        const params = new FormData()
        params.append('patientId', this.patient.patientId)
        params.append('wxPatient', JSON.stringify(this.userInfo))
        wxBind(params).then(res => {
          this.visible = false
          this.confirmLoading = false
          this.$message.success(res.msg);
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
      p {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
      }
    }
    .tip {
      height: 100px;
      line-height: 100px;
      font-size: 16px;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
      .add {
        cursor: pointer;
        color: rgba(24, 144, 255, 0.8);
        font-size: inherit;
      }
    }
  }
</style>