<template>
  <a-modal
    title="选择患者"
    :width="800"
    :destroyOnClose="destroyOnClose"
    :bodyStyle="bodyStyle"
    :centered="centered"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="checkuUser"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="patientDetail-box">
        <a-row>
          <a-col :span="12">
            <p class>
              <span class>档案编号：</span>
              <span class>{{patientDetail.fileCode}}</span>
            </p>
          </a-col>
          <a-col :span="12">
            <p class>
              <span class>患者姓名：</span>
              <span class>{{patientDetail.name}}</span>
            </p>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <p class>
              <span class>身份证号：</span>
              <span class>{{patientDetail.card}}</span>
            </p>
          </a-col>
          <a-col :span="12">
            <p class>
              <span class>电话号码：</span>
              <span class>{{patientDetail.telephone1}}</span>
            </p>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <p class>
              <span class>所属中心：</span>
              <span class>{{patientDetail.centerName}}</span>
            </p>
          </a-col>
        </a-row>
       
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { getPatientDetailByCard } from '@/api/patient'
import moment from 'moment'
import _ from 'lodash'

export default {
  data() {
    return {
      name: '',
      userData: {},
      loading: false,
      visible: false,
      confirmLoading: false,
      destroyOnClose: true,
      centered: true,
      bodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      patientDetail: {}
    }
  },
  mounted() {
    this.userData = {}
  },
  methods: {
    add(value) {
      this.visible = true
      this.confirmLoading = true
      this.getPatientDetailByCard(value)
    },
    checkuUser() {
      this.$emit('listen', this.patientDetail)
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    getPatientDetailByCard(card) {
      const Card = card ? card : ''
      const Params = new URLSearchParams()
      Params.append('card', card)
        this.confirmLoading = false
      getPatientDetailByCard(Params).then(res => {
        this.patientDetail = res.data
        // this.confirmLoading = false
      })
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.userData = selectedRows
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  }
}
</script>

<style lang="less">
.patientDetail-box {
  padding: 20px;
  font-size: 18px;
}
</style>
