<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索角色名称" />
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
          <a-col :md="13" style="text-align:right" :sm="24">
            <a-button type="primary" @click="$refs.roleDetail.add()">新增</a-button>
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch()">全部角色</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="角色名称">
                        <a-input v-model.trim="queryParam.roleName" />
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

    <s-table ref="table" :scroll="scroll" size="small" rowKey="id" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <template slot="type" slot-scope="text">
        <span v-if="text == 1">角色</span>
        <span v-if="text == 2">数据角色</span>
      </template>
      <template slot="status" slot-scope="text">
        <span v-if="text == 1">使用</span>
        <span v-if="text == -1">停用</span>
      </template>
      <span slot="operation" slot-scope="text, record">
        <template>
          <a @click="handleReview(record)">编辑</a>
        </template>
      </span>
    </s-table>
    <role-detail ref="roleDetail" @ok="handleOk"></role-detail>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { getRoleDataList } from '@/api/center'
  import { STable } from '@/components'
  import RoleDetail from './RoleDetail'
  export default {
    components: {
      STable,
      RoleDetail
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
          return getRoleDataList(Object.assign(parameter, this.queryParam)).then(res => {
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
            title: '角色编码',
            dataIndex: 'code',
            width: '150px'
          },
          {
            title: '角色名称',
            dataIndex: 'name',
            width: '150px'
          },
          {
            title: '类型',
            dataIndex: 'type',
            width: '120px',
            scopedSlots: { customRender: 'type' }
          },
          {
            title: '是否使用',
            dataIndex: 'status',
            width: '120px',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '描述',
            dataIndex: 'description'
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
      handleReview(record) {
        this.$refs.roleDetail.edit(record)
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