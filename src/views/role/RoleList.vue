<template>
  <page-layout title="角色管理">
    <a-card :bordered="false" :style="{ height: '100%' }">
      <!--<a-tabs defaultActiveKey="1" tabPosition="left" size="large" :style="{ height: '400px'}" :tabBarStyle="{ textAlign: 'left' }" @prevClick="callback" @nextClick="callback">
        <a-tab-pane tab="管理员" key="1">Content of tab 1</a-tab-pane>
        <a-tab-pane tab="销售组长" key="2">Content of tab 2</a-tab-pane>
        <a-tab-pane tab="销售总负责人" key="3">Content of tab 3</a-tab-pane>
        <a-tab-pane tab="总经理" key="4">Content of tab 4</a-tab-pane>
        <a-tab-pane tab="普通销售" key="5">Content of tab 5</a-tab-pane>
        <a-tab-pane tab="客服" key="6">Content of tab 6</a-tab-pane>
        <a-tab-pane tab="会员" key="7">Content of tab 7</a-tab-pane>
        <a-tab-pane tab="增加角色" key="-1">Content of tab 7</a-tab-pane>
      </a-tabs>-->

      <a-row :gutter="24">
        <a-col :md="4">
          <a-list itemLayout="vertical" :dataSource="roles">
            <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
              <a-list-item-meta :style="{ marginBottom: '0' }">
                <span slot="description" style="text-align: center; display: block">{{ item.describe }}</span>
                <a slot="title" style="text-align: center; display: block" @click="edit(item)">{{ item.name }}</a>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-col>
        <a-col :md="20">
          <a-row v-if="mdl.id">
            <a-col :span="5"><h3 style="text-align: right">角色：</h3></a-col>
            <a-col :span="19"><h3>{{ mdl.name }}</h3></a-col>
          </a-row>
          <a-form :form="form">
            <a-form-item
              label="唯一键"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18 }"
            >
              <a-input v-decorator="[ 'id', {rules: [{ required: true, message: 'Please input unique key!' }]} ]" placeholder="请填写唯一键" />
            </a-form-item>

            <a-form-item
              label="角色名称"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18 }"
            >
              <a-input v-decorator="[ 'name', {rules: [{ required: true, message: 'Please input role name!' }]} ]" placeholder="请填写角色名称" />
            </a-form-item>

            <a-form-item
              label="状态"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18 }"
            >
              <a-select v-decorator="[ 'status', {rules: []} ]">
                <a-select-option :value="1">正常</a-select-option>
                <a-select-option :value="2">禁用</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              label="备注说明"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18 }"
            >
              <a-textarea :row="3" v-decorator="[ 'describe', {rules: [{ required: true, message: 'Please input role name!' }]} ]" placeholder="请填写角色名称" />
            </a-form-item>

            <a-form-item
              label="拥有权限"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18 }"
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
        </a-col>
      </a-row>
    </a-card>
  </page-layout>
</template>

<script>
  import PageLayout from '@/components/page/PageLayout'
  import { getRoleList, getPermissions } from "@/api/manage"
  import { actionToObject } from '@/utils/permissions'
  import pick from 'lodash.pick'

  export default {
    name: "RoleList",
    components: {
      PageLayout
    },
    data () {
      return {
        form: this.$form.createForm(this),
        mdl: {},

        roles: [],
        permissions: []
      }
    },
    created () {
      getRoleList().then((res) => {
        this.roles = res.result.data
        this.roles.push({
          id: '-1',
          name: '新增角色',
          describe: '新增一个角色'
        })
        console.log('this.roles', this.roles)
      })
      this.loadPermissions()
    },
    methods: {
      callback (val) {
        console.log(val)
      },

      add () {
        this.edit({ id: 0 })
      },

      edit (record) {
        this.mdl = Object.assign({}, record)
        // 有权限表，处理勾选
        if (this.mdl.permissions && this.permissions) {
          // 先处理要勾选的权限结构
          const permissionsAction = {}
          this.mdl.permissions.forEach(permission => {
            permissionsAction[permission.permissionId] = permission.actionEntitySet.map(entity => entity.action)
          })
          // 把权限表遍历一遍，设定要勾选的权限 action
          this.permissions.forEach(permission => {
            permission.selected = permissionsAction[permission.id]
          })
        }

        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'id', 'name', 'status', 'describe'))
        })
        console.log('this.mdl', this.mdl)
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
    },
  }
</script>

<style scoped>

</style>