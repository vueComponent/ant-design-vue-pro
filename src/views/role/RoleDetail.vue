<template>
  <a-modal :title="options.title" :width="750" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :destroyOnClose="destroyOnClose" :centered="centered" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="角色编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['code', requiredRule]" autocomplete="off" />
        </a-form-item>
        <a-form-item label="角色名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', requiredRule]" autocomplete="off" />
        </a-form-item>
        <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['type', requiredRule]">
            <a-radio value="1">角色</a-radio>
            <a-radio value="2">数据角色</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否使用" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', requiredRule]">
            <a-radio value="1">使用</a-radio>
            <a-radio value="-1">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 0;">
          <a-textarea v-decorator="['description', requiredRule]" autocomplete="off"></a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getProvinceAndCity } from '@/api/basis'
import { saveRole } from '@/api/center'
import moment from 'moment'
import _ from 'lodash'
export default {
  data() {
    return {
      options: {},
      maskClosable: false,
      payTypeList: [],
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
      roleId: undefined
    }
  },
  created() {},
  methods: {
    add() {
      this.options.title = '新建角色'
      this.visible = true
      this.roleId = undefined
    },
    edit(value) {
      this.options.title = '编辑角色'
      this.roleId = value.id
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
          id: this.roleId
        };
        const params = new URLSearchParams()
        params.append('roleStr', JSON.stringify(values))
        saveRole(params).then(res => {
          that.visible = false
          that.confirmLoading = false
          that.$message.success(res.msg)
          that.$emit('ok', values)
        });
      });
    },
    handleCancel() {
      this.visible = false
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ant-form-item:last-child {
  margin-bottom: 0;
}
</style>