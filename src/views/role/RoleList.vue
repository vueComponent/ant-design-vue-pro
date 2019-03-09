<template>
  <a-card :bordered="false" :style="{ height: '100%' }">
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
        <div style="max-width: 800px">
          <a-divider v-if="isMobile()" />
          <div v-if="mdl.id">
            <h3>角色：{{ mdl.name }}</h3>
          </div>
          <a-form :form="form" :layout="isMobile() ? 'vertical' : 'horizontal'">
            <a-form-item label="唯一键">
              <a-input v-decorator="[ 'id', {rules: [{ required: true, message: 'Please input unique key!' }]} ]" placeholder="请填写唯一键" />
            </a-form-item>

            <a-form-item label="角色名称">
              <a-input v-decorator="[ 'name', {rules: [{ required: true, message: 'Please input role name!' }]} ]" placeholder="请填写角色名称" />
            </a-form-item>

            <a-form-item label="状态">
              <a-select v-decorator="[ 'status', {rules: []} ]">
                <a-select-option :value="1">正常</a-select-option>
                <a-select-option :value="2">禁用</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="备注说明">
              <a-textarea :row="3" v-decorator="[ 'describe', {rules: [{ required: true, message: 'Please input role name!' }]} ]" placeholder="请填写角色名称" />
            </a-form-item>

            <a-form-item label="拥有权限">
              <a-row :gutter="16" v-for="(permission, index) in permissions" :key="index">
                <a-col :xl="4" :lg="24">
                  {{ permission.name }}：
                </a-col>
                <a-col :xl="20" :lg="24">
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
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { getRoleList, getPermissions } from '@/api/manage'
import { mixinDevice } from '@/utils/mixin'
import { actionToObject } from '@/utils/permissions'
import pick from 'lodash.pick'

export default {
  name: 'RoleList',
  mixins: [mixinDevice],
  components: {},
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

        console.log('permissionsAction', permissionsAction)
        // 把权限表遍历一遍，设定要勾选的权限 action
        this.permissions.forEach(permission => {
          const selected = permissionsAction[permission.id]
          permission.selected = selected || []
          this.onChangeCheck(permission)
        })

        console.log('this.permissions', this.permissions)
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
      console.log('permission:', permission)

      Object.assign(permission, {
        selected: e.target.checked ? permission.actionsOptions.map(obj => obj.value) : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    },
    loadPermissions () {
      getPermissions().then(res => {
        const result = res.result
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
