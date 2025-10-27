<template v-slot:content>
  <page-header-wrapper v-if="pageShow">
    <!--页头-->
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
      <!--搜索框-->
      <div class="table-page-search-wrapper">
        <!--搜索框-->
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="6" :sm="8">
              <a-form-item label="用户ID">
                <a-input v-model="queryParam.userId" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="工单类型">
                <a-select v-model="queryParam.ticketTypeId" placeholder="全部状态" default-value="0">
                  <a-select-option value="">全部类型</a-select-option>
                  <a-select-option v-for="item in ticketTypeData" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="处理状态">
                <a-select v-model="queryParam.status" placeholder="全部状态" default-value="0">
                  <a-select-option value="">全部状态</a-select-option>
                  <a-select-option value="0">待处理</a-select-option>
                  <a-select-option value="1">已完结</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="起始">
                <a-date-picker v-model="queryParam.startTime" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="结束">
                <a-date-picker v-model="queryParam.endTime" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 6) || 6" :sm="8">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = { startTime: moment().startOf('day'), endTime: moment().startOf('day') })">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 表格 -->
      <s-table
        ref="table"
        size="middle"
        :showTotal="true"
        :rowKey="record => record.id"
        :columns="columnsData"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
        :pagination="pagination"
      >
        <!-- 表头 -->
        <template slot="title">
          <div style="min-height:28px;line-height: 28px;overflow: auto;overflow-y:hidden;_height:1%;" class="table-operator">
            <a @click="ticketTypeModel">工单类型管理</a>
            <!-- 筛选列设置 -->
            <a-dropdown style="float:right;" v-if="screenColumns.visible" v-model="screenColumns.model">
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="(item, index) in screenColumns.data"
                  :key="index"
                  @click="saveScreenColumns(index, item)"
                >
                  <a-checkbox :checked="item.checked">{{ item.title }}</a-checkbox>
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 0px"><a-icon type="profile" /> 筛选列设置 <a-icon type="down" /> </a-button>
            </a-dropdown>
          </div>
        </template>
        <!-- 表格自定义渲染 -->
        <span slot="content" slot-scope="text">{{ text.length > 8 ? (text.substring(0, 8) + '...') : text }}</span>
        <span slot="result" slot-scope="text">{{ text.length > 8 ? (text.substring(0, 8) + '...') : text }}</span>
        <span slot="createTime" slot-scope="text">{{ text > 0 ? timeStampToFormatDate(text) : '-' }}</span>
        <span slot="updateTime" slot-scope="text">{{ text > 0 ? timeStampToFormatDate(text) : '-' }}</span>
        <span slot="status" slot-scope="text, record">
          <span v-if="text === 0" style="color: red;font-weight: bold;">待处理</span>
          <span v-if="text === 1" style="color: rgb(13, 122, 247);font-weight: bold;">
          已完结 
          (<span v-if="record.read === 1" style="font-size: 12px;color: rgb(98, 98, 99);">已读</span><span v-else style="font-size: 12px;color: rgb(245, 61, 6);">未读</span>)
          </span>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item v-if="record.read === 0" @click="editModel(record)"><a-icon type="edit" />处理</a-menu-item>
                <a-menu-item v-else @click="editModel(record)"><a-icon type="eye" />查看</a-menu-item>
                <a-menu-item @click="remove(record)"><a-icon type="delete" />删除</a-menu-item>
              </a-menu>
              <a>更多操作<a-icon type="down"/></a>
            </a-dropdown>
          </template>
        </span>
      </s-table>
      <create-form ref="createModal" :visible="visible" :model="model" @cancel="handleCancel" @ok="handleOk" />
      <!--工单类型管理-->
      <a-modal
        :visible="ticketTypeVisible"
        :width="680"
        :dialog-style="{ top: '30px' }"
        title="工单类型管理"
        :footer="null"
        @cancel="ticketTypeHandleCancel"
      >
        <!--表单 并将表单的值绑定到this.from-->
        <a-form :form="ticketTypeForm" v-bind="{labelCol: {xs: { span: 24 },sm: { span: 5 }},wrapperCol: {xs: { span: 24 },sm: { span: 17 }}}">
          <a-form-item label="类型名称">
            <a-row :gutter="[8]">
              <a-col :span="16">
                <a-input v-decorator="['name',{rules: [{ required: true, message: '工单类型名称不能为空' }]}]" placeholder="请输入工单类型名称" />
              </a-col>
              <a-col :span="8">
                <a-button type="primary" icon="plus" @click="onAddTicketType">添加</a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-row :gutter="[8]">
            <a-table :columns="ticketTypeColumns" :data-source="ticketTypeData" size="small">
              <span slot="name" slot-scope="text, record">
                <a-input style="width: 180px" :value="text" @blur="modifyTicketTypeName($event, record)" />
              </span>
              <span slot="action" slot-scope="text, record">
                <a-popconfirm :title="'确定删除?'" @confirm="removeTicketType(record)">
                  <a-button type="link" icon="delete"/>
                </a-popconfirm>
              </span>
            </a-table>
          </a-row>
        </a-form>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// 时间格式化工具
