<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="64">
            <a-col :span="8">
              <div>
                <span>帖子id</span>
                <a-form-item>
                  <a-input placeholder='请输入'/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                <span>用户id</span>
                <a-form-item>
                  <a-input placeholder='请输入'/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                <span>所属板块</span>
                <a-form-item>
                  <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                    <a-select-option value="0">已删除账号</a-select-option>
                    <a-select-option value="1">禁言账号</a-select-option>
                    <a-select-option value="2">已注销账号</a-select-option>
                    <a-select-option value="3">普通账号</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </a-col>
          </a-row>
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
          <a-row :gutter='64'>
            <a-col :span='8'>
              <br>
              <a-button type='primary'>刷新</a-button>
            </a-col>
            <a-col :span='8'>
              <div>
                <span>组队状态</span>
                <a-form-item>
                  <a-input placeholder='请选择'/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span='8'>
              <br>
              <a-button type='primary' style='margin-left: 50px;'>筛选</a-button>
              <a-button style='margin-left: 20px;'>重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table :columns='columns' :data-source='data'>
        <span slot='tags' slot-scope='tags'>
          <a-tag v-for='tag in tags' :key='tag'>#{{tag}}</a-tag>
        </span>
        <span slot='operations' slot-scope='status'>
          <a>详情 </a>
          <a v-if='status=="未审核"'>审核 </a>
          <a v-if='status!="已删除"'>删除</a>
          <!--          <span v-for='operation in operations' :key='operation' style='color: #1890ff;'>{{ operation }} </span>-->
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
    title: '失物id',
    dataIndex: 'sid',
    key: 'sid'
  }, {
    title: '用户id',
    dataIndex: 'uid',
    key: 'uid'
  }, {
    title: '发布时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '失物名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
    scopedSlots: { customRender: 'tags' }
  }, {
    title: '帖子状态',
    dataIndex: 'status',
    key: 'status'
  }, {
    title: '操作人员',
    dataIndex: 'operator',
    key: 'operator'
  }, {
    title: '招领类型',
    dataIndex: 'type',
    key: 'type'
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
    sid: '20010408',
    uid: '999876',
    createTime: '2017-10-01 12:00',
    name: '油纸伞',
    tags: ['雨伞'],
    status: '未审核',
    operator: '卞之琳',
    type: '物品遗失',
    // operation: ['详情', '审核', '删除']
    operation: '未审核'
  }, {
    key: '2',
    sid: '20010408',
    uid: '999876',
    createTime: '2017-10-01 12:00',
    name: '钱包',
    tags: ['钱包', '证件'],
    status: '已审核',
    operator: '周杰伦',
    type: '失物寻主',
    operation: '已审核'
  }, {
    key: '3',
    sid: '20010408',
    uid: '999876',
    createTime: '2017-10-01 12:00',
    name: '琵琶',
    tags: ['其他'],
    status: '已删除',
    operator: '白居易',
    type: '物品遗失',
    operation: '已删除'
  }
]

export default {
  name: 'Tongde',
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
