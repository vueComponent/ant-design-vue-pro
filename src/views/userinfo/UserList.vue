<template>
  <a-card :bordered="false">

    <s-table
      ref="table"
      size="default"
      :rowKey="key"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">配置</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">订阅报警</a>
        </template>
      </span>
    </s-table>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getServiceList } from '@/api/manage'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '规则编号1',
    dataIndex: 'no'
  },
  {
    title: '描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '服务调用1次数',
    dataIndex: 'callNo',
    sorter: true,
    // needTotal: true,
    customRender: (text) => text + ' 次'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  components: {
    STable
  },
  data: function () {
    return {
      // mdl: {},
      // 高级搜索 展开/关闭
      // advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getServiceList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      // custom table alert & rowSelection
      options: {
        alert: { show: false, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      methods: {
        onSelectChange (selectedRowKeys, selectedRows) {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      }
      // }//,
      // optionAlertShow: false
    }
  }//,
  // filters: {
  //   statusFilter (type) {
  //     return statusMap[type].text
  //   },
  //   statusTypeFilter (type) {
  //     return statusMap[type].status
  //   }
  // },
  // created () {
  //   this.tableOption()
  //   getRoleList({ t: new Date() })
  // },
  // methods: {
  //   tableOption () {
  //     if (!this.optionAlertShow) {
  //       this.options = {
  //         alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
  //         rowSelection: {
  //           selectedRowKeys: this.selectedRowKeys,
  //           onChange: this.onSelectChange,
  //           getCheckboxProps: record => ({
  //             props: {
  //               disabled: record.no === 'No 2', // Column configuration not to be checked
  //               name: record.no
  //             }
  //           })
  //         }
  //       }
  //       this.optionAlertShow = true
  //     } else {
  //       this.options = {
  //         alert: false,
  //         rowSelection: null
  //       }
  //       this.optionAlertShow = false
  //     }
  //   },
  //
  //   handleEdit (record) {
  //     console.log(record)
  //     this.$refs.modal.edit(record)
  //   },
  //   handleSub (record) {
  //     if (record.status !== 0) {
  //       this.$message.info(`${record.no} 订阅成功`)
  //     } else {
  //       this.$message.error(`${record.no} 订阅失败，规则已关闭`)
  //     }
  //   },
  //   handleOk () {
  //     this.$refs.table.refresh()
  //   },
  //   onSelectChange (selectedRowKeys, selectedRows) {
  //     this.selectedRowKeys = selectedRowKeys
  //     this.selectedRows = selectedRows
  //   },
  //   toggleAdvanced () {
  //     this.advanced = !this.advanced
  //   },
  //   resetSearchForm () {
  //     this.queryParam = {
  //       date: moment(new Date())
  //     }
  //   }
  // }
}
</script>
