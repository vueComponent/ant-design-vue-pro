<template>
  <a-modal
    title="消息详情"
    :width="600"
    :bodyStyle="bodyStyle"
    :maskClosable="maskClosable"
    :destroyOnClose="destroyOnClose"
    :centered="centered"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <!-- <a-form :form="form">
        <a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入标题" v-decorator="['title', isIdCardNo]" />
        </a-form-item>
        <a-form-item label="发送内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="textarea" rows="6" v-decorator="['content', requiredRule]" />
        </a-form-item>
      </a-form> -->
      <!-- publish.isCreator == 1? (publish.stauts == 1? false : (publish.unReadCount == 0? '已阅读' : '待阅读') ) : publish.unReadCount -->
      <div class="sdd">
        <span v-if="publish.updatedDate? true : false">发布时间: <span>{{ publish.updatedDate | formDate }}</span></span>
        <span v-if="publish.publisher? true : false">发布人: <span>{{ publish.publisher }}</span></span>
        <span v-if="publish.isCreator == 1? true : false" class="publishStatus">
          <span v-if="publish.unReadCount == 0? false : (publish.status == 1? true : false)" style="margin-right: 5px">待阅读:</span>
          <span style="margin-right: 0">{{ publish.status == 1? (publish.type == 1? publish.unReadCount : (publish.unReadCount == 0? '已阅读' : '待阅读')) : '未发布' }}</span>
        </span>
      </div>
      <div class="cdd">
        <p>{{ publish.content }}</p>
      </div>
      <div class="ndd">
        <a-button v-if="publish.isCreator == 1? false : true" :disabled="status == 2? true : false" type="primary" @click="readStatusBtn()">{{ status == 2? '已阅读' : '待阅读' }}</a-button>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import { detailData, isReadDetail } from '@/api/message'
import moment from 'moment'
export default {
  data () {
    return {
      publish: [],
      status: undefined,
      announcementId: undefined,
      maskClosable: false,
      payTypeList: [],
      isShowPat: false,
      visible: false,
      confirmLoading: false,
      centered: true,
      destroyOnClose: true,
      bodyStyle: {
        height: '300px',
        overflow: 'auto'
      },
      form: this.$form.createForm(this)
    }
  },
  created () {},
  filters: {
    formDate (date) {
      return moment(date).format('YYYY-MM-DD')
    }
  },
  methods: {
    show (value) {
      this.visible = true
      this.confirmLoading = true
      detailData(value.announcementId).then(res => {
        this.publish = res.data
        this.status = res.data.readStatus
        this.announcementId = res.data.announcementId
        this.confirmLoading = false
      })
    },
    async readStatusBtn () {
      var that = this
      if (this.status == 1) {
        this.status = 2
        const res = await isReadDetail(this.announcementId)
        that.$message.success(res.msg)
      }
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-form-item:last-child {
  margin-bottom: 0;
}
.sdd {
    position: relative;
    font-size: 16px;
    color: #000;
    height: 50px;
    border-bottom: 1px solid #cfcfcf;
}
.sdd span {
    margin-right: 30px;
}
.cdd {
    margin-top: 20px;
}
.ndd {
    text-align: right;
    margin-top: 40px;
}
.publishStatus {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 14px;
    color: #999;
}
.btn {
    background: #409eff;
    border: unset;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
}
.btn-disabled {
    background: #909399;
    border: unset;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
}
/deep/ .aaa .ant-form-item-label {
  position: relative;
  left: -18px;
}

.aaa .ant-form-item-children > i {
  position: absolute !important;
  left: -22px !important;
  top: 4px;
}
</style>
