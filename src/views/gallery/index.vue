<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="6" :sm="24">
            <a-form-item label="规则编号"><a-input v-model="queryParam.id" placeholder="" /></a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :md="12" style="text-align:right" :sm="24"><a-button type="primary"  @click="$refs.registerModal.add()">添加采集</a-button><a-button type="primary"  style="margin-left: 20px;">导出</a-button></a-col>
          <a-col v-if="advanced" class="tableSearch" :md="6">
              <a-card>
                <a-form-item label="使用状态">
                  <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="调用次数"><a-input-number v-model="queryParam.callNo" style="width: 100%" /></a-form-item>
                <a-form-item label="更新日期"><a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期" /></a-form-item>
                <a-form-item label="使用状态">
                  <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="使用状态">
                  <a-select placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-card>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" size="default" rowKey="patientId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="collectStatus" slot-scope="text"><a-badge :status="text | statusTypeFilter" :text="text | statusFilter" /></span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">
            <a-icon type="edit" />
            编辑
          </a>
        </template>
      </span>
    </s-table>
    <Register-form ref="registerModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getReportList } from '@/api/report'
import RegisterForm from './modules/RegisterForm'

const statusMap = {
  0: {
    status: 'default',
    text: '未执行'
  },
  1: {
    status: 'processing',
    text: '执行中'
  },
  2: {
    status: 'success',
    text: '已完成'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    RegisterForm
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '报告编号',
          dataIndex: 'reportCode'
        },
        {
          title: '档案号',
          dataIndex: 'fileCode'
        },
        {
          title: '患者姓名',
          dataIndex: 'patientName'
        },
        {
          title: '身份证号',
          dataIndex: 'patientCard'
        },
        {
          title: '创建时间',
          dataIndex: 'collectDate',
          customRender: collectDate => moment(collectDate).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '采集状态',
          dataIndex: 'collectStatus',
          scopedSlots: { customRender: 'collectStatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getReportList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: {
          show: false,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleOk () {
      this.$refs.table.refresh()
    }
  }
}
</script>
<style lang="less" scoped>

</style>
