<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.keyword" placeholder="搜索医生姓名" />
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
            <a-button type="primary" @click="handleReview">新增</a-button>
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch(1)">已启用医生</p>
                    <p @click="tableSearch(0)">未启用医生</p>
                    <p @click="tableSearch()">全部医生</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="医生姓名">
                        <a-input v-model="queryParam.doctorName" />
                      </a-form-item>
                      <a-form-item label="所属中心">
                        <a-input v-model="queryParam.centerName" />
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

    <s-table ref="table" :scroll="scroll" size="small" rowKey="doctorDetailId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="operation" slot-scope="text, record">
        <template>
          <a @click="handleReview(record)">编辑</a>
        </template>
      </span>
    </s-table>
    <doctor-detail ref="doctorDetail" @ok="handleOk"></doctor-detail>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { getFamousDoctorList } from '@/api/famousDoctor'
  import { STable } from '@/components'
  import DoctorDetail from './modules/DoctorDetail'
  export default {
    components: {
      STable,
      DoctorDetail
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
          return getFamousDoctorList(Object.assign(parameter, this.queryParam)).then(res => {
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
            title: '医生姓名',
            dataIndex: 'doctorName',
            width: '120px'
          },
          {
            title: '职称',
            dataIndex: 'job',
            width: '120px'
          },
          {
            title: '所属中心',
            dataIndex: 'centerName',
            width: '120px'
          },
          {
            title: '是否启用',
            dataIndex: 'useName',
            width: '100px'
          },
          {
            title: '创建人',
            dataIndex: 'creatorName',
            width: '150px'
          },
          {
            title: '创建时间',
            dataIndex: 'createDate',
            customRender: createDate => moment(createDate).format('YYYY-MM-DD'),
            width: '120px'
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
        if (type == 0 || type == 1) {
          const keyWord = {
            isUser: type
          }
          this.$refs.table.search(keyWord)
        } else {
          this.$refs.table.refresh()
        }
        this.advanced = false
      },
      refreshTable() {
        this.advanced = false
        this.$refs.table.refresh()
      },
      handleReview(recode) {
        this.$refs.doctorDetail.show(recode.doctorDetailId)
      },
      handleOk() {
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