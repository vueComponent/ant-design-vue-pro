<template>
  <a-modal :title="options.title" :width="750" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :destroyOnClose="destroyOnClose" :centered="centered" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="用户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', requiredRule]" />
        </a-form-item>
        <a-form-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['account', requiredRule]" />
        </a-form-item>
        <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="password" placeholder="请输入密码" @blur="handleConfirmBlur" v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, {validator: validateToNextPassword}]}]" />
        </a-form-item>
        <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="password" placeholder="请确认密码" v-decorator="['password2', {rules: [{ required: true, message: '请确认密码' }, {validator: compareToFirstPassword}]}]" />
        </a-form-item>
        <a-form-item label="用户角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['roleId', requiredRule]" :options="roleList">
          </a-radio-group>
        </a-form-item>
        <a-form-item label="分支中心" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="form.getFieldValue('roleId') == 2">
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
import { saveDoctor, getRoleDataList, getCenterDataList, getDoctorDetail } from '@/api/center'
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
      confirmDirty: false,
      doctorId: undefined
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

      const params = new URLSearchParams()
      params.append('doctorId', value.doctorId)
      getDoctorDetail(params).then(res => {
        var data = res.data.doctor;
        this.form.setFieldsValue({
          name: data.name,
          account: data.account,
          password: data.password,
          password2: data.password,
          roleId: data.roleId,
          status: String(data.status)
        })
        this.$nextTick(() => {
          if (this.form.getFieldValue('roleId') == 2) {
            this.form.setFieldsValue({
              centerId: data.centerId
            })
          }
        })
      })
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
        if (this.doctorId) {
            values.doctorId = this.doctorId
        }
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
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    validateToNextPassword(rule, value, callback) {
      if (value.length < 6) {
        callback(new Error('至少6位密码'))
      }
      
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
      if (level < 2) {
        callback(new Error('密码强度不够'))
      }

      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['password2'], { force: true });
      }
      callback();
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('您两次输入的密码不一致！');
      } else {
        callback();
      }
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
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ant-form-item:last-child {
  margin-bottom: 0;
}
</style>