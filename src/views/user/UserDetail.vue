<template>
  <a-modal :title="options.title" :width="750" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :destroyOnClose="destroyOnClose" :centered="centered" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="用户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', requiredRule]" autocomplete="off" />
        </a-form-item>
        <a-form-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['account', requiredRule]" autocomplete="off" />
        </a-form-item>
        <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="password" placeholder="至少6位密码，区分大小写" v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}]}]" autocomplete="off" />
        </a-form-item>
        <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="password" autocomplete="false" placeholder="确认密码" v-decorator="['password2', {rules: [{ required: true, message: '至少6位密码，区分大小写' }]}]"></a-input>
        </a-form-item>
        <a-form-item label="用户角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['id', requiredRule]" :options="roleList" @change="chooseRole">
          </a-radio-group>
        </a-form-item>
        <a-form-item label="分支中心" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="chooseCenter">
          <a-radio-group v-decorator="['centerId', requiredRule]" :options="centerList">
          </a-radio-group>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', requiredRule]">
            <a-radio value="1">使用</a-radio>
            <a-radio value="-1">停用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { saveDoctor, getRoleDataList, getCenterDataList } from '@/api/center'
import moment from 'moment'
import _ from 'lodash'
export default {
  data() {
    return {
      options: {},
      maskClosable: false,
      roleList: [],
      centerList: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      visible: false,
      confirmLoading: false,
      centered: true,
      destroyOnClose: true,
      bodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      form: this.$form.createForm(this),
      requiredRule: { rules: [{ required: true, message: '该选项必填！' }] },
      doctorId: undefined,
      chooseCenter: false
    }
  },
  created() {
    var that = this
    getRoleDataList()
      .then(res => {
        that.roleList = _.map(res.data, function(v) {
          return {
            label: v.name,
            value: v.id
          }
        })
      })

    getCenterDataList()
      .then(res => {
        that.centerList = _.map(res.data, function(v) {
          return {
            label: v.name,
            value: v.centerId
          }
        })
      })
  },
  methods: {
    add() {
      this.options.title = '新建用户'
      this.visible = true
      this.doctorId = undefined
    },
    edit(value) {
      this.options.title = '编辑用户'
      this.doctorId = value.doctorId
      setTimeout(() => {
        this.form.setFieldsValue({
          code: value.code,
          name: value.name,
          type: String(value.type),
          status: String(value.status),
          description: value.description
        })
      }, 0)
      this.visible = true
    },
    handleSubmit() {
      this.confirmLoading = true;
      this.form.validateFields((errors, fieldsValue) => {
        const that = this;
        if (errors) {
          this.confirmLoading = false
          return
        }
        const values = {
          ...fieldsValue,
          doctorId: this.doctorId
        };
        const params = new URLSearchParams()
        params.append('doctorStr', JSON.stringify(values))
        saveDoctor(params).then(res => {
          that.visible = false
          that.confirmLoading = false
          that.$message.success(res.msg)
          that.$emit('ok', values)
        });
      });
    },
    handleCancel() {
      this.visible = false
    },
    handlePasswordLevel(rule, value, callback) {
      if (!value) callback()
      let level = 0

      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      if (level >= 2) {
        callback()
      } else {
        callback(new Error('密码强度不够'))
      }
    },
    handlePasswordCheck(rule, value, callback) {
      const password = this.form.getFieldValue('password')
      console.log('value', value)
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    chooseRole(e) {
      //中心用户
      if (e.target.value === 2) {
        this.chooseCenter = true
      } else {
        this.chooseCenter = false
      }
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ant-form-item:last-child {
  margin-bottom: 0;
}
</style>