import moment from 'moment'
// import { mapState } from 'vuex'
import { STable, Ellipsis } from '@/components'
import CreateForm from '@/views/modules/CreateForm'
import CreateInfoModel from '@/views/modules/CreateInfoModel'
import { Page, RemoveById, Edit, AddTicketType, ModifyTicketTypeName, RemoveTicketType, TicketTypeList } from '@/api/ticket/list'
import { timeStampToFormatDate } from '@/utils/timeUtil'
import { handlerResult, isPageResult } from '@/api/handlerResult'
// 表格字段，checked是否显示
const columns = [
  {
    title: 'ID', dataIndex: 'id', checked: true
  },
  {
    title: 'BossId', dataIndex: 'bossId', checked: false
  },
  {
    title: '代理商ID', dataIndex: 'agentId', checked: false
  },
  {
    title: '会员ID', dataIndex: 'userId', checked: true
  },
  {
    title: '会员类型', dataIndex: 'userTypeName', checked: true
  },
  {
    title: '节点编号', dataIndex: 'nodeId', checked: true
  },
  {
    title: '工单类型', dataIndex: 'ticketTypeName', checked: true
  },
  {
    title: '内容', dataIndex: 'content', scopedSlots: { customRender: 'content' }, checked: true
  },
  {
    title: '处理状态', dataIndex: 'status', scopedSlots: { customRender: 'status' }, checked: true, width: '100px'
  },
  {
    title: '处理结果', dataIndex: 'result', scopedSlots: { customRender: 'result' }, checked: true
  },
  {
    title: '创建时间', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' }, checked: true, width: '150px'
  },
  {
    title: '更新时间', dataIndex: 'updateTime', scopedSlots: { customRender: 'updateTime' }, checked: false, width: '150px'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' },
    checked: true
  }
]
const ticketTypeColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '100px'
  },
  {
    title: '工单名称',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' },
    width: '180px'
  },
  {
    title: '操作',
    key: 'action',
    width: '50px',
    scopedSlots: { customRender: 'action' }
  }
]
// 表格拦数据 localStorage名称，保证每个页面都是唯一的
const columnslocalStorage = 'TicketListColumns'

