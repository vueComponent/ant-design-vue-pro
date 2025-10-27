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
    </template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="6" :sm="8">
              <a-form-item label="标题">
                <a-input v-model="queryParam.title" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="bossID">
                <a-input v-model="queryParam.bossId" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="发布到">
                <a-select v-model="queryParam.userTypes" placeholder="全部" default-value="0">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="USER">会员</a-select-option>
                  <a-select-option value="AGENT">代理商</a-select-option>
                  <a-select-option value="BOSS">BOSS系统</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="置顶">
                <a-select v-model="queryParam.top" placeholder="全部" default-value="0">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">否</a-select-option>
                  <a-select-option value="1">是</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="显示状态">
                <a-select v-model="queryParam.isShow" placeholder="全部" default-value="0">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">显示</a-select-option>
                  <a-select-option value="0">隐藏</a-select-option>
                </a-select>
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
        :rowKey="(record) => record.id"
        :columns="columnsData"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
        :pagination="pagination"
      >
        <!-- 表头 -->
        <template slot="title">
          <div style="min-height:30px" class="table-operator">
            <a-button @click="addShow"><a-icon type="add" />发布公告</a-button>
            <!-- 筛选列设置 -->
            <a-dropdown
              style="float: right"
              v-if="screenColumns.visible"
              v-model="screenColumns.model"
            >
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="(item, index) in screenColumns.data"
                  :key="index"
                  @click="saveScreenColumns(index, item)"
                >
                  <a-checkbox :checked="item.checked">{{ item.title }}</a-checkbox>
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 0px"
                ><a-icon type="profile" /> 筛选列设置 <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </div>
        </template>
        <!-- 表格内容 -->
        <span slot="bossId" slot-scope="text">
          {{ text ? text : '-'}}
        </span>
        <span slot="title1" slot-scope="text, record">
          <a-tag
            v-if="moment().diff(moment(moment(record.createTime).format('YYYY-MM-DD')),'days') <= 7"
            color="red">新</a-tag>
            {{ text }}
        </span>
        <span slot="userTypes" slot-scope="text">
          <span v-for="item in text.split(',')" :key="item">
          <a-tag color="green" v-if="item === 'USER'">会员</a-tag>
          <a-tag color="blue" v-if="item === 'AGENT'">代理商</a-tag>
          <a-tag color="purple" v-if="item === 'BOSS'">BOSS系统</a-tag>
          </span>
        </span>
        <span slot="top" slot-scope="text">
            <a-tag :bordered="false" color="#f50" v-if="text === 0">否</a-tag>
            <a-tag :bordered="false" color="#108ee9" v-if="text === 1">是</a-tag>
        </span>
        <span slot="isShow" slot-scope="text">
          <a-tag :bordered="false" color="#f50" v-if="text === 0">隐藏</a-tag>
          <a-tag :bordered="false" color="#108ee9" v-if="text === 1">显示</a-tag>
        </span>
        <span slot="createTime" v-html="moment(text).format('YYYY-MM-DD HH:mm:ss')" slot-scope="text" />
        <span slot="updateTime" v-html="text !== null && text !== 0 ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'" slot-scope="text" />
        <span slot="action" slot-scope="text, record">
          <a @click="editShow(record)" title="编辑"><a-icon type="edit" /></a>
          <a-divider type="vertical" />
          <a @click="remove(record)" title="删除"><a-icon type="delete" /></a>
        </span>
      </s-table>
    </a-card>
    <create-form
      ref="createModal"
      :visible="visible"
      :model="model"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'

import CreateForm from '@/views/modules/CreateForm'
import { Page, Remove, Save, GetById } from '@/api/notice/manage'
const columns = [
  /*
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  */
  {
    title: 'BossID', dataIndex: 'bossId', scopedSlots: { customRender: 'bossId' }, checked: true
  },
  {
    title: '标题', dataIndex: 'title', scopedSlots: { customRender: 'title1' }, checked: true
  },
  {
    title: '发布到', dataIndex: 'userTypes', scopedSlots: { customRender: 'userTypes' }, checked: true
  },
  {
    title: '置顶', dataIndex: 'top', scopedSlots: { customRender: 'top' }, checked: true
  },
  {
    title: '显示公告', dataIndex: 'isShow', scopedSlots: { customRender: 'isShow' }, checked: true
  },
  {
    title: '发布时间', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' }, width: '150px', checked: true
  },
  {
    title: '修改时间', dataIndex: 'updateTime', scopedSlots: { customRender: 'updateTime' }, width: '150px', checked: false
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '70px',
    scopedSlots: { customRender: 'action' },
    checked: true
  }
]

