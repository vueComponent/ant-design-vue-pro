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
            <a-button type="primary" @click="$refs.createModal.add()" v-if="!isGroup">新建</a-button>
            <a-button type="primary" style="margin-left: 10px;" @click="exportData">导出</a-button>
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch(3)">全部病例</p>
                    <p @click="tableSearch(1)">本月新增病例</p>
                    <p @click="tableSearch(2)">本年新增病例</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="入组编号">
                        <a-input v-model.trim="queryParam.fileCode" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="姓名">
                        <a-input v-model.trim="queryParam.patientName" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model.trim="queryParam.card" style="width: 100%" />
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
    <s-table ref="table" size="small" :scroll="{ x: 1000 }" rowKey="patientId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="name" slot-scope="text, record" @click="showUser(record)">
        <p class="userName">{{ text }}</p>
      </span>
      <span slot="visit" slot-scope="text">
        <a-badge :status="text | visitTypeFilter" :text="text | visitFilter" /></span>
      <span slot="basisList" slot-scope="basisList" v-if="basisList.length">
        <div class="progressTag">
          <router-link :to="{path:'/list/basis/' + basisList[0].patientBasisId}">
            <p class="progressTagTitle">{{ basisList[0].typeName }}</p>
            <div style="margin-right: 15px;display: inline-block;width: 130px;">
              <div class="progressTagContent">
                <a-progress class="progressline" :strokeColor="basisList[0].progress == 100 ? '#4BC5AC' : '#00A0E9'" :showInfo="false" :percent="parseInt(basisList[0].progress)" size="small" />
              </div>
              <a-icon v-if="basisList[0].executeStatus != 3" type="clock-circle" theme="filled" style="color:#00A0E9" />
              <!-- <span class="ant-progress-span" v-if="basisList[0].executeStatus == 2">{{basisList[0].progress}}%</span> -->
              <a-icon v-else-if="basisList[0].executeStatus == 3" type="check-circle" theme="filled" style="color:#4BC5AC" />
            </div>
          </router-link>
          <Visit :patientId="basisList[0].patientId"></Visit>
        </div>
      </span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="8" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record" style="text-align: center;">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleSubmit(record)">提交</a>
          <a-divider type="vertical" />
          <a @click="handleOut(record)">出组</a>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
    <user-detail ref="detailModal" />
    <a-modal :visible="visible" title="出组" @ok="outSubmit" :confirmLoading="confirmLoading">
      <a-form :form="form">
        <input type="hidden" v-model="patientId">
        <a-form-item label="出组原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', requiredRule]">
            <a-radio value="0">死亡</a-radio>
            <a-radio value="2">出组</a-radio>
            <a-radio value="3">失访</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import moment from 'moment';
import {
  STable,
  Ellipsis
} from '@/components'
import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import {
  getPatientList,
  exportPatient
} from '@/api/patient'
import UserDetail from './modules/UserDetail'
import Visit from './modules/Visit'
import {
  addVasit,
  outGroup
} from '@/api/basis'
import {
  mapGetters,
  mapActions
} from 'vuex'
import $ from 'jquery'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

const visitMap = {
  0: {
    status: 'default',
    text: '死亡'
  },
  1: {
    status: 'processing',
    text: '跟踪'
  },
  2: {
    status: 'success',
    text: '完成'
  },
  3: {
    status: 'error',
    text: '失访'
  },
  4: {
    status: "warning",
    text: "警告"
  }
};

var columns = [{
  title: '入组编号',
  width: 110,
  dataIndex: 'fileCode'
}, {
  title: '患者姓名',
  dataIndex: 'name',
  width: 80,
  scopedSlots: {
    customRender: 'name'
  }
}, {
  title: '身份证号',
  width: 160,
  dataIndex: 'card'
}, {
  title: '创建日期',
  dataIndex: 'createDate',
  width: 90,
  customRender: createDate => moment(createDate).format('YYYY-MM-DD')
}, {
  title: '访视状态',
  dataIndex: 'visit',
  width: 80,
  scopedSlots: {
    customRender: 'visit'
  }
}, {
  title: '访视进度',
  dataIndex: 'basisList',
  width: 160,
  scopedSlots: {
    customRender: 'basisList'
  }
}, {
  title: '分支中心',
  width: 200,
  dataIndex: 'centerName'
},{
  title: '操作',
  dataIndex: 'action',
  width: 120,
  className: 'operation',
  scopedSlots: {
    customRender: 'action'
  }
}]

var groupColumns = [{
  title: '入组编号',
  width: 110,
  dataIndex: 'fileCode'
}, {
  title: '创建日期',
  dataIndex: 'createDate',
  width: 90,
  customRender: createDate => moment(createDate).format('YYYY-MM-DD')
}, {
  title: '访视状态',
  dataIndex: 'visit',
  width: 80,
  scopedSlots: {
    customRender: 'visit'
  }
}, {
  title: '访视进度',
  dataIndex: 'basisList',
  width: 160,
  scopedSlots: {
    customRender: 'basisList'
  }
}, {
  title: '分支中心',
  dataIndex: 'centerName',
  width: 200
}]

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal,
    UserDetail,
    Visit
  },
  data() {
    return {
      dateArr: [],
      mdl: {},
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      bodyStyle: {
        padding: "10px",
        paddingBottom: "0px"
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: this.$ls.get(ACCESS_TOKEN).roleId === 1 ? groupColumns : columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPatientList(Object.assign(parameter, this.queryParam)).then(res => {
          res.data.forEach(item => {
            if (item.basisList.length > 0) {
              item.basisList[0].progress = item.basisList[0].executeStatus == 3 ? 100 : item.basisList[0].progress
            }
          })
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
      isGroup: this.$ls.get(ACCESS_TOKEN).roleId === 1 || false,
      visible: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      requiredRule: { rules: [{ required: true, message: '该选项必填！' }] },
      patientId: null,
      confirmLoading: false
    }
  },
  created() {
    this.setSidebar(true)
    this.scroll = {
      y: (window.screen.height - 368) + "px"
    }
  },
  computed: {
    ...mapGetters(['token'])
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
    ...mapActions(['setSidebar']),
    clearForm() {
      console.log(this.dateArr)
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
    handleEdit(record) {
      this.$router.push('/list/basis/' + record.basisList[0].patientBasisId)
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
    exportData() {
      window.open(this.baseUrl + '/patient/export?doctorId=' + this.token.doctorId)
    },
    handleSubmit(record) {

    },
    handleOut(record) {
      this.visible = true
      this.patientId = record.patientId
    },
    outSubmit() {
      var that = this
      this.form.validateFieldsAndScroll((errors, fieldsValue) => {
        if (errors) {
          that.confirmLoading = false
          return
        }
        const params = new URLSearchParams()
        params.append('patientId', that.patientId)
        params.append('status', fieldsValue.status)
        outGroup(params).then(res => {
          that.visible = false
          that.confirmLoading = false
          that.$message.success(res.msg)
          that.$refs.table.refresh();
        });
      });
    }
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