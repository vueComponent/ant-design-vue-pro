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
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="6" :sm="8">
              <a-form-item label="名称">
                <a-input
                  v-model="queryParam.name"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="脚本类型">
                <a-select
                  v-model="queryParam.type"
                  placeholder="全部"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="COMMON">公共脚本</a-select-option>
                  <a-select-option value="ENV_DEPLOY">环境部署</a-select-option>
                  <a-select-option value="BIZ_DEPLOY">业务部署</a-select-option>
                  <a-select-option value="BIZ_DEPLOY_CHECK">业务部署检查</a-select-option>
                  <a-select-option value="BIZ_OPERATION_CHECK">业务运行检查</a-select-option>
                  <a-select-option value="BIZ_UNINSTALL">业务卸载</a-select-option>
                  <a-select-option value="ENV_UNINSTALL">环境卸载</a-select-option>
                  <a-select-option value="BIZ_NUMBER">获取业务编号</a-select-option>
                  <a-select-option value="API_DEPLOY">API调用部署</a-select-option>
                  <a-select-option value="NET_CONFIG">网络配置</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 6) || 6" :sm="8">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)"
                  >查询</a-button
                >
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})"
                  >重置</a-button
                >
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? "收起" : "展开" }}
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
            <a @click="openDrawer(null)"><a-icon type="plus-square" /> 新增脚本</a>
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
        <template slot="nodeTypeName" slot-scope="text, record">
          <span v-if="record.nodeType === 'MAX'" style="color: orangered;">{{ text }}</span>
          <span v-if="record.nodeType === 'MIN'" style="color: green;">{{ text }}</span>
        </template>
        <template slot="deviceTypeName" slot-scope="text, record">
          <span v-if="record.deviceType === 'X86'" style="color: orangered;">{{ text }}</span>
          <span v-if="record.deviceType === 'BOX'" style="color: green;">{{ text }}</span>
          <span v-if="record.deviceType === 'ROUTER'" style="color:blue;">{{ text }}</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="openDrawer(record)" title="编辑"><a-icon type="edit" /></a>
            <a-divider type="vertical" />
            <a @click="remove(record)" title="删除"><a-icon type="delete" /></a>
          </template>
        </span>
      </s-table>
    </a-card>
    <!-- 脚本编辑抽屉 -->
    <script-edit-drawer
      :visible="drawerVisible"
      :scriptData="currentScript"
      :submitting="submitting"
      @close="closeDrawer"
      @submit="handleSubmit"
    />
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import CreateInfoModel from '@/views/modules/CreateInfoModel'
import { Page, Remove, Save } from '@/api/business/script'
import { handlerResult, isPageResult } from '@/api/handlerResult'

import ScriptEditDrawer from './components/ScriptEditDrawer/ScriptEditDrawer.vue';
// 表格字段，checked是否显示
const columns = [
  {
    title: 'ID', dataIndex: 'id', checked: true
  },
  {
    title: '名称', dataIndex: 'name', checked: true
  },
  {
    title: '脚本类型', dataIndex: 'typeName', checked: true
  },
  {
    title: '描述', dataIndex: 'notes', checked: true
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
const columnslocalStorage = 'BusinessCategoryColumns'

export default {
  name: 'BusinessCategory',
  components: {
    STable,
    Ellipsis,
    CreateInfoModel,
    ScriptEditDrawer
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
      drawerVisible: false,
      submitting: false,
      currentScript: null,
      scripts: [
        // 脚本数据
      ]
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
            Remove(record.id).then((response) => {
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
    // 打开抽屉
    openDrawer(script) {
      this.currentScript = script;
      this.drawerVisible = true;
    },
    
    // 关闭抽屉
    closeDrawer() {
      this.drawerVisible = false;
      this.currentScript = null;
    },
    
    // 处理表单提交
    async handleSubmit(formData) {
      this.submitting = true;
      
      // 模拟API调用
      setTimeout(async () => {
        if (formData.id) {
          // 更新脚本
          const index = this.scripts.findIndex(s => s.id === formData.id);
          if (index !== -1) {
            this.$set(this.scripts, index, formData);
          }
        } else {
          // 新增脚本
          this.scripts.push({
            ...formData,
            // id: Date.now() // 模拟ID
          });
        }
        console.log('提交成功：', formData);
        const res = await Save(formData)
        if(res.code === 0){
          this.$message.success('操作成功')
          this.$refs.table.refresh(true)
          this.closeDrawer();
        }else {
          this.$message.error(res.message)
        }
        this.submitting = false;
      }, 1000);
    }
  }
}
</script>
