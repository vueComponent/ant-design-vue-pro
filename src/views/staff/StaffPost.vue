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
    <a-card :bordered="false">
      <s-table
        ref="table"
        size="middle"
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
            <a-button type="primary" icon="plus" @click="addPostShow">新增岗位</a-button>
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
        <!--
        <span slot="tpls" slot-scope="text, record">
          <span v-for="(item, index) in record.tpls" :key="index">{{ (index === 0 ? '' : ' | ') + item.tplName }}</span>
        </span>
        -->
        <span slot="action" slot-scope="text, record">
          <template>
          
            <a @click="editPost(record)" title="编辑"><a-icon type="edit" /></a>
            <a-divider type="vertical" />
            <a-popconfirm :title="'确定删除?'" @confirm="removeById(record)">
              <a title="删除"><a-icon type="delete" /></a>
            </a-popconfirm>
            <!--
            <a @click="modifyNameShow(record)">配置</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">订阅报警</a>
            -->
          </template>
        </span>
      </s-table>
      <!--添加编辑岗位model-->
      <a-modal
        :visible="modalPostVisible"
        :width="640"
        :title="modalPostTitle"
        okText="保存"
        cancel-text="取消"
        @cancel="handlePostCancel"
        @ok="handlePostOk"
      >
        <!--表单 并将表单的值绑定到this.from-->
        <a-form :form="form" v-bind="formLayout">
          <a-form-item v-show="false">
            <a-input v-decorator="['id', { initialValue: modalPostId }]" disabled />
          </a-form-item>
          <!--每一项元素-->
          <a-form-item label="岗位名称">
            <a-row :gutter="[8]">
              <a-col :span="24">
                <a-input v-decorator="['name', { initialValue: modalPostName, rules: [{ required: true, message: '岗位名称不能为空' }] }]" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-row :gutter="[8]">
            <a-col :span="8" style="height: 300px; overflow:scroll">
              <a-tree
                v-model="checkedKeys"
                checkable
                :expanded-keys="expandedKeys"
                :auto-expand-parent="autoExpandParent"
                :selected-keys="selectedKeys"
                :tree-data="treeData"
                @expand="onExpand"
                @check="onCheck"
                @select="onSelect"
              />
            </a-col>
            <a-col :span="16">
              <a-col :span="24" style="text-align:center">
                操作权限 (完成编辑后请点击按钮保存设置 )
                <hr>
              </a-col>
              <a-col :span="24">
                <a-checkbox-group v-decorator="['arrValue']" v-model="operationValue" :options="operationOption" @change="operationChange" />
              </a-col>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
// import { mapState } from 'vuex'
import { STable, Ellipsis } from '@/components'
import { getRoleList } from '@/api/manage'

import { Init, ListOperationByMenuId, Add, Page, ListByRoleId, EditById, RemoveById } from '@/api/staff/post'
const columns = [
  /*
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  */
  {
    title: '名称', dataIndex: 'name', checked: true
  },
  {
    title: '添加时间', dataIndex: 'createTime', width: '150px', checked: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '80px',
    scopedSlots: { customRender: 'action' },
    checked: true
  }
]
/*
const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}
*/
// 表格拦数据 localStorage名称
const columnsLocalStorage = 'staffPostColumns'

