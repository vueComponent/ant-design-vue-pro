<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索姓名、身份证号" />
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
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch(0)">待注销活动券</p>
                    <p @click="tableSearch()">全部活动券</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="档案号">
                        <a-input v-model.trim="queryParam.fileCode" />
                      </a-form-item>
                      <a-form-item label="姓名">
                        <a-input v-model.trim="queryParam.name" />
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

    <s-table ref="table" :scroll="scroll" size="small" rowKey="ticketId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="operation" slot-scope="text, record">
        <template>
          <span v-if="record.executeStatus == 1">注销</span>
          <a v-else @click="handleLogout(record)">注销</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { getTicketDataList, logoutTicket } from '@/api/ticket'
  import { STable } from '@/components'
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
          return getTicketDataList(Object.assign(parameter, this.queryParam)).then(res => {
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
        columns: [
          {
            title: '档案号',
            dataIndex: 'fileCode',
            width: '120px'
          },
          {
            title: '微信号',
            dataIndex: 'wxCode',
            width: '120px'
          },
          {
            title: '姓名',
            dataIndex: 'patientNanme',
            width: '100px'
          },
          {
            title: '身份证号',
            dataIndex: 'card',
            width: '150px'
          },
          {
            title: '活动券编号',
            dataIndex: 'code',
            width: '150px'
          },
          {
            title: '发放时间',
            dataIndex: 'grantDate',
            customRender: grantDate => moment(grantDate).format('YYYY-MM-DD'),
            width: '120px'
          },
          {
            title: '注销状态',
            dataIndex: 'executeName',
            scopedSlots: { customRender: 'executeName' },
            width: '100px'
          },
          {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            width: '150px'
          }
        ],
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
      },
      tableSearch(type) {
        this.queryParam.executeStatus = type
        this.$refs.table.refresh()
        this.advanced = false
      },
      handleLogout(record) {
        let that = this
        this.$confirm({
          title: '确定要注销该活动券吗？',
          onOk() {
            const params = new FormData();
            params.append('ticketId', record.ticketId)
            logoutTicket(params).then(res => {
              that.$refs.table.refresh()
            })
          },
          onCancel() { },
        });
      },
      refreshTable() {
        this.advanced = false
        this.$refs.table.refresh()
      }
    },
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