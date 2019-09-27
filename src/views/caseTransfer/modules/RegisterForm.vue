<template>
  <a-modal
    title="新建申请"
    :width="800"
    :bodyStyle="bodyStyle"
    :maskClosable="maskClosable"
    :centered="centered"
    :destroyOnClose="destroyOnClose"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <div v-if="Object.keys(userData).length === 0">
          <a-form-item>
            <a-input-search
              placeholder="搜索患者身份证号"
              @search="onSearch"
              v-decorator="['card', { rules: [{ required: true , message: '该选项必填'}] }]"
              enterButton
            />
          </a-form-item>
        </div>
        <div v-else>
          <user-detail-top @handle-change="handleChange" :userData="userData"></user-detail-top>
        </div>
      </a-form>
      <user-list ref="userListModule" @listen="checkuUser" />
    </a-spin>
  </a-modal>
</template>

<script>
import { getDictionaryAttributeByDictionaryId, addOrUpdate } from '@/api/basis'
import { getReportCollect, getChooseReportCollect } from '@/api/report'
import { addDistract } from '@/api/distract'
import UserList from './UserList'
import UserDetailTop from './UserDetailTop.vue'
import _ from 'lodash'
export default {
  components: {
    UserList,
    UserDetailTop
  },
  data() {
    return {
      userData: {},
      registerList: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      visible: false,
      confirmLoading: false,
      centered: true,
      maskClosable: false,
      destroyOnClose: true,
      bodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      form: this.$form.createForm(this),
      requiredRule: { rules: [{ required: true, message: '该选项必填' }] }
    }
  },
  created() {
    const that = this
    // getReportCollect().then(res => {
    //   const keyMap = { questionName: 'label', basisElementId: 'value' };
    //   _.each(res.data.reportCollect, function(item, index) {
    //     that.registerList[index] = Object.keys(item).reduce((newData, key) => {
    //       let newKey = keyMap[key] || key;
    //       newData[newKey] = item[key];
    //       return newData;
    //     }, {});
    //   });
    // });
  },
  methods: {
    add() {
      this.userData = {};
      this.visible = true;
    },
    handleChange(textValue){
      this.textValue = textValue;
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = false
      validateFields((errors, fieldsValue) => {
        const that = this
        if (errors) {
          this.confirmLoading = false
          return
        }
        const values = {
          ...fieldsValue,
          patientId: this.userData.patientId,
          reason:this.textValue,
          centerId:this.userData.centerId,
        }
        const params = new URLSearchParams()

        params.append('distract', JSON.stringify(values))
        addDistract(params).then(res => {
          that.$message.success(res.msg);
          that.visible = false
          that.confirmLoading = false
          that.$emit('ok', values)
          // that.$router.push({
          //   path: '/gallery/detail/' + res.data.reportCollectBaseId
          // })
        })
      })
    },
    handleCancel() {
      this.visible = false
    },
    onSearch(value) {
      const {
        form: { validateFields }
      } = this
      validateFields(
        (err) => {
          if (!err) {
            this.$refs.userListModule.add(value)
          }
        },
      );
    },
    checkuUser(patientDetail) {
      const that = this
      this.userData = patientDetail
      const params = new URLSearchParams()
      params.append('patientId', this.userData.patientId)
      // getChooseReportCollect(params).then(res => {
      //   const reportCheckedList = []
      //   _.forEach(res.data.reportCollect, function(value) {
      //     reportCheckedList.push(value.basisElementId)
      //   })
      //   that.form.setFieldsValue({
      //     basisElementId: reportCheckedList
      //   })
      // })
    }
  }
}
</script>