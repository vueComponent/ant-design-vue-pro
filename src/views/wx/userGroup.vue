<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索患者姓名、身份证号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
              <a @click="advanced = !advanced" style="margin-left: 8px" class="toggleAdvanced">
                更多筛选
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch()">全部用户</p>
                    <p @click="tableSearch(1)">待入组用户</p>
                    <p @click="tableSearch(0)">已入组用户</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="姓名">
                        <a-input v-model.trim="queryParam.name" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model.trim="queryParam.card" />
                      </a-form-item>
                      <a-form-item style="text-align: right; margin-bottom: 0; margin-top: 15px">
                        <a-button type="primary" @click="clearForm()">清空</a-button>
                        <a-button type="primary" style="margin-left: 10px" @click="refreshTable">查询</a-button>
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
    <s-table
      ref="table"
      :scroll="scroll"
      size="small"
      rowKey="wxPatientId"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <template slot="patientName" slot-scope="text, record">
        <p>{{ modifyName(text) }}</p>
      </template>
      <template slot="patientCard" slot-scope="text, record">
        <p>{{ modifyCard(text) }}</p>
      </template>
      <span slot="operation" slot-scope="text, record">
        <template>
          <a @click="handleReview(record)">入组</a>
        </template>
      </span>
    </s-table>
    <!-- <user-detail ref="userDetail" @ok="handleOk"></user-detail> -->
    <created-form ref="detailModal" @ok="handleOk"></created-form>
  </a-card>
</template>
<script>
// import moment from 'moment'
import { getZKDataList } from '@/api/distract'
import { STable } from '@/components'
// import UserDetail from './modules/UserDetail'
import CreatedForm from '@/views/list/modules/CreateForm'
import $ from 'jquery'
import CreateForm from '../acute/modules/CreateForm.vue'

export default {
  components: {
    STable,
    CreateForm,
    CreatedForm
  },
  data () {
    return {
      bodyStyle: {
        padding: '10px',
        paddingBottom: '0px'
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        status: 1
      },
      scroll: false,
      dataEchoInfo: {},
      loadData: (parameter) => {
        return getZKDataList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      selectedRows: [],
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
      columns: [
        {
          title: '患者姓名',
          dataIndex: 'name',
          width: '120px',
          scopedSlots: { customRender: 'patientName' }
        },
        {
          title: '身份证号',
          dataIndex: 'card',
          width: '180px',
          scopedSlots: { customRender: 'patientCard' }
        },
        {
          title: '手机号码',
          dataIndex: 'telephone1',
          width: '120px'
        },
        // {
        //   title: '注册时间',
        //   dataIndex: 'registeredDate',
        //   customRender: (registeredDate) => moment(registeredDate).format('YYYY-MM-DD'),
        //   width: '120px'
        // },
        {
          title: '民族',
          dataIndex: 'nationName',
          width: '100px'
        },
        {
          title: '职业',
          dataIndex: 'workName',
          width: '120px'
        },
        {
          title: '文化程度',
          dataIndex: 'censusName',
          width: '120px'
        },
        {
          title: '家庭年收入',
          dataIndex: 'income',
          width: '120px'
        },
        {
          title: '医疗费用支付类型',
          dataIndex: 'payTypeName',
          width: '120px'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: '100px'
        }
      ]
    }
  },
  created () {
    this.scroll = {
      y: window.screen.height - 368 + 'px'
    }
  },
  mounted () {
    var that = this
    $(document).on('click', function (e) {
      if (e.target.className === 'toggleAdvanced') {
        return
      }
      if (
        $(e.target).closest('.tableSearch').length == 0 &&
        $(e.target).closest('.ant-calendar').length == 0 &&
        $(e.target).closest('.ant-calendar-year-panel-table').length === 0 &&
        $(e.target).closest('.ant-calendar-month-panel-table').length === 0
      ) {
        that.advanced = false
      }
    })
  },
  methods: {
    modifyName (name) {
      return name.replace(/(.)(.*)/, (_, $1, $2) => $1 + '*'.repeat($2.length))
    },
    modifyCard (card) {
      return card.replace(/^(.{8})(?:\d+)(.{4})$/, '$1******$2')
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    clearForm () {
      this.queryParam = {}
    },
    tableSearch (type) {
      this.queryParam.status = type
      this.$refs.table.refresh()
      this.advanced = false
    },
    refreshTable () {
      this.advanced = false
      this.$refs.table.refresh()
    },
    async handleReview (recode) {
      this.$refs.detailModal.dataEcho(recode)
    },
    handleOk () {
      this.$refs.table.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.table-page-search-wrapper .ant-form-inline .ant-form-item {
  margin-bottom: 10px;
}

.tableSearch {
  background: #ffffff;
  position: absolute;
  top: 52px;
  box-shadow: 4px 4px 10px #ddd;
  z-index: 100;

  /deep/ .ant-card-body .ant-form-horizontal .ant-form-item > .ant-form-item-label {
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
</style>
