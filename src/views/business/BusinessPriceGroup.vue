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
            <a @click="addModel()"><a-icon type="plus-square" /> 添加分组</a>
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
        <span slot="defaultFlag" slot-scope="text">
          <span v-if="text === 1" style="color: #1890ff;">是</span>
          <span v-else>-</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="addModel(record)" title="编辑"><a-icon type="edit" /></a>
            <a-divider type="vertical" />
            <a @click="remove(record)" title="删除"><a-icon type="delete" /></a>
          </template>
        </span>
      </s-table>
      <create-form ref="createModal" :visible="visible" :model="model" @cancel="handleCancel" @ok="handleOk" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
// import { mapState } from 'vuex'
import { STable, Ellipsis } from '@/components'
import CreateForm from '@/views/modules/CreateForm'
import CreateInfoModel from '@/views/modules/CreateInfoModel'
import { Page, Remove, Save } from '@/api/business/priceGroup'
import { timeStampToFormatDate } from '@/utils/timeUtil'
import { handlerResult, isPageResult } from '@/api/handlerResult'
// 表格字段，checked是否显示
const columns = [
  {
    title: '名称', dataIndex: 'name', checked: true
  },
  {
    title: '默认', dataIndex: 'defaultFlag', checked: true, scopedSlots: { customRender: 'defaultFlag' }
  },
  {
    title: '备注', dataIndex: 'remark', checked: true
  },
  {
    title: '创建时间', dataIndex: 'createdAt', checked: true, width: '150px'
  },
  {
    title: '更新时间', dataIndex: 'updatedAt', checked: false, width: '150px'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '80px',
    scopedSlots: { customRender: 'action' },
    checked: true
  }
]

// 表格拦数据 localStorage名称，保证每个页面都是唯一的
const columnslocalStorage = 'BusinessPriceGroupColumns1'

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
      timeStampToFormatDate
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
    this.queryParam = {}
    // 初始化表格列数据
    this.initColumnsData()
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
        this.queryParam = {}
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
          // 编辑
          values.isDefault = values.isDefault ? 1 : 0
          Save(values).then(response => {
            if (handlerResult(response)) {
              // 刷新表格
              this.$refs.table.refresh()
              this.visible = false
            }
          })
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
            Remove({ id: record.id }).then((response) => {
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
    // 添加和编辑model
    addModel (record) {
      this.visible = true
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
      this.model = {
        title: record ? '编辑' : '添加分组',
        where: {
          // 是否显示
          notVshow: record ? false : true,
          label: 'ID',
          decorator: ['id', { initialValue: record ? record.id : null }],
        },
        data: [
          {
            label: '名称',
            item: [
              {
                formType: 'input',
                col: 24,
                placeholder: '请输入分组名称',
                decorator: ['name', { initialValue: record ? record.name : '', rules: [{ required: true,  message: '分组名称不能为空' }] }]
              }
            ]
          },
          {
            label: '默认',
            item: [
              {
                formType: 'radio-group',
                col: 24,
                placeholder: '请选择默认',
                decorator: ['defaultFlag', { initialValue: record ? record.defaultFlag : 0 }],
                options: [
                  {
                    label: '是',
                    value: 1
                  },
                  {
                    label: '否',
                    value: 0
                  }
                ]
              }
            ]
          },
          {
            label: '备注',
            item: [
              {
                formType: 'textarea',
                col: 24,
                placeholder: '请输入备注，可以为空',
                decorator: ['remark', { initialValue: record ? record.remark : null }]
              }
            ]
          }
        ]
      }
    },
  }
}
</script>
