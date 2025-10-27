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
      添加手机号段只要输入完整手机自动添加上
    </template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="6" :sm="8">
              <a-form-item label="ID">
                <a-input v-model="queryParam.id" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="号段">
                <a-input v-model="queryParam.mobile" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="运营商">
                <a-select v-model="queryParam.mobileType" placeholder="全部运营商" default-value="0">
                  <a-select-option value="">全部运营商</a-select-option>
                  <a-select-option v-for="(item, index) in mobileTypeData" :key="index" :value="item.name">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="省">
                <a-input v-model="queryParam.provance" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="市">
                <a-input v-model="queryParam.city" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="区号">
                <a-input v-model="queryParam.areaCode" @keyup.enter="$refs.table.refresh(true)" allowClear />
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
        :rowKey="record=>record.goods_id"
        :columns="columnsData.length === 0 ? columns : columnsData"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
        :pagination="pagination"
      >
        <!-- 表头 -->
        <template slot="title">
          <div style="min-height:30px" class="table-operator">
            <a-button v-action:add type="primary" icon="plus" @click="addShow">添加号段</a-button>
            <a-button type="primary" v-action:remove v-if="selectedRowKeys.length > 0" @click="remove"><a-icon type="delete" />批量删除</a-button>
            <a-button type="primary" v-action:batchModifyMobileType v-if="selectedRowKeys.length > 0" @click="batchModifyMobileType"><a-icon type="edit" />批量修改运营商</a-button>
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
import { page, batchRemove, add, operatorList, edit, batchModifyMobileType } from '@/api/other/segment'
import { isPageResult, handlerResult } from '@/api/handlerResult'
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
    title: '运营商', dataIndex: 'mobile_type', checked: true
  },
  {
    title: '号段', dataIndex: 'mobile', checked: true
  },
  {
    title: '省', dataIndex: 'provance', checked: true
  },
  {
    title: '市', dataIndex: 'city', checked: true
  },
  {
    title: '区号', dataIndex: 'area_code', checked: true
  },
  {
    title: '创建时间', dataIndex: 'create_time', scopedSlots: { customRender: 'create_time' }, width: '150px', checked: true
  },
  {
    title: '修改时间', dataIndex: 'modify_time', scopedSlots: { customRender: 'modify_time' }, width: '150px', checked: false
  },
  {
    title: '操作人', dataIndex: 'operatorName', checked: false
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
const columnsLocalStorage = 'OtherSegmentColumns3'

export default {
  name: 'OtherSegment',
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
          if (isPageResult(res)) {
            return res.result
          }
        })
      },
      timeStampToFormatDate,
      visible: false,
      model: null,
      // 运营商数据
      mobileTypeData: [],
      provanceData: [],
      cityData: [],
      // 运营商默认值
      mobileTypeInitialValue: ''
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
    this.operatorList()
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
     * 删除商品
     */
    remove () {
      if (this.selectedRows.length === 0) {
        this.$message.error('请至少选择一个,再操作')
        return
      }
      const id = []
      this.selectedRows.map(item => {
          id.push(item.id)
      })
      let ids = ''
      for (let i = 0; i < this.selectedRows.length; i++) {
        if (i > 10) {
          ids = ids + '......'
          break
        }
        if (i === 0) {
          ids = ids + this.selectedRows[i].id
        } else {
          ids = ids + ',' + this.selectedRows[i].id
        }
      }
      const self = this
      this.$confirm({
        title: '您确定要删除商品?',
        content: h => <div style="color:red;">正在操作{ self.selectedRows.length }条记录：{ ids }</div>,
        onOk () {
          return new Promise((resolve) => {
            // 通过URLSearchParams组装请求参数
            var form1 = new URLSearchParams()
            form1.append('id[]', id)
            batchRemove(form1).then((response) => {
              if (response.code === 0) {
                self.$message.success(response.message)
                self.selectedRows = []
                self.selectedRowKeys = []
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
     * 添加号段
     */
    addShow () {
      this.visible = true
      const arr = []
      this.mobileTypeData.forEach(i => {
        arr.push({ value: i.name, name: i.name })
      })
      this.model = {
        title: '添加号段',
        data: [
          {
            label: '',
            formItemShow: true,
            item: [
              {
                formType: 'input',
                decorator: ['method', { initialValue: 'add' }]
              }
            ]
          },
          {
            label: '手机号段',
            item: [
              {
                formType: 'input',
                decorator: ['mobile', { initialValue: '', rules: [{ required: true, min: 7, max: 7, message: '长度7位数' }] }],
                placeholder: '请输入手机号段'
              }
            ]
          },
          {
            label: '运营商',
            item: [
              {
                formType: 'select',
                decorator: ['mobile_type', { rules: [{ required: true, message: '运营商不能为空' }] }],
                placeholder: '请选择运营商',
                value: arr
              }
            ]
          },
          {
            label: '省',
            item: [
              {
                formType: 'input',
                decorator: ['provance', { rules: [{ required: true, message: '省不能为空' }] }],
                placeholder: '请输入省,不要带省字，例如:安徽'
              }
            ]
          },
          {
            label: '市',
            item: [
              {
                formType: 'input',
                decorator: ['city', { rules: [{ required: true, message: '市不能为空' }] }],
                placeholder: '请输入市,不要带市字，例如:合肥'
              }
            ]
          },
          {
            label: '区号',
            item: [
              {
                formType: 'input',
                decorator: ['area_code'],
                placeholder: '请输入区号'
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
          if (values.method === 'add') {
            add(values).then(response => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh()
                form.resetFields() // 清理表单数据（可不做）
                this.visible = false
                this.selectedRows = []
                this.selectedRowKeys = []
              }
            }).catch(error => {
              this.$message.error(error + '')
            })
          } else if (values.method === 'edit') {
            edit(values).then(response => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh()
                form.resetFields() // 清理表单数据（可不做）
                this.visible = false
                this.selectedRows = []
                this.selectedRowKeys = []
              }
            }).catch(error => {
              this.$message.error(error + '')
            })
          } else if (values.method === 'modifyMobileType') {
            const id = []
            this.selectedRows.map(item => {
              id.push(item.id)
            })
            // 通过URLSearchParams组装请求参数
            var form1 = new URLSearchParams()
            form1.append('id[]', id)
            form1.append('mobileType', values.mobileType)
            batchModifyMobileType(form1).then(response => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh()
                form.resetFields() // 清理表单数据（可不做）
                this.visible = false
                this.selectedRows = []
                this.selectedRowKeys = []
              }
            }).catch(error => {
              this.$message.error(error + '')
            })
          }
        }
      })
    },
    // 显示编辑
    editShow (record) {
      this.visible = true
      const arr = []
      this.mobileTypeData.forEach(i => {
        arr.push({ value: i.name, name: i.name })
      })
      this.model = {
        title: '编辑号段',
        decorator: ['id', { initialValue: record.id }],
        data: [
          {
            label: '',
            item: [
              {
                formType: 'input',
                decorator: ['method', { initialValue: 'edit' }],
                isShow: true
              }
            ]
          },
          {
            label: '号段',
            item: [
              {
                // text文本
                formType: 'text',
                col: 24,
                value: record.mobile
              }
            ]
          },
          {
            label: '运营商',
            item: [
              {
                formType: 'select',
                decorator: ['mobile_type', { initialValue: record.mobile_type, rules: [{ required: true, message: '运营商不能为空' }] }],
                placeholder: '请选择运营商',
                value: arr
              }
            ]
          },
          {
            label: '省',
            item: [
              {
                formType: 'input',
                decorator: ['provance', { initialValue: record.provance, rules: [{ required: true, message: '省不能为空' }] }],
                placeholder: '请输入省'
              }
            ]
          },
          {
            label: '市',
            item: [
              {
                formType: 'input',
                decorator: ['city', { initialValue: record.city, rules: [{ required: true, message: '市不能为空' }] }],
                placeholder: '请输入市'
              }
            ]
          },
          {
            label: '区号',
            item: [
              {
                formType: 'input',
                decorator: ['area_code', { initialValue: record.area_code }],
                placeholder: '请输入区号，可以为空'
              }
            ]
          }
        ]
      }
      /*
      setTimeout(() => {
        // 设置类型
        this.mobileTypeInitialValue = record.mobile_type
        // alert(this.mobileTypeInitialValue)
        this.form.setFieldsValue({ 'mobile_type': this.mobileTypeInitialValue })
        this.form.setFieldsValue({ 'provance': record.provance })
        this.form.setFieldsValue({ 'city': record.city })
      }, 100)
      // this.listProv(record.provance, record.city)
      setTimeout(() => {
      this.editVisible = true
      }, 200)
      */
    },
    // 批量修改运营商
    batchModifyMobileType () {
      if (this.selectedRows.length === 0) {
        this.$message.error('请至少选择一个,再操作')
        return
      }
      this.visible = true
      const arr = []
      this.mobileTypeData.forEach(i => {
        arr.push({ value: i.name, name: i.name })
      })
      this.model = {
        title: '批量修改运营商',
        data: [
          {
            label: '',
            item: [
              {
                formType: 'input',
                decorator: ['method', { initialValue: 'modifyMobileType' }],
                isShow: true
              }
            ]
          },
          {
            label: '运营商',
            item: [
              {
                formType: 'select',
                decorator: ['mobileType', { rules: [{ required: true, message: '运营商不能为空' }] }],
                placeholder: '请选择运营商',
                value: arr
              }
            ]
          }
        ]
      }
    },
    // 获取运营商
    operatorList () {
      operatorList().then(res => {
        if (res.code === 0) {
          this.mobileTypeData = res.result
        }
      })
    }
    /*
    // 获取省
    listProv (provStr, cityStr) {
      this.provanceInitialValue = ''
      listProductAreaByFid({ fid: 0 }).then(res => {
        if (res.code === 0 && res.result !== null) {
          const arr = []
          res.result.forEach(i => {
            // 排除掉全国地区
            if (i.area_id !== 1) {
              arr.push(i)
            }
          })
          this.provanceData = arr
          // 按省名称获取省id
          let areaId = 0
          arr.forEach(i => {
            if (provStr === i.name) {
              areaId = i.area_id
            }
          })
          setTimeout(() => {
            this.provanceInitialValue = areaId
          }, 200)
          alert(areaId + '  ' + this.provanceInitialValue)
          this.listCity(areaId, cityStr)
        }
      })
    },
    // 按省id获取全部市
    listCity (fid, cityStr) {
      listProductAreaByFid({ fid: fid }).then(res => {
        if (res.code === 0 && res.result !== null) {
          const arr = []
          res.result.forEach(i => {
            // 排除掉全省
            if (!i.name.includes('全省')) {
              arr.push(i)
            }
          })
          this.cityData = arr
          // 获取市id
          let cityId
          for (let i = 0; i < arr.length; i++) {
            if (cityStr === null) {
              cityId = arr[i].area_id
              break
            } else if (cityStr === arr[i].name) {
              cityId = arr[i].area_id
              break
            }
          }
          setTimeout(() => {
            this.cityInitialValue = cityId
          }, 50)
        }
      })
    },
    provChange (event) {
      this.listCity(event, null)
    }
    */
  }
}
</script>
