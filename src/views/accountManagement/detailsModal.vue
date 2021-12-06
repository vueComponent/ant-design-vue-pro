<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-modal v-model="detailsVisible" title="详细信息" ok-text="确认" cancel-text="取消" @ok="hideModal">
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            恒星号名称：{{}}
          </a-col>
          <a-col :md="12" :lg="12">
            恒星号属性：{{ detailsCurrentRow.property }}
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            <!-- 恒星号类型：{{ detailsCurrentRow.type }} -->
          </a-col>
          <a-col :md="12" :lg="12">
            <!-- 人数规模：{{ detailsCurrentRow.memberCount }} -->
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            负责人姓名：{{}}
          </a-col>
          <a-col :md="12" :lg="12">
            负责人学号：{{}}
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            负责人手机号：{{}}
          </a-col>
          <a-col :md="12" :lg="12">
            负责人微信号：{{}}
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            负责人邮箱：{{}}
          </a-col>
          <a-col :md="12" :lg="12">
            指导老师姓名：{{}}
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            指导老师联系方式：{{}}
          </a-col>
        </a-row>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'
import { queryOrganizationWithPage } from '@/api/planet' // 引入后台接口
import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'

const columns = [
  {
    title: 'uid',
    dataIndex: 'id',
    key: 'id'
  }, {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName'
  }, {
    title: '负责人',
    dataIndex: 'operatorName',
    key: 'operatorName'
  }, {
    title: '历史发帖',
    dataIndex: 'historicalPosting',
    key: 'historicalPosting',
    scopedSlots: { customRender: 'historicalPosting' }
  }, {
    title: '详细信息',
    dataIndex: 'detail',
    key: 'detail',
    scopedSlots: { customRender: 'detail' }
  }, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operations' }
  }
]

const data = [
  {
    key: '1',
    uid: '1',
    nickName: 'bilibili',
    head: '陈睿',
    // historicalPosting: '查看',
    // detail: '查看',
    operation: ['禁言', '操作记录']
  }, {
    key: '2',
    uid: '2',
    nickName: '华为',
    head: '任正非',
    // historicalPosting: '查看',
    // detail: '查看',
    operation: ['解除禁言', '操作记录']
  }, {
    key: '3',
    uid: '3',
    nickName: '字节跳动',
    head: '张一鸣',
    // historicalPosting: '查看',
    // detail: '查看',
    operation: ['操作记录']
  }
]

export default {
  name: 'Star',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      columns,
      detailsVisible: false, // 详情弹框
      queryParams: {
       pageNo: 1,
       pageSize: 10,
       createTime: '',
       updateTime: '',
       id: '',
       blockType: '-1'
      },
      detailsCurrentRow: {},
      tableData: [], // 存储列表数据
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      // loadData: parameter => {
      //   const requestParameters = Object.assign({}, parameter, this.queryParam)
      //   console.log('loadData request parameters:', requestParameters)
      //   return getServiceList(requestParameters)
      //     .then(res => {
      //       return res.result
      //     })
      // },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  // filters: {
  //   statusFilter (type) {
  //     return statusMap[type].text
  //   },
  //   statusTypeFilter (type) {
  //     return statusMap[type].status
  //   }
  // },
  created () {
    getRoleList({ t: new Date() })
    this.doQuery()
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    doQuery () {
      this.getListData()
    },
    // 查看详细信息
    lookDetails (row) {
      this.detailsVisible = true
      this.detailsCurrentRow = row
    },
    // 查看历史发帖
    goHistoricalPost (record) {

    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    getListData () {
      queryOrganizationWithPage(this.queryParams).then(res => {
        this.tableData = res.data.records // 把从接口拿到的数据赋给表格数据变量
      })
    },
    onCreateTimeChange (date, dateString) {
      console.log(dateString, '哈哈')
      this.queryParams.createTime = dateString
    },
    onUpdateTimeChange (date, dateString) {
      this.queryParams.updateTime = dateString
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    reset () {
      // this.queryParam = {
      //   date: moment(new Date())
      // }
      this.queryParams = {
       pageNo: 1,
       pageSize: 10,
       createTime: '',
       updateTime: '',
       userId: '',
       id: '',
       blockType: '-1'
      }
    },
    refresh () {
      this.getListData()
    }
  }
}
</script>
