<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter='64'>
            <a-col :span='8'>
              <div>
                <span>开始日期</span><br/>
                <a-date-picker style='width: 100%;'/>
              </div>
            </a-col>
            <a-col :span='8'>
              <div>
                <span>结束日期</span><br/>
                <a-date-picker style='width: 100%;'/>
              </div>
            </a-col>
            <a-col :span='8'>
              <div>
                <span>操作人员</span>
                <a-input></a-input>
              </div>
            </a-col>
          </a-row>
          <div style='height: 20px;'/>
          <a-row :gutter='24'>
            <a-col :span='4'>
              <a-button type='primary'>刷新</a-button>
            </a-col>
            <a-col :offset='18'>
              <a-button type='primary'>筛选</a-button>
              <a-button style='margin-left: 20px;'>重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table :columns='columns' :data-source='data'>
      </a-table>
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'

import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'

const columns = [
  {
    title: '操作人员',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '开始日期',
    dataIndex: 'startTime',
    key: 'startTime'
  },
  {
    title: '结束日期',
    dataIndex: 'endTime',
    key: 'endTime'
  },
  {
    title: '审核文章数量',
    dataIndex: 'auditNumber',
    key: 'auditNumber'
  }
]

const data = [
  {
    key: '1',
    name: '张恒',
    startTime: '2015-10-02',
    endTime: '2015-10-02',
    auditNumber: 50
  },
  {
    key: '2',
    name: '郑爽',
    startTime: '2015-10-02',
    endTime: '2015-10-02',
    auditNumber: 67
  }
]

export default {
  name: 'Audit',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    // this.columns = columns
    return {
      columns,
      data,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getServiceList(requestParameters)
          .then(res => {
            return res.result
          })
      },
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
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
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
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    refresh () {
      return 0
    }
  }
}
</script>
