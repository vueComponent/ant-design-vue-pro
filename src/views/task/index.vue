<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索患者姓名、身份证号、入组编号" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
              <a @click="advanced = !advanced" style="margin-left: 8px" class="toggleAdvanced">
                更多筛选
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :md="15" style="text-align:right" :sm="24">
            <a-button type="primary" @click="$refs.createModal.add()">新建</a-button>
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch(1)">未执行任务</p>
                    <p @click="tableSearch(2)">未执行随访</p>
                    <p @click="tableSearch(3)">未执行访视</p>
                    <p @click="tableSearch(4)">已执行随访</p>
                    <p @click="tableSearch(5)">已执行访视</p>
                    <p @click="tableSearch(6)">全部任务</p>
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
                      <a-form-item label="入组编号">
                        <a-input v-model.trim="queryParam.fileCode" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="患者姓名">
                        <a-input v-model.trim="queryParam.patientName" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model.trim="queryParam.card" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="任务名称">
                        <a-select v-model.trim="queryParam.type">
                          <a-select-option value="2">半年随访任务</a-select-option>
                          <a-select-option value="3">年访视任务</a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="到期时间" style="margin-bottom:0;">
                        <a-range-picker @change="changeTime" style="width: 100%" :value="dateArr" />
                      </a-form-item>
                      <a-form-item style="text-align: right;margin-bottom: 0;margin-top: 15px;">
                        <a-button type="primary" @click="clearForm">清空</a-button>
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
    <s-table ref="table" :scroll="scroll" size="small" rowKey="patientBasisId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <template slot="warnStatus" slot-scope="text">
        <img width="25px" v-if="text == 1" src="../../assets/warn-1.png" :alt="text">
        <img width="25px" v-else-if="text == 2" src="../../assets/warn-2.png" :alt="text">
        <img width="25px" v-else-if="text > 2" src="../../assets/warn-3.png" :alt="text">
      </template>
      <template slot="patientName" slot-scope="text,record">
        <a @click="showUser(record)">{{modifyName(text)}}</a>
      </template>
      <span slot="unSubmitquestion" slot-scope="text, record">
        <p>{{ record.unSubmitquestion }}</p>
      </span>
      <span slot="questionStatus" slot-scope="text">
        <a-badge :status="text | visitTypeFilter" :text="text | visitFilter" /></span>
      <span slot="submitStatusStr" slot-scope="text">
        <a-badge :status="text | visitTypeFilter" :text="text | visitFilter" /></span>
      <template slot="operation" slot-scope="text, record">
        <a @click="implement(record)">执行</a>
        <a-divider type="vertical" />
        <a @click="ignore(record)">忽略</a>
      </template>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
    <user-detail ref="detailModal" />
    <a-modal :visible="visible" title="退组" @ok="outSubmit" :confirmLoading="confirmLoading" :centered="centered" :destroyOnClose="destroyOnClose" @cancel="handleClose">
      <a-form :form="form">
        <input type="hidden" v-model="outPatientBasisId">
        <a-form-item label="退组原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', requiredRule]">
            <a-radio value="1">访视结束</a-radio>
            <a-radio value="2">失访</a-radio>
            <a-radio value="3">死亡</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import moment from 'moment'
import { getVisitTask, ignoreBNTask } from '@/api/task'
import { STable } from '@/components'
import CreateForm from './components/taskCreateForm'
import UserDetail from '../list/modules/UserDetail'
import $ from 'jquery'
const visitMap = {
  '已提交': {
    status: 'success',
    text: '已提交'
  },
  '未提交': {
    status: 'error',
    text: '未提交'
  },
  '忽略': {
    status: 'default',
    text: '忽略'
  }
};

