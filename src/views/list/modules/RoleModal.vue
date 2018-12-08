<template>
  <a-modal
    title="操作"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label='唯一识别码'
        hasFeedback
        validateStatus='success'
      >
        <a-input placeholder='唯一识别码' v-model="mdl.id" id='no' disabled="disabled"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label='角色名称'
        hasFeedback
        validateStatus='success'
      >
        <a-input placeholder='起一个名字' v-model="mdl.name" id='role_name'/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label='状态'
        hasFeedback
        validateStatus='warning'
      >
        <a-select v-model="mdl.status">
          <a-select-option value='1'>正常</a-select-option>
          <a-select-option value='2'>禁用</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label='描述'
        hasFeedback
      >
        <a-textarea :rows="5" v-model="mdl.describe" placeholder="..." id='describe'/>
      </a-form-item>

      <a-divider/>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label='拥有权限'
        hasFeedback
      >
        <a-row :gutter="16" v-for="(permission, index) in permissions" :key="index">
          <a-col :span="4">
            {{ permission.name }}：
          </a-col>
          <a-col :span="20">
            <a-checkbox
              v-if="permission.actionsOptions.length > 0"
              :indeterminate="permission.indeterminate"
              :checked="permission.checkedAll"
              @change="onChangeCheckAll($event, permission)">
              全选
            </a-checkbox>
            <a-checkbox-group :options="permission.actionsOptions" v-model="permission.selected" @change="onChangeCheck(permission)" />
          </a-col>
        </a-row>

      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import { getPermissions } from '@/api/manage'
  import { actionToObject } from '@/utils/permissions'

  export default {
    name: "RoleModal",
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        visible: false,
        confirmLoading: false,
        mdl: {},

        form: this.$form.createForm(this),
        permissions: []
      }
    },
    created () {
      this.loadPermissions()
    },
    methods: {
      add () {
        this.edit({ id: 0 })
      },
      edit (record) {
        this.mdl = Object.assign({}, record)
        this.visible = true

        console.log('this.mdl', this.mdl)
      },
      close () {
        this.$emit('close')
      },
      handleOk () {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('form values', values)
          }
        })
      },
      handleCancel () {

      },
      onChangeCheck (permission) {
        permission.indeterminate = !!permission.selected.length && (permission.selected.length < permission.actionsOptions.length)
        permission.checkedAll = permission.selected.length === permission.actionsOptions.length
      },
      onChangeCheckAll (e, permission) {
        Object.assign(permission, {
          selected: e.target.checked ? permission.actionsOptions.map(obj => obj.value) : [],
          indeterminate: false,
          checkedAll: e.target.checked
        })
      },
      loadPermissions () {
        getPermissions().then(res => {
          let result = res.result
          this.permissions = result.map(permission => {
            const options = actionToObject(permission.actionData)
            permission.checkedAll = false
            permission.selected = []
            permission.indeterminate = false
            permission.actionsOptions = options.map(option => {
              return {
                label: option.describe,
                value: option.action
              }
            })
            return permission
          })
        })
      }

    }
  }
</script>

<style scoped>

</style>