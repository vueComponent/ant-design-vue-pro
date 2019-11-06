<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.keyWord" placeholder="搜索患者姓名、身份证号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                更多筛选
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :md="13" style="text-align:right" :sm="24">
            <a-button type="primary" @click="$refs.registerModal.add()">添加采集</a-button>
            <!-- <a-button type="primary" style="margin-left: 10px;">导出</a-button> -->
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch(3)">全部报告</p>
                    <p @click="tableSearch(1)">本月新增报告</p>
                    <p @click="tableSearch(2)">本年新增报告</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="档案号">
                        <a-input v-model="queryParam.reportCode" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="姓名">
                        <a-input v-model="queryParam.patientName" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model="queryParam.card" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="创建日期" style="margin-bottom:0;">
                        <a-range-picker @change="changeTime" style="width: 100%" :value="dateArr" />
                      </a-form-item>
                      <a-form-item style="text-align: right;margin-bottom: 0;margin-top: 15px;">
                        <a-button type="primary" @click="clearForm()">清空</a-button>
                        <a-button type="primary" style="margin-left: 10px;" @click="refreshTable">查询</a-button>
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
    <s-table ref="table" :scroll="scroll" size="small" rowKey="reportCode" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="collectStatus" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" /></span>
      <span slot="name" slot-scope="text,record" @click="showUser(record)">
        <p class="userName">{{text}}</p>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">
            执行
          </a>
        </template>
      </span>
    </s-table>
    <user-detail ref="detailModal" />
    <register-form ref="registerModal" @ok="handleOk"></register-form>
  </a-card>
</template>
<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getReportList } from '@/api/report'
import RegisterForm from './modules/RegisterForm'
import UserDetail from '../list/modules/UserDetail'
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
  name: 'Gallery',
  components: {
    STable,
    Ellipsis,
    RegisterForm,
    UserDetail
  },
  data() {
    return {
      dateArr: [],
      bodyStyle: {
        padding: "10px",
        paddingBottom: "0px"
      },
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [{
          title: '报告编号',
          dataIndex: 'reportCode',
          width: '150px',
        },
        {
          title: '档案号',
          dataIndex: 'fileCode',
          width: '180px',
        },
        {
          title: '患者姓名',
          dataIndex: 'patientName',
          scopedSlots: { customRender: 'name' },
          width: '120px',
        },
        {
          title: '身份证号',
          dataIndex: 'patientCard',
          width: '200px',
        },
        {
          title: '创建时间',
          dataIndex: 'collectDate',
          customRender: collectDate => moment(collectDate).format('YYYY-MM-DD'),
          width: '180px',
        },
        {
          title: '采集状态',
          dataIndex: 'collectStatus',
          scopedSlots: { customRender: 'collectStatus' },
          width: '180px',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '100px',
          className: 'operation',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getReportList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      scroll: false,
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
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  created() {
    this.scroll = {
      y: (window.screen.height - 368) + "px"
    }
  },
  methods: {
    clearForm() {
      this.queryParam = {}
      this.dateArr = []
    },
    tableSearch(type) {
      const keyWord = {
        queryType: type
      }
      this.$refs.table.search(keyWord)
      this.advanced = false
    },
    refreshTable() {
      this.advanced = false
      this.$refs.table.refresh()
    },
    showUser(record) {
      this.$refs.detailModal.show(record)
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    handleEdit(record) {
        this.$router.push({
            name: 'Exec51',
            params: {
                id: record.reportCollectBaseId,
                name: record.patientName,
                card: record.patientCard
            }
        })
    //   this.$router.push('/gallery/execute/' + record.reportCollectBaseId)
    },
    changeTime(time) {
      this.dateArr = time;
      this.queryParam.date1 = moment(time[0]).format('YYYY-MM-DD')
      this.queryParam.date2 = moment(time[1]).format('YYYY-MM-DD')
    }
  }
}
</script>
<style lang="less" scoped>
td.operation {
  text-align: center !important;
}

/deep/.table-page-search-wrapper .ant-form-inline .ant-form-item {
  margin-bottom: 10px
}

.tableSearch {
  background: #ffffff;
  position: absolute;
  top: 52px;
  box-shadow: 4px 4px 10px #ddd;
  z-index: 100;

  /deep/ .ant-card-body .ant-form-horizontal .ant-form-item>.ant-form-item-label {
    width: 70px !important;
  }

  .commonRetrieval {
    padding: 10px;

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