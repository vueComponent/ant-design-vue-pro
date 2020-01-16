<template>
  <a-modal :title="options.title" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :destroyOnClose="destroyOnClose" :centered="centered" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="中心编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['code', requiredRule]" />
        </a-form-item>
        <a-form-item label="中心名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', requiredRule]" />
        </a-form-item>
        <a-form-item label="计划患者数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['planNum', requiredRule]" />
        </a-form-item>
        <a-form-item label="所在地" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row :gutter="8">
            <a-col :span="12">
              <a-form-item>
                <a-cascader v-decorator="['residence', requiredRule]" :options="residences" :fieldNames="{ label: 'city', value: 'cityId', children: 'children' }" placeholder="选择省/市" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item>
                <a-input v-decorator="['address', requiredRule]" placeholder="请输入详细地址" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getProvinceAndCity } from '@/api/basis'
import { saveCenter } from '@/api/center'
import moment from 'moment'
import _ from 'lodash'
export default {
  data() {
    return {
      options: {},
      residences: [],
      maskClosable: false,
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
      centerId: undefined
    };
  },
  created() {
    const that = this;
    getProvinceAndCity().then(res => {
      const keyMap = { province: 'city', provinceId: 'cityId' }
      _.each(res.data, function(item, index) {
        that.residences[index] = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap[key] || key
          newData[newKey] = item[key]
          return newData
        }, {})
      })
    })
  },
  methods: {
    add() {
      this.options.title = '新建中心'
      this.centerId = undefined
      this.visible = true
    },
    edit(value) {
      console.log('value', value);
      this.options.title = '编辑中心'
      this.centerId = value.centerId
      value.residence = [String(value.addressP), String(value.addressC)]
      setTimeout(() => {
        this.form.setFieldsValue({
          code: value.code,
          name: value.name,
          residence: value.residence,
          address: value.addressDetail,
          planNum: value.planNum
        })
      }, 0);
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
        const residence = fieldsValue['residence']
        const values = {
          ...fieldsValue,
          addressP: residence[0],
          addressC: residence[1],
          centerId: this.centerId
        };
        const params = new URLSearchParams()
        params.append('centerStr', JSON.stringify(values))
        saveCenter(params).then(res => {
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