<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索分支中心" />
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
              <a-tabs defaultActiveKey="2">
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="分支中心">
                        <a-input v-model.trim="queryParam.keyWord" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="提交时间">
                        <a-range-picker :value="submitArr" @change="changeSubmit" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="创建日期" style="margin-bottom:0;">
                        <a-range-picker @change="changeCreate" style="width: 100%" :value="createArr" />
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
          <a-col :md="13" style="text-align:right" :sm="24">
            <a-button type="primary" @click="_export">导出</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" :scroll="scroll" size="small" rowKey="centerName" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
    </s-table>
  </a-card>
</template>
<script>
import moment from 'moment'
import { getCenterNum } from '@/api/basis'
import { STable } from '@/components'
export default {
  components: {
    STable
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_API_BASE_URL,
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
        return getCenterNum(Object.assign(parameter, this.queryParam)).then(res => {
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
          title: '中心编号',
          dataIndex: 'centerCode',
          width: '100px'
        },{
          title: '分支中心',
          dataIndex: 'centerName',
          width: '120px'
        },
        {
          title: '基线数量',
          dataIndex: 'type1Num',
          width: '120px'
        },
        {
          title: '半年访视数量',
          dataIndex: 'type2Num',
          width: '120px'
        },
        {
          title: '年访视数量',
          dataIndex: 'type3Num',
          width: '120px'
        },
        {
          title: '急性加重期数量',
          dataIndex: 'type4Num',
          width: '120px'
        },
        {
          title: '基线提交数量',
          dataIndex: 'type5Num',
          width: '120px'
        },
        {
          title: '年访视提交数量',
          dataIndex: 'type6Num',
          width: '120px'
        },
        {
          title: '病人联系方式',
          dataIndex: 'type7Num',
          width: '120px'
        },
        {
          title: '合并症',
          dataIndex: 'type8Num',
          width: '120px'
        },
        {
          title: '病因',
          dataIndex: 'type9Num',
          width: '120px'
        },
        {
          title: '影像学评分',
          dataIndex: 'type10Num',
          width: '120px'
        },
        {
          title: '痰检',
          dataIndex: 'type11Num',
          width: '120px'
        },
        {
          title: '病史',
          dataIndex: 'type12Num',
          width: '120px'
        },
        {
          title: '影像学资料',
          dataIndex: 'type13Num',
          width: '120px'
        },
        {
          title: '病原微生物',
          dataIndex: 'type14Num',
          width: '120px'
        },
        {
          title: '肺功能',
          dataIndex: 'type15Num',
          width: '120px'
        }
      ],
      createArr: [],
      submitArr: []
    }
  },
  created() {
    this.scroll = {
      x: true,
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
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    clearForm() {
      this.queryParam = {}
      this.createArr = []
      this.submitArr = []
    },
    tableSearch(type) {
      this.queryParam.isUser = type
      this.$refs.table.refresh()
      this.advanced = false
    },
    refreshTable() {
      this.advanced = false
      this.$refs.table.refresh()
    },
    changeCreate(time) {
      this.createArr = time;
      this.queryParam.createDateStart = moment(time[0]).format('YYYY-MM-DD')
      this.queryParam.createDateEnd = moment(time[1]).format('YYYY-MM-DD')
    },
    changeSubmit(time) {
      this.submitArr = time;
      this.queryParam.submitDateStart = moment(time[0]).format('YYYY-MM-DD')
      this.queryParam.submitDateEnd = moment(time[1]).format('YYYY-MM-DD')
    },
    _export() {
      window.open(this.baseUrl + 'basis/exportCenterNum')
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

.ant-table td {
  white-space: nowrap;
}
</style>