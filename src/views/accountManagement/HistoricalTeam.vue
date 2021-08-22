<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="4">
            <a-col :span="4">
              <a-button type='primary' style="margin-left: 8px;" @click="refresh">刷新</a-button>
            </a-col>
            <a-col :span="4" :offset='8'>
              <a-form-item>
                <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item>
                <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type='primary' @click="$refs.table.refresh(true)">筛选</a-button>
                <a-button type='primary' style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table :columns='columns' :data-source='data'>
        <span slot='operations'>
          <a>组队详情</a>
        </span>
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
    title: '组队id',
    dataIndex: 'tid',
    key: 'tid'
  }, {
    title: '发布时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '组队标题',
    dataIndex: 'title',
    key: 'title'
  }, {
    title: '组队状态',
    dataIndex: 'teamStatus',
    key: 'teamStatus'
  }, {
    title: '帖子状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  }, {
    title: '组队进度',
    dataIndex: 'teamProgress',
    key: 'teamProgress'
  }, {
    title: '所属板块',
    dataIndex: 'plate',
    key: 'plate'
  }, {
    title: '操作人员',
    dataIndex: 'operator',
    key: 'operator'
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
    tid: '20010408',
    createTime: '2017-10-01 12:00',
    title: '断章',
    teamStatus: '啥呀',
    status: '未审核',
    teamProgress: '1/5',
    plate: '新生板块',
    operator: '卞之琳',
    // operation: ['详情', '审核', '删除']
    operation: '组队详情'
  }, {
    key: '2',
    tid: '20010408',
    createTime: '2017-10-01 12:00',
    title: '稻香',
    teamStatus: '已关闭',
    status: '已审核',
    teamProgress: '5/5',
    plate: '新生板块',
    operator: '周杰伦',
    operation: '已审核'
  }, {
    key: '3',
    tid: '20010408',
    createTime: '2017-10-01 12:00',
    title: '琵琶行',
    teamStatus: '啥呀',
    status: '已删除',
    teamProgress: '0/100',
    plate: '新生板块',
    operator: '白居易',
    operation: '已删除'
  }
]

export default {
  name: 'HistoricalTeam',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
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
