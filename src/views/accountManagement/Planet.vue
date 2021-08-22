<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="4">
            <a-col :span="4">
              <a-button type='primary' style="margin-left: 8px;" @click="refresh">刷新</a-button>
            </a-col>
            <a-col :span="3">
              <a-form-item label="uid">
                <a-input v-model="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item label="账号状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">已删除账号</a-select-option>
                  <a-select-option value="1">禁言账号</a-select-option>
                  <a-select-option value="2">已注销账号</a-select-option>
                  <a-select-option value="3">普通账号</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
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
        <span slot='personalTags' slot-scope='tags'>
          <a-tag v-for='tag in tags' :key='tag'>{{tag}}</a-tag>
        </span>
        <span slot='interestTags' slot-scope='tags'>
          <a-tag v-for='tag in tags' :key='tag'>{{tag}}</a-tag>
        </span>
        <span slot='historicalTeam' slot-scope='text'>
          <a>{{text}}</a>
        </span>
        <span slot='operations' slot-scope='operations'>
          <a v-for='operation in operations' :key='operation'>{{operation}} </a>
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
    title: 'uid',
    dataIndex: 'uid',
    key: 'uid'
  }, {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName'
  }, {
    title: '年级',
    dataIndex: 'grade',
    key: 'grade',
    sorter: true
  }, {
    title: '学历',
    dataIndex: 'background',
    key: 'background',
    filters: [
      { text: '本科', value: 'undergraduate' },
      { text: '硕士', value: 'master' },
      { text: '博士', value: 'doctor' }
    ]
  }, {
    title: '个人标签',
    dataIndex: 'personalTags',
    key: 'personalTags',
    scopedSlots: { customRender: 'personalTags' }
  }, {
    title: '兴趣标签',
    dataIndex: 'interestTags',
    key: 'interestTags',
    scopedSlots: { customRender: 'interestTags' }
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '历史组队',
    dataIndex: 'historicalTeam',
    key: 'historicalTeam',
    scopedSlots: { customRender: 'historicalTeam' }
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
    uid: '10086',
    nickName: '中国移动',
    grade: '大五',
    background: '本科',
    personalTags: ['好学小白', '领导者'],
    interestTags: ['口才', '设计', '才艺'],
    createTime: '1202-01-01 10:24',
    historicalTeam: '查看',
    operation: ['禁言', '操作记录']
  }, {
    key: '2',
    uid: '10086',
    nickName: '中国移动',
    grade: '大五',
    background: '本科',
    personalTags: ['好学小白', '领导者'],
    interestTags: ['口才', '设计', '才艺'],
    createTime: '1202-01-01 10:24',
    historicalTeam: '查看',
    operation: ['解除禁言', '操作记录']
  }, {
    key: '3',
    uid: '10086',
    nickName: '中国移动',
    grade: '大五',
    background: '本科',
    personalTags: ['好学小白', '领导者'],
    interestTags: ['口才', '设计', '才艺'],
    createTime: '1202-01-01 10:24',
    historicalTeam: '查看',
    operation: ['操作记录']
  }
]

export default {
  name: 'Planet',
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
