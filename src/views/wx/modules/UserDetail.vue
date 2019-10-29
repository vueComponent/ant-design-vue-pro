<template>
  <a-modal title="微信用户绑定" okText="绑定" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <div class="patientDetail-box">
        <a-row>
          <a-col :md="12" :sm="24">
            <p>
              <span>患者姓名：</span>
              <span>{{info.name}}</span>
            </p>
          </a-col>
          <a-col :md="12" :sm="24">
            <p>
              <span>微信号：</span>
              <span>{{info.wxCode}}</span>
            </p>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="12" :sm="24">
            <p>
              <span>微信昵称：</span>
              <span>{{info.wxName}}</span>
            </p>
          </a-col>
          <a-col :md="12" :sm="24">
            <p>
              <span>身份证号：</span>
              <span>{{info.card}}</span>
            </p>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="12" :sm="24">
            <p>
              <span>手机号码：</span>
              <span>{{info.telephone}}</span>
            </p>
          </a-col>
          <a-col :md="12" :sm="24">
            <p>
              <span>注册时间：</span>
              <span>{{info.registeredDate}}</span>
            </p>
          </a-col>
        </a-row>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
  import { wxPatientReview, wxBind } from '@/api/distract'
  export default {
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
        info: {},
        details: {}
      }
    },
    methods: {
      show(recode) {
        this.visible = true;
        this.confirmLoading = false
        this.info = recode
        const params = {
          card: recode.card
        }
        wxPatientReview(params).then(res => {
          this.details = res.data
        })
      },
      handleSubmit() {
        this.confirmLoading = true
        const params = {
          patientId: this.details.patientId,
          wxPatient: this.info
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
  .patientDetail-box {
    font-size: 18px;
    padding: 20px;
  }
</style>