export default {
  name: 'UserList',
  components: {
    STable,
    Ellipsis
  },
  // el 创建前
  beforeCreate () {
    // 创建表单
    this.form = this.$form.createForm(this)
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
      pagination: { pageSizeOptions: ['10', '30', '50', '70', '100', '150', '200'] },
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
        // console.log('loadData request parameters:', requestParameters)
        return Page(requestParameters).then((res) => {
          return res.result
        })
      },
      // 添加编辑岗位model
      modalPostVisible: false,
      modalPostId: '',
      modalPostName: '',
      modalPostTitle: '',
      // 展开/收起节点
      expandedKeys: [],
      autoExpandParent: true,
      // 菜单选择的数组
      checkedKeys: [],
      // 选择key数组
      selectedKeys: [],
      // 数据对象
      treeData: [],
      // 权限操作选中的值
      operationValue: [],
      operationOption: [],
      // 操作权限数据
      operationData: []
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
    this.init()
    getRoleList({ t: new Date() })
    // setTimeout(function () {
      // console.log('timeout')
    // }, 1000)
  },
  watch: {
    checkedKeys (val) {
      // console.log('onCheck', val)
    }
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
    init () {
      Init().then(response => {
        if (response.code === 0) {
          this.treeData = response.result
        }
      })
    },
    /**
     * 添加岗位显示modal
     */
    addPostShow () {
      this.modalPostId = 0
      this.modalPostName = ''
      this.modalPostTitle = '新增岗位'
      this.modalPostVisible = true
      const form = this.form
      form.resetFields() // 清理表单数据（可不做）
      this.checkedKeys = []
      this.selectedKeys = []
      this.operationData = []
      this.operationValue = []
      this.operationOption = []
    },
    handlePostCancel () {
      this.modalPostVisible = false
    },
    /**
     * 添加岗位
     */
    handlePostOk () {
      // 合并数据
      const data = [...this.checkedKeys, ...this.operationData]
      // 排序
      const dataSort = data.sort((a, b) => a - b)
      if (dataSort.length === 0) {
          this.$message.error('请最低选择一个菜单，再操作')
          return
      }
      const form = this.form
      form.validateFields((err, values) => {
        if (err) {
          return
        }
        var form1 = new URLSearchParams()
        form1.append('name', values.name)
        form1.append('menuIds[]', dataSort)
        if (values.id === 0) {
          Add(form1).then(res => {
            if (res.code === 0) {
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.success(res.message)
              this.modalPostVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          form1.append('id', values.id)
          EditById(form1).then(res => {
            if (res.code === 0) {
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.success(res.message)
              this.modalPostVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    /**
     * 点击展开/收起节点
     */
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    /**
     * 点击复选框触发
     */
    onCheck (checkedKeys, e) {
      this.checkedKeys = checkedKeys
      // 获取key
      const key = e.node.$el.__vue__.$options._parentVnode.data.key
      ListOperationByMenuId({ menuId: key }).then(response => {
        if (response.code === 0) {
          if (e.checked === true) {
            const value = []
            response.result.forEach(item => {
              value.push(item.value)
              // 添加到操作权限数据里
              this.operationData.push(item.value)
            })
            this.operationValue = value
            // alert(JSON.stringify(value))
            this.operationOption = response.result
          } else {
            this.operationValue = []
            // 遍历移除操作权限数据
            response.result.forEach(item => {
              const index = this.operationData.findIndex(i => i === item.value)
              if (index > -1) {
                this.operationData.splice(index, 1)
              }
            })
            this.operationOption = []
          }
          // 去重复
          this.operationData = Array.from(new Set(this.operationData))
        }
      })
    },
    /**
     * 选中操作
     */
    onSelect (selectedKeys, info) {
       this.selectedKeys = selectedKeys
      // 是否选中
      const checked = info.node.$options.propsData.checked
      if (checked === false) {
        this.operationOption = []
        return
      }
      // 判断选中状态为真
      if (info.selected === true) {
        ListOperationByMenuId({ menuId: selectedKeys[0] }).then(response => {
          if (response.code === 0) {
            const value = []
            response.result.forEach(item => {
              if (this.operationData.findIndex(i => i === item.value) > -1) {
                value.push(item.value)
              }
            })
            this.operationValue = value
            this.operationOption = response.result
          }
        })
      } else {
        this.operationOption = []
      }
      // console.log(info.selected)
      // console.log('onSelect', info.node.$options.propsData.checked)
      // console.log('selectedKeys', selectedKeys)
    },
    /**
     * 操作权限变化时回调函数
     */
    operationChange (e) {
      const val = []
      // 获取Option全部value值
      this.operationOption.forEach(item => {
        val.push(item.value)
      })
      // 获取未选中的值
      e.forEach(j => {
        val.splice(val.findIndex(i => i === j), 1)
        // 添加数组到操作权限数据中
        this.operationData.push(j)
      })
      // 去重复
      this.operationData = Array.from(new Set(this.operationData))
      // 把未选中的权限操作从操作权限数据中删除
      val.forEach(j => {
        const findIndex = this.operationData.findIndex(i => i === j)
        if (findIndex > -1) {
          this.operationData.splice(findIndex, 1)
        }
      })
    },
    /**
     * 编辑岗位显示modal
     */
    editPost (record) {
      const form = this.form
      this.expandedKeys = []
      this.checkedKeys = []
      this.selectedKeys = []
      this.operationData = []
      this.operationValue = []
      this.operationOption = []
      form.resetFields() // 清理表单数据（可不做）
      this.modalPostVisible = true
      this.modalPostId = record.id
      this.modalPostTitle = '编辑岗位'
      this.modalPostName = record.name
      ListByRoleId({ id: record.id }).then(res => {
        if (res.code === 0) {
           this.checkedKeys = res.result.menudata
           this.operationData = res.result.operationData
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 删除角色
     */
    removeById (record) {
      RemoveById({ id: record.id }).then(res => {
        if (res.code === 0) {
          // 刷新表格
            this.$refs.table.refresh()
            this.$message.success(res.message)
            this.modalPostVisible = false
          } else {
            this.$message.error(res.message)
          }
      })
    }
  }
}
</script>
