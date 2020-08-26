<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索患者姓名、入组编号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
              <!-- <a @click="advanced = !advanced" style="margin-left: 8px" class="toggleAdvanced">
                更多筛选
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a> -->
            </a-form-item>
          </a-col>
          <!-- <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="2">
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="分支中心">
                        <a-input v-model.trim="queryParam.keyWord" style="width: 100%" />
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
          </a-col> -->
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" size="small" rowKey="centerName" :columns="columns" :data="loadData" :alert="options.alert" showPagination="auto">
    </s-table>
  </a-card>
</template>
<script>
import moment from 'moment'
import { patientReport } from '@/api/basis'
import { STable } from '@/components'

const visitMap = {
  1: {
    text: '有铜绿'
  },
  2: {
    text: '无铜绿'
  }
};

export default {
  name: 'scoreList',
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
      loadData: parameter => {
        return patientReport(Object.assign(parameter, this.queryParam)).then(res => {
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
          title: '患者姓名',
          dataIndex: 'patientName',
          width: 100
        },{
          title: '入组编号',
          dataIndex: 'fileCode',
          width: 130
        },{
          title: '是否有铜绿',
          dataIndex: 'itTlStr',
          width: 120
        },{
          title: 'FACED评分',
          dataIndex: 'faced',
          width: 100
        },{
          title: 'BACI评分',
          dataIndex: 'baci',
          width: 100
        },{
          title: 'REFFI评分',
          dataIndex: 'reffi',
          width: 100
        },{
          title: 'BHQ问卷得分',
          dataIndex: 'bhq',
          width: 100
        },{
          title: 'MMRC评分',
          dataIndex: 'mmrc',
          width: 100
        },{
          title: 'HAD评分',
          dataIndex: 'had',
          width: 100
        },{
          title: 'lcq总评分',
          dataIndex: 'lcq',
          width: 100
        },{
          title: 'lcq生理评分',
          dataIndex: 'lcqSl',
          width: 100
        },{
          title: 'lcq心理评分',
          dataIndex: 'lcqXl',
          width: 100
        },{
          title: 'lcq社会评分',
          dataIndex: 'lcqSh',
          width: 100
        },{
          title: 'qolb身体评分',
          dataIndex: 'qolb1',
          width: 100
        },{
          title: 'qolb角色评分',
          dataIndex: 'qolb2',
          width: 100
        },{
          title: 'qolb活力评分',
          dataIndex: 'qolb3',
          width: 100
        },{
          title: 'qolb情绪评分',
          dataIndex: 'qolb4',
          width: 100
        },{
          title: 'qolb社会评分',
          dataIndex: 'qolb5',
          width: 100
        },{
          title: 'qolb医疗评分',
          dataIndex: 'qolb6',
          width: 100
        },{
          title: 'qolb健康评分',
          dataIndex: 'qolb7',
          width: 100
        },{
          title: 'qolb呼吸评分',
          dataIndex: 'qolb8',
          width: 100
        }
      ],
      createArr: [],
      submitArr: []
    }
  },
  filters: {
    visitFilter(type) {
      return visitMap[type].text;
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
/deep/ .ant-table td{
  white-space: nowrap;
}
</style>