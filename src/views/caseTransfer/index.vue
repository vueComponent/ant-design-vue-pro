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
              <a @click="advanced = !advanced" style="margin-left: 8px">
                更多筛选
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :md="13" style="text-align:right" :sm="24">
            <a-button type="primary" @click="$refs.registerModal.show()">新建</a-button>
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch(3)">全部申请</p>
                    <p @click="tableSearch(1)">本月新增申请</p>
                    <p @click="tableSearch(2)">本年新增申请</p>
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
    <s-table
      ref="table"
      :scroll="scroll"
      size="small"
      rowKey="distractId"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
    <template slot="reason" slot-scope="text">
      <a-tooltip placement="topLeft">
        <template slot="title">{{ text }}</template>
        <span class="reason">{{ text }}</span>
      </a-tooltip>
    </template>
      <!-- <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">执行</a>
        </template>
      </span> -->
    </s-table>
    <!-- <user-detail ref="detailModal" /> -->
    <register-form ref="registerModal" @ok="handleOk"></register-form>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { getZyDataList } from '@/api/distract'
import RegisterForm from './modules/RegisterForm'
// import UserDetail from './modules/UserDetail'

export default {
  name: 'Gallery',
  components: {
    STable,
    RegisterForm,
    // UserDetail
  },
  data() {
    return {
      bodyStyle: {
        padding: '10px',
        paddingBottom: '0px'
      },
      dateArr: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '申请单号',
          dataIndex: 'distractCode',
          width: 120
        },
        {
          title: '档案号',
          dataIndex: 'fileCode',
          width: 150
        },
        {
          title: '患者姓名',
          dataIndex: 'patientName',
          width: 120
        },
        {
          title: '身份证号',
          dataIndex: 'card',
          width: 200
        },
        {
          title: '原中心',
          dataIndex: 'centerName',
          width: 200
        },
        {
          title: '申请时间',
          dataIndex: 'createDate',
          customRender: createDate => moment(createDate).format('YYYY-MM-DD'),
          width: 180
        },
        {
          title: '审核状态',
          dataIndex: 'executeName',
          scopedSlots: { customRender: 'executeName' },
          width: 150
        },
        {
          title: '驳回理由',
          dataIndex: 'rejectionReason',
          scopedSlots: { customRender: 'rejectionReason' },
          width: 180
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getZyDataList(Object.assign(parameter, this.queryParam)).then(res => {
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
  created() {
    this.scroll = {
      y: window.screen.height - 368 + 'px'
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
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
      this.advanced = false
      this.$refs.table.refresh()
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    // showUser(record) {
    //   this.$refs.detailModal.show(record)
    // },
    // handleEdit(record) {
    //   this.$router.push('/gallery/detail/' + record.reportCollectBaseId)
    // },
    changeTime(time) {
      this.dateArr = time
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
.reason {
    display: inline-block;
    width: 11em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
