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
      1.全部提现记录包括高级版boss<br>
    </template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="6" :sm="8">
              <a-form-item label="用户ID">
                <a-input v-model="queryParam.userId" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="BossId">
                <a-input v-model="queryParam.bossAdvancedId" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="机构名称">
                <a-input v-model="queryParam.orgName" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="账号类型">
                <a-select v-model="queryParam.accountType" placeholder="全部" default-value="">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">个人</a-select-option>
                  <a-select-option value="1">企业</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="姓名或企业名">
                <a-input v-model="queryParam.name" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="提现账号">
                <a-input v-model="queryParam.account" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.state" placeholder="全部状态" default-value="0">
                  <a-select-option value="">全部状态</a-select-option>
                  <a-select-option value="0">待处理</a-select-option>
                  <a-select-option value="1">提现成功</a-select-option>
                  <a-select-option value="2">提现失败</a-select-option>
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
            <template v-if="advanced">
            </template>
            <a-col :md="(!advanced && 6) || 6" :sm="8">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = { startTime: moment().startOf('day'), endTime: moment().startOf('day') })">重置</a-button>
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
        <!-- 表格内容 -->
        <span slot="realnameType" slot-scope="text">
          <span v-if="text === 0" style="font-weight:bold;color:#045FB4;">个人</span>
          <span v-else-if="text === 1" style="font-weight:bold;color:#1C1C1C;">企业</span>
          <span v-else>-</span>
        </span>
        <span slot="bossAdvancedId" slot-scope="text, record">
          {{ text === 0 ? '--' : text }}
        </span>
        <span slot="orgName" slot-scope="text, record">
          <a-tag v-if="record.accountType === 0" color="green">个人</a-tag>
          <a-tag v-else color="red">企业</a-tag>
          <span>{{ text }}</span>
        </span>
        <span slot="account" slot-scope="text, record">
          <div v-if="record.bankCardType">
            <a-tag v-if="record.bankCardType === '借记卡'" color="green">{{record.bankCardType}}</a-tag>
            <a-tag v-else-if="record.bankCardType === '信用卡'" color="red">{{record.bankCardType}}</a-tag>
            <a-tag v-else>{{record.bankCardType}}</a-tag>
          </div>
          <span>{{ text }}</span>
        </span>
        <span slot="taxRate" slot-scope="text, record">
          <span v-if="record.accountType === 0">{{ multi(record.taxRate, 100) }}%</span>
          <span v-else>--</span>
        </span>
        <span slot="receiptMoney" slot-scope="text">
          {{ text }}
        </span>
        <span slot="state" slot-scope="text">
          <span v-if="text ===0" style="font-weight:bold;color:#045FB4;">待处理</span>
          <span v-else-if="text ===1" style="font-weight:bold;color:#088A08;">提现成功</span>
          <span v-else-if="text ===2" style="font-weight:bold;color:#FF0000;">提现失败</span>
          <span v-else>-</span>
        </span>
        <span slot="createdAt" slot-scope="text, record">
          <div>{{ text }}</div>
          <div style="color: #FF0000;">{{ record.updatedAt === null ? '-' : record.updatedAt }}</div>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
// import { mapState } from 'vuex'
import { STable, Ellipsis } from '@/components'
// import { getRoleList } from '@/api/manage'

import CreateForm from '@/views/modules/CreateForm'
import { Page } from '@/api/withdrawal/allRecord'
import { isPageResult } from '@/api/handlerResult'
import { multi } from '@/utils/operationUtil'
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
    title: '用户ID', dataIndex: 'userId', checked: true
  },
  {
    title: 'bossID', dataIndex: 'bossAdvancedId', scopedSlots: { customRender: 'bossAdvancedId' }, checked: true
  },
  {
    title: '机构名称', dataIndex: 'orgName', scopedSlots: { customRender: 'orgName' }, checked: true
  },
  {
    title: '姓名/企业名', dataIndex: 'name', checked: true
  },
  {
    title: '提现账号', dataIndex: 'account', scopedSlots: { customRender: 'account' }, checked: true
  },
  {
    title: '提现金额', dataIndex: 'money', checked: true
  },
  {
    title: '税率', dataIndex: 'taxRate', scopedSlots: { customRender: 'taxRate' }, checked: true
  },
  {
    title: '到账金额', dataIndex: 'receiptMoney', scopedSlots: { customRender: 'receiptMoney' }, checked: true
  },
  {
    title: '状态', dataIndex: 'state', scopedSlots: { customRender: 'state' }, checked: true
  },
  {
    title: '交易/处理时间', dataIndex: 'createdAt', scopedSlots: { customRender: 'createdAt' }, checked: true
  },
  {
    title: '备注', dataIndex: 'notes', checked: true
  }
]

// 表格拦数据 localStorage名称
const columnslocalStorage = 'WithdrawRecordColumns7'

export default {
  name: 'WithdrawRecord',
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  data () {
    this.columns = columns
    return {
      // 页面是否显示
      pageShow: true,
      /**
       * 表格
       */
      // 分页数组
      pagination: {
        pageSizeOptions: ['10', '30', '50', '70', '100'],
        showTotal: total => `共 ${total} 条数据`
      },
      // 表格栏数据对象
      columnsData: [],
      // 筛选列对象,data=数据,visible=是否显示筛选列(如果不显示，使用columns显示全部表格数据),model=菜单是否显示
      screenColumns: { data: [], visible: true, model: false },
      // 筛选列设置
      screeVisible: false,

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
        this.queryParam.startTime = moment(this.queryParam.startTime).format('YYYY-MM-DD')
        this.queryParam.endTime = moment(this.queryParam.endTime).format('YYYY-MM-DD')
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return Page(requestParameters).then((res) => {
          if (isPageResult(res)) {
            return res.result
          }
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      moment,
      model: null,
      visible: false,
      multi
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
    // 初始化表格列数据
    this.initColumnsData()
    // 设置起始和结束时间
    this.queryParam = { startTime: moment().startOf('day'), endTime: moment().startOf('day') }
  },
  computed: {
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
  }
}
</script>