export default {
  name: 'Task',
  components: {
    STable,
    CreateForm,
    UserDetail
  },
  data() {
    return {
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
      confirmLoading: false,
      centered: true,
      destroyOnClose: true,
      outPatientBasisId: undefined,
      form: this.$form.createForm(this),
      bodyStyle: {
        padding: "10px",
        paddingBottom: "0px"
      },
      // 查询参数
      queryParam: {},
      advanced: false,
      // 表头
      columns: [{
          title: '预警',
          dataIndex: 'warnStatus',
          scopedSlots: { customRender: 'warnStatus' },
          width: 70
        },{
          title: '是否ICON',
          dataIndex: 'research',
          width: 80,
        },
        {
          title: '提交状态',
          dataIndex: 'submitStatusStr',
          width: 80,
          scopedSlots: {
            customRender: 'submitStatusStr'
          }
        },
        {
          title: '入组编号',
          dataIndex: 'fileCode',
          width: 100
        },
        {
          title: '任务状态',
          dataIndex: 'executeStatusName',
          width: 80
        },
        {
          title: '任务名称',
          dataIndex: 'typeName',
          customRender: typeName => typeName + '任务',
          width: 120
        },
        {
          title: '患者姓名',
          dataIndex: 'patientName',
          scopedSlots: { customRender: 'patientName' },
          align: 'center',
          width: 100
        },
        {
          title: '联系电话',
          dataIndex: 'telephone',
          width: 120,
        },
        {
          title: '创建日期',
          dataIndex: 'createDate',
          customRender: createDate => moment(createDate).format('YYYY-MM-DD'),
          width: 120
        },
        {
          title: '到期日期',
          dataIndex: 'planDate',
          customRender: planDate => moment(planDate).format('YYYY-MM-DD'),
          width: 120,
        },
        {
          title: '分支中心',
          dataIndex: 'centerName',
          width: 200
        }, {
          title: '问卷状态',
          width: 80,
          dataIndex: 'questionStatus',
          scopedSlots: {
            customRender: 'questionStatus'
          }
        }, {
          title: '未提交问卷',
          width: 200,
          dataIndex: ' unSubmitquestion',
          scopedSlots: {
            customRender: 'unSubmitquestion'
          }
        },
        {
          title: '操作',
          width: 100,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (!parameter.queryType) {
          parameter.queryType = 1
        }
        return getVisitTask(Object.assign(parameter, this.queryParam)).then(res => {
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      scroll: false,
      dateArr: [],
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
      }
    };
  },
  created() {
    this.scroll = {
      y: (window.screen.height - 368) + "px"
    }
  },
  filters: {
    visitFilter(type) {
      if (typeof type === 'undefined') {
        type = '忽略'
      }
      return visitMap[type].text;
    },
    visitTypeFilter(type) {
      if (typeof type === 'undefined') {
        type = '忽略'
      }
      return visitMap[type].status;
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
    modifyName(name) {
      return name.replace(/(.)(.*)/, (_, $1, $2) => $1 + '*'.repeat($2.length))
    },
    handleClose() {
      this.visible = false
    },
    handleOk() {
      this.$refs.table.refresh();
    },
    clearForm() {
      this.queryParam = {}
      this.dateArr = []
    },
    refreshTable() {
      this.advanced = false;
      this.$refs.table.refresh();
    },
    changeTime(time) {
      this.dateArr = time;
      this.queryParam.planDateStart = moment(time[0]).format('YYYY-MM-DD');
      this.queryParam.planDateEnd = moment(time[1]).format('YYYY-MM-DD');
    },
    tableSearch(type) {
      this.queryParam.queryType = type
      this.$refs.table.refresh();
      this.advanced = false;
    },
    showUser(record) {
      this.$refs.detailModal.show(record);
    },
    implement(record) {
      //执行
      if (record.type === 6) {
        this.$router.push('/icon/task/' + record.patientBasisId)
      } else {
        this.$router.push('/list/task/' + record.patientBasisId)
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    ignore(record) {
      var that = this
      // if (record.executeStatus == 0) {
      //   this.$message.warning('只能忽略未执行的任务！');
      //   return false;
      // }
      if (record.submitStatus == 2) {
        this.$message.warning('只能忽略未忽略的任务！');
        return false;
      }
      if (record.type != 2) {
        this.visible = true;
        this.outPatientBasisId = record.patientBasisId
        return false;
      }
      this.$confirm({
        title: '是否忽略?',
        onOk() {
          const params = new URLSearchParams()
          params.append('patientBasisId', record.patientBasisId)
          ignoreBNTask(params)
            .then(res => {
              that.$message.success(res.msg)
              that.$refs.table.refresh()
            });
        }
      });
    },
    outSubmit() {
      var that = this
      this.form.validateFieldsAndScroll((errors, fieldsValue) => {
        if (errors) {
          that.confirmLoading = false
          return
        }
        const params = new URLSearchParams()
        params.append('patientBasisId', that.outPatientBasisId)
        params.append('status', fieldsValue.status)
        ignoreBNTask(params).then(res => {
          that.visible = false
          that.confirmLoading = false
          that.$message.success(res.msg)
          that.$refs.table.refresh()
        });
      });
    }
  }
};
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
    width: 100px !important;
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