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
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch(3)">全部绑定用户</p>
                    <p @click="tableSearch(1)">待绑定用户</p>
                    <p @click="tableSearch(2)">已绑定用户</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="档案号">
                        <a-input v-model="queryParam.fileCode" />
                      </a-form-item>
                      <a-form-item label="姓名">
                        <a-input v-model="queryParam.name" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model="queryParam.card" />
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

    <s-table ref="table" :scroll="scroll" size="small" rowKey="wxPatientId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="bindStatus" slot-scope="text, record">
        {{ record.bindStatus == 1 ? '未绑定' : record.bindStatus == 2 ? '已绑定' : '忽略'}}
      </span>
      <span slot="operation" slot-scope="text, record">
        <template>
          <a v-if="record.bindStatus == 2">绑定</a>
          <a v-else @click="handleReview(record)">绑定</a>
        </template>
      </span>
    </s-table>
    <user-detail ref="userDetail" @ok="handleOk"></user-detail>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { getWxBingDataList } from '@/api/distract'
  import { STable } from '@/components'
  import UserDetail from './modules/UserDetail'
  export default {
    components: {
      STable,
      UserDetail
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
          return getWxBingDataList(Object.assign(parameter, this.queryParam)).then(res => {
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
            title: '患者姓名',
            dataIndex: 'name',
            width: '120px'
          },
          {
            title: '微信号',
            dataIndex: 'wxCode',
            width: '120px'
          },
          {
            title: '微信昵称',
            dataIndex: 'wxName',
            width: '100px'
          },
          {
            title: '身份证号',
            dataIndex: 'card',
            width: '150px'
          },
          {
            title: '手机号码',
            dataIndex: 'telephone',
            width: '120px'
          },
          {
            title: '注册时间',
            dataIndex: 'registeredDate',
            customRender: registeredDate => moment(registeredDate).format('YYYY-MM-DD'),
            width: '120px'
          },
          {
            title: '绑定状态',
            dataIndex: 'bindStatus',
            scopedSlots: { customRender: 'bindStatus' },
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
    methods: {
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      },
      clearForm() {
        this.queryParam = {}
      },
      tableSearch(type) {
        this.queryParam.queryType = type
        this.$refs.table.refresh()
        this.advanced = false
      },
      refreshTable() {
        this.advanced = false
        this.$refs.table.refresh()
      },
      handleReview(recode) {
        recode.registeredDate = moment(recode.registeredDate).format('YYYY-MM-DD')
        this.$refs.userDetail.show(recode)
      },
      handleOk() {
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