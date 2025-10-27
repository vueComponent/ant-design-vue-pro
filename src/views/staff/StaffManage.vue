<template>
  <page-header-wrapper v-if="pageShow">
    <template v-slot:extra>
      <a-tooltip title="刷新页面">
        <a-icon
          type="reload"
          style="font-size: 24px;cursor: pointer;color: #151515;"
          @click="refresh"
        />
      </a-tooltip>
    </template>
    <template v-slot:content>
      请勿给非公司员工，开通员工账号，以防存在安全隐患
    </template>
    <a-card :bordered="false">
      <s-table
        ref="table"
        size="middle"
        :showTotal="true"
        :rowKey="record=>record.id"
        :columns="columnsData.length === 0 ? columns : columnsData"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
        :pagination="pagination"
      >
        <!-- 表头 -->
        <template slot="title">
          <div style="min-height:30px" class="table-operator">
            <a-button type="primary" icon="plus" @click="addModel">新增员工</a-button>
            <!-- 筛选列设置 -->
            <a-dropdown style="float:right" v-model="screeVisible">
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="(item, index) in screenColumns"
                  :key="index"
                  @click="saveColumnsLocalStorage(index, item)"
                >
                  <a-checkbox :checked="item.checked">{{ item.title }}</a-checkbox>
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 0px"><a-icon type="profile" /> 筛选列设置 <a-icon type="down" /> </a-button>
            </a-dropdown>
          </div>
        </template>
        <!-- 表格内容 -->
        <span slot="createTime" slot-scope="text">
          {{ text > 0 ? timeStampToFormatDate(text) : '-' }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="editModel(record)" title="编辑"><a-icon type="edit" /></a>
            <a-divider type="vertical" />
            <a v-if="record.state === 1" @click="modifyState(record, false)" title="锁定"><a-icon type="lock" /></a>
            <a v-if="record.state === 0" @click="modifyState(record, true)" title="解锁"><a-icon type="unlock" /></a>
            <a-divider type="vertical" />
            <a @click="remove(record)" title="删除"><a-icon type="delete" /></a>
          </template>
        </span>
      </s-table>
      <!-- 模态框 -->
      <create-form ref="createModal" :visible="visible" :model="model" @cancel="handleCancel" @ok="handleOk" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
// import { mapState } from 'vuex'
import { STable, Ellipsis } from '@/components'
import { getRoleList } from '@/api/manage'

// 时间戳转日期
import { timeStampToFormatDate } from '@/utils/timeUtil'
import CreateForm from '@/views/modules/CreateForm'
import { Page, Add, ListRole, RemoveById, ModifyStateById, Edit } from '@/api/staff/manage'
import { handlerResult, isPageResult } from '@/api/handlerResult'
import { pwd } from '@/utils/PwdUtil'

const columns = [
  /*
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  */
  {
    title: 'ID', dataIndex: 'id', checked: true
  },
  {
    title: '登录账号', dataIndex: 'userName', checked: true
  },
  {
    title: '姓名', dataIndex: 'sexName', checked: true
  },
  {
    title: '手机号', dataIndex: 'phoneNumber', checked: true
  },
  {
    title: '岗位', dataIndex: 'postName', checked: true
  },
  {
    title: '状态', dataIndex: 'stateName', checked: true
  },
  {
    title: '添加时间', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' }, width: '150px', checked: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '100px',
    scopedSlots: { customRender: 'action' },
    checked: true
  }
]
// 表格拦数据 localStorage名称
const columnsLocalStorage = 'staffManageColumns1'

export default {
  name: 'UserList',
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  data () {
    this.columns = columns
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      }
    }
    return {
      // 页面是否显示
      pageShow: true,
      /**
       * 表格
       */
      // 分页数组
      pagination: {
        pageSizeOptions: ['10', '30', '50', '70', '100', '150', '200'],
        showTotal: total => `共 ${total} 条数据`
      },
      // 表格栏数据对象
      columnsData: [],
      // 筛选列设置数据对象，其他
      screenColumns: localStorage.getItem(columnsLocalStorage) === null ? columns : JSON.parse(localStorage.getItem(columnsLocalStorage)),
      // 筛选列设置
      screeVisible: false,

      selectedRowKeys: [],
      selectedRows: [],
      /**
       * 查询
       */
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        // 每次加载删除选择中值
        this.selectedRowKeys = []
        this.selectedRows = []
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return Page(requestParameters).then((res) => {
          if (isPageResult(res)) {
            return res.result
          }
        })
      },
      timeStampToFormatDate,
      visible: false,
      model: null,
      // 角色数据
      listRoleData: [],
    }
  },
  filters: {
    /*
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
    */
  },
  created () {
    // 设置表格栏数据
    this.setColumnsData()
    getRoleList({ t: new Date() })
    this.listRole()
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
    /*
    ...mapState({
      nickname: state => state.roles,
      welcome: state => state.user.roles,
      mainMenu: state => state.permission.addRouters
    })
    */
  },
  methods: {
    // 刷新
    refresh () {
      this.pageShow = false
      this.$nextTick(function () {
        this.pageShow = true
        this.queryParam = {}
        this.listRole()
      })
    },
    // 设置表格栏数据对象
    setColumnsData () {
      var dataNew = []
      for (var i = 0; i < this.screenColumns.length; i++) {
          if (this.screenColumns[i].checked) {
            dataNew.push(this.screenColumns[i])
          }
      }
      this.columnsData = dataNew
    },
    // 保存表格栏数据对象到localStorage
    saveColumnsLocalStorage (index, item) {
      var staticData = item
      staticData.checked = !item.checked
      this.columns[index] = staticData
      var dataNew = []
      for (var i = 0; i < this.columns.length; i++) {
          if (this.columns[i].checked) {
            dataNew.push(this.columns[i])
          }
      }
      localStorage.setItem(columnsLocalStorage, JSON.stringify(this.columns))
      this.columnsData = dataNew
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    /**
     * 新增员工
     */
    addModel () {
      const value = []
      this.listRoleData.forEach(item => {
        value.push({ label: item.name, value: item.id })
      })
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      this.model = {
        title: '新增员工',
        data: [
          {
            label: '',
            isShow: true,
            item: [{ formType: 'input', decorator: ['modelName', { initialValue: 'add' }] }]
          },
          {
            label: '登录账号',
            item: [
              {
                formType: 'input',
                decorator: ['userName', { rules: [{ required: true, message: '登录账号不能为空' }] }],
                placeholder: '请输入登录账号'
              }
            ]
          },
          {
            label: '员工姓名',
            item: [
              {
                formType: 'input',
                decorator: ['sexName', { rules: [{ required: true, message: '姓名不能为空' }] }],
                placeholder: '请输入真实姓名'
              }
            ]
          },
          {
            label: '手机号',
            item: [
              {
                formType: 'input',
                decorator: ['phoneNumber', { rules: [{ required: true, message: '手机号不能为空' }] }],
                placeholder: '请输入手机号'
              }
            ]
          },
          {
            label: '选择岗位',
            item: [
              {
                formType: 'select',
                col: 24,
                options: value,
                decorator: ['post', { rules: [{ required: true, message: '还未选择' }] }]
              }
            ]
          },
          {
            label: '登录密码',
            item: [
              {
                formType: 'input',
                decorator: ['password', { rules: [{ required: true, message: '登录密码不能为空' }] }],
                placeholder: '请输入登录密码'
              }
            ]
          },
          {
            label: '超级密码',
            item: [
              {
                formType: 'input',
                decorator: ['superPassword', { rules: [{ required: true, message: '超级密码不能为空' }] }],
                placeholder: '请输入超级密码'
              }
            ]
          }
        ]
      }
      this.visible = true
    },
    /**
     * 删除用户
     */
    remove (record) {
      const self = this
      this.$confirm({
        title: '您确定要删除用户?',
        content: h => <div style="color:red;">正在删除：ID: { record.id }, 账号: { record.userName }</div>,
        onOk () {
          return new Promise((resolve) => {
            RemoveById({ id: record.id }).then((response) => {
              if (response.code === 0) {
                self.$message.success('操作成功')
                // 刷新表格
                self.$refs.table.refresh()
              } else {
                self.$message.error(response.message)
              }
            }).catch(err => {
              self.$message.error(err + '')
            }).finally(() => {
              resolve()
            })
          })
        },
        class: 'test'
      })
    },
    /**
     * 修改状态
     */
    modifyState (record, isState) {
      const self = this
      this.$confirm({
        title: '您确定要' + (isState === true ? '解锁' : '锁定') + '?',
        content: h => <div style="color:red;">正在操作：ID: { record.id }, 账号: { record.userName }</div>,
        onOk () {
          return new Promise((resolve) => {
            ModifyStateById({ id: record.id, isState: isState }).then((response) => {
              if (response.code === 0) {
                self.$message.success('操作成功')
                // 刷新表格
                self.$refs.table.refresh()
              } else {
                self.$message.error(response.message)
              }
            }).catch(err => {
              self.$message.error(err + '')
            }).finally(() => {
              resolve()
            })
          })
        },
        class: 'test'
      })
    },
    /**
     * 编辑
     */
    editModel (record) {
      const value = []
      this.listRoleData.forEach(item => {
        value.push({ label: item.name, value: item.id })
      })
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      this.model = {
        title: '编辑',
        where: {
          // 是否显示
          isShow: true,
          label: 'ID',
          decorator: ['id', { initialValue: record.id }],
        },
        data: [
          {
            label: '',
            isShow: true,
            item: [{ formType: 'input', decorator: ['modelName', { initialValue: 'edit' }] }]
          },
          {
            label: '登录账号',
            item: [
              {
                formType: 'input',
                decorator: ['userName', { initialValue: record.userName, rules: [{ required: true, message: '登录账号不能为空' }] }],
                placeholder: '请输入登录账号'
              }
            ]
          },
          {
            label: '员工姓名',
            item: [
              {
                formType: 'input',
                decorator: ['sexName', { initialValue: record.sexName, rules: [{ required: true, message: '姓名不能为空' }] }],
                placeholder: '请输入真实姓名'
              }
            ]
          },
          {
            label: '手机号',
            item: [
              {
                formType: 'input',
                decorator: ['phoneNumber', { initialValue: record.phoneNumber, rules: [{ required: true, message: '手机号不能为空' }] }],
                placeholder: '请输入手机号'
              }
            ]
          },
          {
            label: '选择岗位',
            item: [
              {
                formType: 'select',
                col: 24,
                options: value,
                decorator: ['post', { initialValue: record.post, rules: [{ required: true, message: '还未选择' }] }]
              }
            ]
          },
          {
            label: '员工登录密码',
            item: [
              {
                formType: 'input',
                decorator: ['password', { rules: [{ min: 8, message: '员工登录密码最少8位' }] }],
                placeholder: '修改登录密码，为空不修改'
              }
            ]
          },
          {
            label: '员工超级密码',
            item: [
              {
                formType: 'input',
                decorator: ['superPassword', { rules: [{ min: 8, message: '员工超级密码最少8位' }] }],
                placeholder: '修改员工超级密码，为空不修改'
              }
            ]
          },
          {
            label: '管理员超级密码',
            item: [
              {
                formType: 'input',
                type: 'password',
                col: 24,
                placeholder: '请输入管理员超级密码',
                decorator: ['operSuperPassword', { rules: [{ required: true, message: '管理员超级密码不能为空' }] }]
              }
            ]
          }
        ]
      }
      this.visible = true
    },
    /**
     * 获取全部角色
     */
    listRole () {
      ListRole().then(response => {
        if (response.code === 0) {
          this.listRoleData = response.result
        }
      })
    },
    /**
    * 关闭
    */
    handleCancel () {
      this.visible = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleOk () {
      /*
      if (this.selectedRows.length === 0) {
        this.$message.error('请至少选择一个,再操作')
        return
      }
      */
      const form = this.$refs.createModal.form
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.modelName === 'add') {
            // 添加员工
            Add(values).then(response => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh()
                this.visible = false
              }
            })
          } else if (values.modelName === 'edit') {
            // 编辑
            values.operSuperPassword = pwd(values.operSuperPassword)
            Edit(values).then(response => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh()
                this.visible = false
              }
            })
          }
        }
      })
    }
  }
}
</script>
