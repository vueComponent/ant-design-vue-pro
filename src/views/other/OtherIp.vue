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
      IP归属修改，请勿在省市县，如安徽省，填安徽，市和县不用填
    </template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="6" :sm="8">
              <a-form-item label="IP地址">
                <a-input v-model="queryParam.ip" />
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 6) || 6" :sm="8">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
                <a v-show="false" @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
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
            <!-- 筛选列设置 -->
            <a-dropdown style="float:right;" v-model="screeVisible">
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
        <span slot="create_time" v-html="text > 0 ? timeStampToFormatDate(text) : '-'" slot-scope="text" />
        <span slot="modify_time" v-html="text > 0 ? timeStampToFormatDate(text) : '-'" slot-scope="text" />
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:edit @click="editShow(record)" title="编辑">编辑</a>
          </template>
        </span>
      </s-table>
      <create-form
        ref="createModal"
        :visible="visible"
        :model="model"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
// import { mapState } from 'vuex'
import { STable, Ellipsis } from '@/components'
// import { getRoleList } from '@/api/manage'
import { timeStampToFormatDate } from '@/utils/timeUtil'
import CreateForm from '@/views/modules/CreateForm'
import { page, edit } from '@/api/other/ip'
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
    title: '开始IP', dataIndex: 'ipStrStart', checked: true
  },
  {
    title: '结束IP', dataIndex: 'ipStrEnd', checked: true
  },
  {
    title: '国家', dataIndex: 'country', checked: true
  },
  {
    title: '地区/省', dataIndex: 'region', checked: true
  },
  {
    title: '市/区', dataIndex: 'city', checked: true
  },
  {
    title: '县', dataIndex: 'county', checked: true
  },
  {
    title: '运营商', dataIndex: 'isp', checked: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '110px',
    scopedSlots: { customRender: 'action' },
    checked: true
  }
]

// 表格拦数据 localStorage名称
const columnsLocalStorage = 'OtherIpColumns1'

export default {
  name: 'UserList',
  components: {
    STable,
    Ellipsis,
    CreateForm
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
        // console.log('loadData request parameters:', requestParameters)
        return page(requestParameters).then((res) => {
          return res.result
        })
      },
      timeStampToFormatDate,
      visible: false,
      model: null
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
    /**
     * 添加号段
     */
    editShow (record) {
      this.visible = true
      this.model = {
        title: '编辑-' + '操作ID' + record.id,
        decorator: ['id', { initialValue: record.id }],
        data: [
          {
            label: '国家',
            item: [
              {
                formType: 'input',
                decorator: ['country', { initialValue: record.country, rules: [{ required: true, message: '国家不能为空' }] }],
                placeholder: '请输入国家'
              }
            ]
          },
          {
            label: '地区/省',
            item: [
              {
                formType: 'input',
                decorator: ['region', { initialValue: record.region, rules: [{ required: true, message: '省不能为空' }] }],
                placeholder: '请输入省'
              }
            ]
          },
          {
            label: '市/区',
            item: [
              {
                formType: 'input',
                decorator: ['city', { initialValue: record.city }],
                placeholder: '请输入市'
              }
            ]
          },
          {
            label: '县',
            item: [
              {
                formType: 'input',
                decorator: ['county', { initialValue: record.county }],
                placeholder: '请输入县'
              }
            ]
          },
          {
            label: '运营商',
            item: [
              {
                formType: 'input',
                decorator: ['isp', { initialValue: record.isp }],
                placeholder: '请输入运营商'
              }
            ]
          }
        ]
      }
    },
    /**
     * 关闭
     */
    handleCancel () {
      this.visible = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    /**
     * 操作
     */
    handleOk () {
      const form = this.$refs.createModal.form
      this.visible = true
      form.validateFields((errors, values) => {
        if (!errors) {
          edit(values).then(response => {
            if (response.code === 0) {
              this.$message.success('操作成功')
              // 刷新表格
              this.$refs.table.refresh()
              form.resetFields() // 清理表单数据（可不做）
              this.visible = false
            } else {
              this.$message.error(response.message)
            }
          }).catch(error => {
            this.$message.error(error + '')
          })
        }
      })
    }
  }
}
</script>