export default {
  name: 'UserList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    CreateInfoModel
  },
  data () {
    // 表格列的配置
    this.columns = columns
    return {
      // 页面是否显示
      pageShow: true,
      // 分页数组
      pagination: {
        pageSizeOptions: ['10', '30', '50', '70', '100', '150', '200'],
        showTotal: total => `共 ${total} 条数据`
      },
      // 使用的表格栏数据
      columnsData: [],
      // 筛选列对象,data=数据,visible=是否显示筛选列(如果不显示，使用columns显示全部表格数据),model=菜单是否显示
      screenColumns: { data: [], visible: true, model: false },
      // 搜索 展开/收起
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        // 每次加载删除选择中值
        this.selectedRowKeys = []
        this.selectedRows = []
        this.queryParam.startTime = moment(this.queryParam.startTime).format('YYYY-MM-DD')
        this.queryParam.endTime = moment(this.queryParam.endTime).format('YYYY-MM-DD')
        // 分页请求参数
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        // 分页
        return Page(requestParameters).then((res) => {
          if (isPageResult(res)) {
            // return {"pageNo": 1,"pageSize": 10,"totalCount": 0,"totalPage": 0,"data": [ ]}
            return res.result
          }
        })
      },
      // 选中项的 key 数组
      selectedRowKeys: [],
      // 选中项数组添加到 selectedRows 中
      selectedRows: [],
      moment,
      visible: false,
      model: null,
      timeStampToFormatDate,
      // 工单类型表格字段
      ticketTypeColumns,
      // 工单类型列表数据
      ticketTypeData: [],
      // 工单类型model隐藏和显示
      ticketTypeVisible: false

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
  // el 创建前
  beforeCreate () {
    // 创建表单
    this.form = this.$form.createForm(this)
    // 创建工单类型管理表单
    this.ticketTypeForm = this.$form.createForm(this)
  },
  created () {
    this.queryParam = { startTime: moment().startOf('day'), endTime: moment().startOf('day') }
    // 初始化表格列数据
    this.initColumnsData()
    // 加载工单类型列表
    this.ticketTypeList()
  },
  computed: {
    // 表格选择功能的配置
    rowSelection () {
      return {
        // 指定选中项的 key 数组，需要和 onChange 进行配合
        selectedRowKeys: this.selectedRowKeys,
        // 选中项发生变化时的回调
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    // 刷新
    refresh () {
      this.pageShow = false
      this.$nextTick(function () {
        this.pageShow = true
        this.selectedRowKeys = []
        this.selectedRows = []
        // this.queryParam = {}
        // 设置起始和结束时间
        this.queryParam = { startTime: moment().startOf('day'), endTime: moment().startOf('day') }
      })
    },
    /**
     * @description: 表格选中状态改变执行
     * @param {*}
     */
    onSelectChange (selectedRowKeys, selectedRows) {
      // 设置选中k值
      this.selectedRowKeys = selectedRowKeys
      // 设置选中行数据
      this.selectedRows = selectedRows
    },
     /**
     * 搜索展开收起切换
     */
     toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
     * 初始化表格列数据
     */
    initColumnsData () {
      this.screenColumns.data = localStorage.getItem(columnslocalStorage) === null ? columns : JSON.parse(localStorage.getItem(columnslocalStorage))
      // 获取表格列数据
      const createColumnsData = this.createColumnsData(this.screenColumns.data)
      // 判断是否使用筛选列功能，真使用，假不使用
      this.columnsData = this.screenColumns.visible ? createColumnsData : columns
    },
    /**
     *  保存表格栏数据到localStorage，并且把新的数据赋值给columnsData
     * @param {*} index 索引
     * @param {*} item 列对象
     */
    saveScreenColumns (index, item) {
      // 设置checked值
      item.checked = !item.checked
      // 筛选列数据赋值给data
      const data = this.screenColumns.data
      // 设置当选索引表格栏数据
      data[index] = item
      // 把表格栏数据保存到localStorage中
      localStorage.setItem(columnslocalStorage, JSON.stringify(data))
      // 保存数据后，把更改后的数据重新赋值给columnsData
      this.columnsData = this.createColumnsData(data)
    },
    /**
     * 按筛选列数据checked为真，生成新表格列数据
     * @param {*} screenColumns 筛选列数据
     */
     createColumnsData (screenColumns) {
      var data = []
      // 遍历筛选列数据
      screenColumns.forEach(item => {
        // 判断checked为真
        if (item.checked) {
          // 添加到数组里
          data.push(item)
        }
      })
      return data
    },
    /**
     * 关闭
     */
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      const form = this.$refs.createModal.form
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.modelName === 'edit') {
            // 编辑
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
    },
    /**
     * 删除
     */
     remove (record) {
      const self = this
      this.$confirm({
        title: '您确定要删除?',
        content: h => <div style="color:red;">正在删除ID: { record.id }</div>,
        onOk () {
          // eslint-disable-next-line promise/param-names
          return new Promise((resilve, reject) => {
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
              resilve()
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
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      this.model = {
        title: '工单处理',
        where: {
          // 是否显示
          notVshow: false,
          label: 'ID',
          decorator: ['id', { initialValue: record.id }],
        },
        data: [
          {
            label: '',
            notVshow: true,
            item: [{ formType: 'input', decorator: ['modelName', { initialValue: 'edit' }] }]
          },
          {
            label: '工单内容',
            item: [
              {
                formType: 'text',
                value: record.content
              }
            ]
          },
          {
            label: '处理结果',
            item: [
              {
                // 已读取只显示文本，不能修改
                formType: record.read === 1 ? 'text' : 'textarea',
                value: record.result,
                decorator: ['result', { initialValue: record.result, rules: [{ required: true, message: '处理结果不能为空' }] }],
                placeholder: '请输入处理结果'
              }
            ]
          }
        ]
      }
      this.visible = true
    },
    /**
     * 工单类型model关闭操作
     */
    ticketTypeHandleCancel () {
      this.ticketTypeVisible = false
    },
    ticketTypeModel () {
      // 执行获取工单类型列表
      this.ticketTypeList()
      // 显示模态框
      this.ticketTypeVisible = true
    },
    /**
     * 获取工单类型列表
     */
    ticketTypeList () {
      TicketTypeList().then(res => {
        if (res.code === 0) {
          // 设置工单类型列表
          this.ticketTypeData = res.result
        }
      })
    },
    /**
     * 添加工单类型
     */
    onAddTicketType () {
      this.ticketTypeForm.validateFields((errors, values) => {
        if (!errors) {
          AddTicketType(values).then(res => {
            if (handlerResult(res)) {
              this.ticketTypeList()
            }
          })
        }
      })
    },
    /**
     * 删除工单类型
     * @param {*} record 
     */
    removeTicketType (record) {
      RemoveTicketType({ id: record.id }).then(res => {
        if (handlerResult(res)) {
          this.ticketTypeList()
        }
      })
    },
    /**
     * 修改工单类型名称
     * @param {*} event 
     * @param {*} record 
     */
    modifyTicketTypeName(event, record) {
      if (event.target.value.length === 0) {
        this.$message.error('名称不能为空')
        return
      }
      if (event.target.value === record.name) {
        return
      }
      ModifyTicketTypeName({ id: record.id, name: event.target.value }).then(res => {
        if (handlerResult(res)) {
          this.ticketTypeList()
        }
      })
    }
  }
}
</script>
