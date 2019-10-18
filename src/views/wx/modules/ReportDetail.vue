<template>
  <a-modal title="审阅" okText="审阅" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="报告标题">
          <a-input v-decorator="['reportTitle']" readOnly />
        </a-form-item>
        <a-form-item label="报告详情">
          <a-textarea rows="3" v-decorator="['reprotDescription']" readOnly />
        </a-form-item>
        <a-form-item label="上报时间">
          <a-date-picker style="width: 100%" format="YYYY-MM-DD" v-decorator="['executeDate']" disabled />
        </a-form-item>
        <a-form-item label="报告附件">
          <ul>
            <li v-for="item in imgList" :key="item.id">
              <img :src="`${attachsPrefix}${item.annexAddress}`" alt="">
            </li>
          </ul>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import { getReportInfo, updateReport } from '@/api/reportCheck'
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
        checkId: '',
        form: this.$form.createForm(this),
        attachsPrefix: '',
        imgList: []
      }
    },
    methods: {
      show(id) {
        this.visible = true;
        this.checkId = id

        this.confirmLoading = true

        const params = {
          checkId: id
        }
        getReportInfo(params).then(res => {
          this.confirmLoading = false
          this.imgList = res.data.annexList
          this.attachsPrefix = res.data.attachsPrefix

          this.form.setFieldsValue({
            reportTitle: res.data.reportCheck.reportTitle,
            reprotDescription: res.data.reportCheck.reprotDescription,
            executeDate: moment(res.data.reportCheck.executeDate, 'x')
          });
        })
      },
      handleSubmit() {
        this.confirmLoading = true
        const params = {
          checkId: this.checkId
        }
        updateReport(params).then(res => {
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
  ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
  }
  li {
    list-style: none;
    width: 25%;
    height: 200px;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>