// 表格拦数据 localStorage名称
const columnslocalStorage = 'NoticeManage4'

export default {
  name: 'NoticeManage',
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
        pageSizeOptions: ['10', '30', '50', '70', '100', '150', '200'],
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
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return Page(requestParameters).then((res) => {
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      moment,
      // Modal
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
        // 设置起始和结束时间
        this.queryParam = { }
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
     * 批量删除
     */
    remove (record) {
      const self = this
      this.$confirm({
        title: '您确定要删除?',
        content: h => <div style="color:red;">正在删除: {record.title}</div>,
        onOk () {
          return new Promise((resolve) => {
            Remove({ id : record.id }).then((response) => {
              if (response.code === 0) {
                self.$message.success(response.message)
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
     * 添加模板分类
     */
    addShow () {
      this.visible = true
      this.model = {
        title: '发布公告',
        data: [
          {
            label: '标题',
            item: [
              {
                formType: 'input',
                decorator: ['title', { initialValue: '', rules: [{ required: true, message: '标题不能为空' }] }],
                placeholder: '请输入标题'
              }
            ]
          },
          {
            label: '发布到',
            item: [
              {
                formType: 'checkbox-group',
                decorator: ['userTypes', { initialValue: ['USER'], rules: [{ required: true, message: '至少选择一个' }] }],
                options: [{ label: '会员', value: 'USER' }, { label: '代理商', value: 'AGENT' }, { label: 'BOSS', value: 'BOSS' }]
              }
            ]
          },
          {
            label: '置顶',
            item: [
              {
                formType: 'radio-group',
                decorator: ['top', { initialValue: 0, rules: [{ required: true, message: '不能为空' }] }],
                options: [{ label: '否', value: 0 }, { label: '是', value: 1 }]
              }
            ]
          },
          {
            label: '内容',
            item: [
              {
                formType: 'textarea',
                decorator: ['content', { initialValue: '', rules: [{ required: true, message: '内容不能为空' }] }],
                placeholder: '请输入内容'
              }
            ]
          }
        ]
      }
    },
    /**
     * 编辑
     */
    async editShow (record) {
      // 获取公告详情
      const res = await GetById({ id: record.id })
      // alert(JSON.stringify(res))
      this.model = {
        title: '编辑',
        where: {
          // 是否显示
          notVshow: record ? false : true,
          label: "ID",
          decorator: ["id", { initialValue: record ? record.id : null }],
        },
        data: [
          {
            label: '标题',
            item: [
              {
                formType: 'input',
                decorator: ['title', { initialValue: res.result.title, rules: [{ required: true, message: '标题不能为空' }] }],
                placeholder: '请输入标题'
              }
            ]
          },
          {
            label: '发布到',
            item: [
              {
                formType: 'checkbox-group',
                decorator: ['userTypes', { initialValue: res.result.userTypes.split(','), rules: [{ required: true, message: '至少选择一个' }] }],
                options: [{ label: '会员', value: 'USER' }, { label: '代理商', value: 'AGENT' }, { label: 'BOSS', value: 'BOSS' }]
              }
            ]
          },
          {
            label: '置顶',
            item: [
              {
                formType: 'radio-group',
                decorator: ['top', { initialValue: res.result.top, rules: [{ required: true, message: '不能为空' }] }],
                options: [{ label: '否', value: 0 }, { label: '是', value: 1 }]
              }
            ]
          },
          {
            label: '显示公告',
            item: [
              {
                formType: 'radio-group',
                decorator: ['isShow', { initialValue: res.result.isShow, rules: [{ required: true, message: '不能为空' }] }],
                options: [{ label: '隐藏', value: 0 }, { label: '显示', value: 1 }]
              }
            ]
          },
          {
            label: '内容',
            item: [
              {
                formType: 'textarea',
                decorator: ['content', { initialValue: res.result.content, rules: [{ required: true, message: '内容不能为空' }] }],
                placeholder: '请输入内容'
              }
            ]
          }
        ]
      }
      this.visible = true
    },
    // 编辑
    AddOrEdit (values, form) {
      values.userTypes = values.userTypes.join(',')
      Save(values).then(response => {
        if (response.code === 0) {
          this.$message.success(response.message)
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
    },
    /**
     * 批量修改购买数量关闭
     */
    handleCancel () {
      this.visible = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    /**
     * 批量修改购买数量提交表单
     */
    handleOk () {
      const form = this.$refs.createModal.form
      this.visible = true
      form.validateFields((errors, values) => {
        if (!errors) {
          this.AddOrEdit(values, form)
        }
      })
    }
  }
}
</script>
