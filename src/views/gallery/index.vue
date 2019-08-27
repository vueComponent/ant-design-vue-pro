<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item ><a-input v-model="queryParam.keyword"  placeholder="搜索患者姓名、身份证号" /></a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
               更多筛选
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :md="12" style="text-align:right" :sm="24"><a-button type="primary"  @click="$refs.registerModal.add()">添加采集</a-button><a-button type="primary"  style="margin-left: 20px;">导出</a-button></a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
             <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="$refs.table.search({ type: 1 })">本月新增报告</p>
                    <p @click="$refs.table.search({ type: 2 })">本年新增报告</p>
                    <p @click="$refs.table.search({ type: 3 })">全部报告</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card>
                    <a-form>
                      <a-form-item  label="档案号"><a-input v-model="queryParam.reportCode" style="width: 100%" /></a-form-item>
                      <a-form-item  label="姓名"><a-input v-model="queryParam.patientName" style="width: 100%" /></a-form-item>
                      <a-form-item  label="身份证号"><a-input v-model="queryParam.card" style="width: 100%" /></a-form-item>
                    <a-form-item label="创建日期" style="margin-bottom:0;">
                      <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"><a-date-picker style="width: 100%"  @change="changeTime1"  /></a-form-item>
                      <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">-</span>
                      <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"><a-date-picker style="width: 100%" @change="changeTime2" /></a-form-item>
                    </a-form-item>
                    </a-form>
                  </a-card>
                </a-tab-pane>
              </a-tabs>
            </div>
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
    },
    changeTime1(time) {
      console.log(time);
      this.queryParam.date1 = moment(time).format('YYYY-MM-DD');
    },
    changeTime2(time) {
      console.log(time);
      this.queryParam.date2 = moment(time).format('YYYY-MM-DD');
    }
  }
}
</script>
<style lang="less" scoped>
.tableSearch {
  background: #ffffff;
  position: absolute;
  top: 52px;
  z-index: 100;
  /deep/ .ant-card-body .ant-form-horizontal .ant-form-item > .ant-form-item-label {
    width: 70px !important;
  }
  .commonRetrieval {
    p {
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}
.userName {
  color: #1fb2fa;
  margin: 0;
  &:active,
  &:hover {
    text-decoration: underline;
    text-underline-position: under;
    text-decoration-color: #1fb2fa;
    cursor: pointer;
  }
}
</style>
