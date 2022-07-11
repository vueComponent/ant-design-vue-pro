<template>
  <a-modal
    title="留言答复"
    :width="800"
    :bodyStyle="bodyStyle"
    :maskClosable="maskClosable"
    :destroyOnClose="destroyOnClose"
    :centered="centered"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    ref="modal"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <div class="replyList" ref="content" id="content">
          <div v-for="(item, index) in messageRecords" :key="index">
            <div v-if="item.type == 1" class="patient">
              <p>
                <span class="name">{{ patientCenterMessage.patientName }}</span>
                <span class="identity">患者</span>
              </p>
              <p class="time">{{ item.createTime | formDate }}</p>
              <p class="question">{{ item.content }}</p>
            </div>
            <div v-if="item.type == 2" class="reply">
              <p>
                <span class="replyname">项目办</span>
                <span class="name">{{ patientCenterMessage.centerName }}</span>
              </p>
              <p>{{ item.createTime | formDate }}</p>
              <p class="replyContent">{{ item.content }}</p>
            </div>
          </div>
        </div>
        <div style="margin:20px;">
          <a-form-item hasFeedback>
            <a-textarea class="textarea" style="top: 2px;" :rows="4" v-decorator="['content', {rules: [{required: true, message: '请输入回复内容'}]}]" placeholder="请输入回复....." autocomplete="off"></a-textarea>
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { replyMessageData } from '@/api/messageReply'
import moment from 'moment'
export default {
  data () {
    return {
      bodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      maskClosable: false,
      destroyOnClose: true,
      centered: true,
      visible: false,
      confirmLoading: false,
      patientCenterMessageId: null,
      messageRecords: [],
      patientCenterMessage: {},
      form: this.$form.createForm(this)
    }
  },
  filters: {
    formDate (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  updated () {
    const msg = document.getElementById('content')
    msg.scrollTop = msg.scrollHeight
  },
  methods: {
    replyMessage (data) {
      this.patientCenterMessageId = data.patientCenterMessage.patientCenterMessageId
      this.messageRecords = data.messageRecords
      this.patientCenterMessage = data.patientCenterMessage
      this.visible = true
    },
    handleSubmit () {
      if (!this.confirmLoading) {
        this.confirmLoading = true
        this.form.validateFieldsAndScroll((errors, fieldsValue) => {
          const that = this
          if (errors) {
            this.confirmLoading = false
            return
          }
          const values = {
            content: fieldsValue.content,
            patientCenterMessageId: this.patientCenterMessageId
          }
          replyMessageData(values).then((res) => {
            that.visible = false
            that.confirmLoading = false
            that.$message.success(res.msg)
            that.$emit('ok', values)
          })
        })
      }
    },
    handleCancel () {
      this.visible = false
      //   this.$parent.refreshTable()
      this.$emit('refreshTable')
    }
  }
}
</script>

<style lang="less" scoped>
.replyList{
    margin: 20px 10px;
    max-height: 380px;
    overflow: auto;
    padding-right: 15px;
}
.patient{
    text-align: left;
}
.name{
    font-size: 14px;
    color: black;
}
.identity{
    background-color: #ccc;
    color: white;
    border-radius: 4px;
    margin-left: 10px;
    font-size: 12px;
    padding: 1px 8px;
}
.question{
    word-wrap: break-word;
    word-break: normal;
}
.reply{
    text-align: right;
    position: relative;
}
.replyname{
    background-color: #88d6f2;
    color: white;
    border-radius: 3px;
    margin-right: 10px;
    font-size: 12px;
    padding: 2px 6px;
}
.replyContent{
    background-color: #f2f9f7;
    width: 90%;
    border-radius: 3px;
    padding: 12px;
    line-height: 15px;
    margin-left: 70px;
    word-wrap: break-word;
    word-break: normal;
}
.textarea{
    outline:0;
    -webkit-appearance:none;
    transition:all .3s;
    -webkit-transition:all .3s;
    box-sizing:border-box
}
input,
textarea {
    outline: none;
}
</style>
