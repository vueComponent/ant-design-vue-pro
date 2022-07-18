<template>
  <a-modal title="留言答复" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :destroyOnClose="destroyOnClose" :centered="centered" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel" ref="modal">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <div class="replyList" ref="content" id="content">
          <div v-for="(item, index) in messageRecords" :key="index">
            <div v-if="item.type == 1" class="patient">
              <p class="time">{{ item.createTime | formDate }}</p>
              <div class="item clearfix">
                <img src="../../../assets/p-a.png" alt="">
                <div class="info">
                  <div class="clearfix">
                    <p class="code">{{ patientCenterMessage.patientCode }}</p>
                    <p class="cus">患者</p>
                  </div>
                  <p class="question">{{ item.content }}</p>
                </div>
              </div>
            </div>
            <div v-if="item.type == 2" class="reply">
              <p class="time">{{ item.createTime | formDate }}</p>
              <div class="item clearfix">
                <img src="../../../assets/h-a.png" alt="">
                <div class="info">
                  <div class="clearfix">
                    <p class="name">{{ patientCenterMessage.centerName }}</p>
                    <p class="cus">医院</p>
                  </div>
                  <p class="question">{{ item.content }}</p>
                </div>
              </div>
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
  data() {
    return {
      bodyStyle: {
        height: '600px',
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
    formDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  updated() {
    const msg = document.getElementById('content')
    msg.scrollTop = msg.scrollHeight
  },
  methods: {
    replyMessage(data) {
      this.patientCenterMessageId = data.patientCenterMessage.patientCenterMessageId
      this.messageRecords = data.messageRecords
      this.patientCenterMessage = data.patientCenterMessage
      this.visible = true
    },
    handleSubmit() {
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
    handleCancel() {
      this.visible = false
      //   this.$parent.refreshTable()
      this.$emit('refreshTable')
    }
  }
}
</script>
<style lang="less" scoped>
.replyList {
  margin: 20px 10px;
  max-height: 380px;
  overflow: auto;
  padding-right: 15px;

  .time {
    text-align: center;
  }

  .patient {
    margin-bottom: 30px;
    .item {
      img {
        float: left;
      }

      .info {
        float: left;
        margin-left: 4px;
        width: calc(100% - 100px);
        .name{
          font-size: 16px;
          color: black;
          float: left;
          margin-bottom: 0;
        }
        .code{
          background-color: #1890ff;
          border-radius: 4px;
          margin-left: 6px;
          font-size: 12px;
          padding: 3px 8px;
          float: left;
          color: #fff;
          margin-bottom: 0;
        }
        .cus{
          background-color: #f6b42d;
          border-radius: 4px;
          margin-left: 6px;
          font-size: 12px;
          padding: 3px 8px;
          float: left;
          color: #fff;
          margin-bottom: 0;
        }
        .question{
          background-color: #f2f3f4;
          max-width: 70%;
          border-radius: 3px;
          padding: 12px;
          line-height: 15px;
          word-wrap: break-word;
          word-break: normal;
          margin-bottom: 0;
          margin-top: 10px;
        }
      }
    }
  }
  .reply{
    margin-bottom: 30px;
    .item {
      img {
        float: right;
      }

      .info {
        float: right;
        margin-right: 6px;
        width: calc(100% - 100px);
        .name{
          font-size: 16px;
          color: black;
          float: right;
          margin-bottom: 0;
        }
        .cus{
          background-color: #0fd085;
          border-radius: 4px;
          margin-right: 6px;
          font-size: 12px;
          padding: 3px 8px;
          float: right;
          color: #fff;
          margin-bottom: 0;
        }
        .question{
          background-color: #1890ff;
          width: 70%;
          border-radius: 3px;
          padding: 12px;
          line-height: 15px;
          word-wrap: break-word;
          word-break: normal;
          float: right;
          color: #fff;
          margin-bottom: 0;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>