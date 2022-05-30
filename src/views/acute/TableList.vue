<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form :form="form" layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索患者姓名、身份证号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px" class="toggleAdvanced">
                {{ advanced ? '更多筛选' : '更多筛选' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :md="13" style="text-align:right" :sm="24">
            <a-button type="primary" @click="$refs.createModal.add()">新建</a-button>
            <!-- <a-button type="primary" style="margin-left: 10px;">导出</a-button> -->
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch(9)">全部急性加重期</p>
                    <p @click="tableSearch(7)">本月新增急性加重期</p>
                    <p @click="tableSearch(8)">本年新增急性加重期</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="是否ICON">
                        <a-radio-group v-model="queryParam.isIcon">
                          <a-radio value="-1">否</a-radio>
                          <a-radio value="1">是</a-radio>
                        </a-radio-group>
                      </a-form-item>
                      <a-form-item label="姓名">
                        <a-input v-model.trim="queryParam.patientName" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model.trim="queryParam.card" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="急性加重日期" style="margin-bottom:0;">
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
    <s-table ref="table" size="small" :scroll="scroll" rowKey="patientBasisId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <template slot="patientName" slot-scope="text, record">
        <a @click="showUser(record)">{{modifyName(text)}}</a>
      </template>
      <span slot="submitStatus" slot-scope="text">
        <a-badge :status="text | visitTypeFilter" :text="text | visitFilter" /></span>
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="8" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record" style="text-align: center;">
        <template>
          <a @click="exec(record)">执行</a>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
    <user-detail ref="detailModal" />
  </a-card>
</template>
<script>
import moment from 'moment';
import { STable, Ellipsis } from '@/components'
import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import { getSFJxDataList } from '@/api/basis'
import UserDetail from './modules/UserDetail'
import $ from 'jquery'

const visitMap = {
  '已提交': {
    status: 'success',
    text: '已提交'
  },
  '未提交': {
    status: 'error',
    text: '未提交'
  }
};
export default {
  name: 'acute',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal,
    UserDetail
  },
  data() {
    return {
      dateArr: [],
      mdl: {},
      bodyStyle: {
        padding: "10px",
        paddingBottom: "0px"
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '患者姓名',
          dataIndex: 'patientName',
          width: 100,
          scopedSlots: { customRender: 'patientName' }
        },{
          title: '是否ICON',
          dataIndex: 'research',
          width: 80,
        },
        {
          title: '提交状态',
          dataIndex: 'submitStatusStr',
          width: 120,
          scopedSlots: {
            customRender: 'submitStatus'
          }
        },
        {
          title: '急性加重日期',
          dataIndex: 'createDate',
          width: 120,
          customRender: createDate => moment(createDate).format('YYYY-MM-DD')
        },
        {
          title: '创建人',
          dataIndex: 'creatorName',
          width: 100
        },
        {
          title: '创建日期',
          dataIndex: 'createDate2',
          width: 120,
          customRender: createDate => moment(createDate).format('YYYY-MM-DD')
        },
        {
          title: '分支中心',
          dataIndex: 'centerName',
          width: 200
        }, {
          title: '操作',
          dataIndex: 'action',
          width: 100,
          className: 'operation',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getSFJxDataList(Object.assign(parameter, this.queryParam)).then(res => {
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: {
          show: false,
          clear: () => {
            this.selectedRowKeys = [];
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      scroll: false,
      optionAlertShow: false,
      form: this.$form.createForm(this),
    };
  },
  created() {
    this.scroll = {
      y: (window.screen.height - 368) + "px"
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
    statusFilter(type) {
      return statusMap[type].text;
    },
    statusTypeFilter(type) {
      return statusMap[type].status;
    },
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
    clearForm() {
      this.queryParam = {}
      this.dateArr = []
    },
    tableSearch(type) {
      this.queryParam.queryType = type
      this.$refs.table.refresh();
      this.advanced = false;
    },
    refreshTable() {
      this.advanced = false;
      this.$refs.table.refresh();
    },
    showUser(record) {
      this.$refs.detailModal.show(record);
    },
    exec(record) {
      console.log(record)
      if(record.type === 7){
        this.$router.push('/icon/jxjzq/' + record.patientBasisId)
      }else{
        this.$router.push('/jxjzq/' + record.patientBasisId)
      }
    },
    handleOk() {
      this.$refs.table.refresh();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    changeTime(time) {
      this.dateArr = time;
      this.queryParam.createDateStart = moment(time[0]).format('YYYY-MM-DD')
      this.queryParam.createDateEnd = moment(time[1]).format('YYYY-MM-DD')
    },
  }
};
</script>
<style lang="less" scoped>
.ant-table td {
  white-space: nowrap;
}

/deep/th.operation {
  text-align: center !important;
}

/deep/.ant-table-tbody>tr>td.operation {
  text-align: center !important;
}

/deep/.table-page-search-wrapper .ant-form-inline .ant-form-item {
  margin-bottom: 10px
}

/deep/.ant-table-row:hover .progressTag .ant-progress-inner {
  background-color: #ffffff !important;
}

.progressTag {
  display: inline-block;
  width: 250px;

  /deep/ .progressTagContent {
    display: inline-block;
    width: 80px;
    margin-right: 5px;
  }

  /deep/ .progressTagTitle {
    font-size: 12px;
    text-align: center;
    color: #000;
    margin-bottom: 0;
    margin-right: 15px;
    display: inline-block;
  }

  /deep/ .progressTag .anticon {
    color: #4bc5ac;
    font-size: 18px;
    vertical-align: bottom;
  }

  /deep/ .ant-progress-inner {
    background-color: #e5f6ff;
  }

  /deep/ .progressTag .ant-progress-span {
    color: rgb(0, 160, 233);
  }
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