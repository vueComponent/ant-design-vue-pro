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
                    <p @click="tableSearch(3)">全部问卷</p>
                    <p @click="tableSearch(1)">待审阅问卷</p>
                    <p @click="tableSearch(2)">已审阅问卷</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="入组编号">
                        <a-input v-model.trim="queryParam.fileBasisCode" />
                      </a-form-item>
                      <a-form-item label="姓名">
                        <a-input v-model.trim="queryParam.patientName" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model.trim="queryParam.card" />
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
    <s-table ref="table" :scroll="scroll" size="small" rowKey="questionTaskId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <template slot="patientName" slot-scope="text,record">
        <p>{{modifyName(text)}}</p>
      </template>
      <template slot="status" slot-scope="text">
        <a-badge :status="text | visitTypeFilter" :text="text | visitFilter" />
      </template>
      <template slot="operation" slot-scope="text, record">
          <a @click="handleClick(record)">审阅</a>
      </template>
    </s-table>
  </a-card>
</template>
<script>
import moment from 'moment'
import { getWxQuestionList } from '@/api/distract'
import { STable } from '@/components'
import $ from 'jquery'

const visitMap = {
  3: {
    status: 'error',
    text: '驳回'
  },
  4: {
    status: 'success',
    text: '已审阅'
  },
  5: {
    status: 'default',
    text: '未审阅'
  },
};
export default {
  components: {
    STable
  },
  data() {
    return {
      bodyStyle: {
        padding: '10px',
        paddingBottom: '0px'
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      scroll: false,
      loadData: parameter => {
        return getWxQuestionList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
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
      columns: [{
          title: '入组编号',
          dataIndex: 'fileBasisCode',
          width: '150px'
        },
        {
          title: '问卷名称',
          dataIndex: 'questionName',
          width: '120px'
        },
        {
          title: '微信号',
          dataIndex: 'wxCode',
          width: '120px'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '100px',
          scopedSlots: { customRender: 'patientName' }
        },
        {
          title: '填写日期',
          dataIndex: 'realExecuteTime',
          customRender: realExecuteTime => moment(realExecuteTime).format('YYYY-MM-DD'),
          width: '120px'
        },
        {
          title: '推送日期',
          dataIndex: 'createDate',
          width: '120px'
        },
        {
          title: '类型',
          dataIndex: 'visitType',
          width: '120px'
        },
        {
          title: '审阅状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: '100px'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: '100px'
        }
      ],
    }
  },
  created() {
    this.scroll = {
      y: window.screen.height - 368 + 'px'
    }
  },
  mounted() {
    var that = this
    $(document).on('click', function(e) {
      if (e.target.className === 'toggleAdvanced') {
        return
      }
      if ($(e.target).closest(".tableSearch").length == 0 && $(e.target).closest(".ant-calendar").length == 0 && $(e.target).closest('.ant-calendar-year-panel-table').length === 0 && $(e.target).closest('.ant-calendar-month-panel-table').length === 0) {
        that.advanced = false
      }
    })
  },
  filters: {
    visitFilter(type) {
      return visitMap[type].text;
    },
    visitTypeFilter(type) {
      return visitMap[type].status;
    }
  },
  methods: {
    modifyName(name) {
      return name.replace(/(.)(.*)/, (_, $1, $2) => $1 + '*'.repeat($2.length))
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    clearForm() {
      this.queryParam = {}
    },
    tableSearch(type) {
      this.queryParam.queryType = type
      this.$refs.table.refresh();
      this.advanced = false
    },
    handleClick(record) {
      const params = {
        name: record.name,
        card: record.card,
        createDate: record.createDate
      }
      localStorage.setItem('questionInfo', JSON.stringify(params))
      this.$router.push({ path: `/wx/questionDetail/${record.questionTaskId}`})
    },
    refreshTable() {
      this.advanced = false
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
</style>