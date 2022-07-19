<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索标题" />
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
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch2(1)">待阅读消息</p>
                    <p @click="tableSearch2(2)">已阅读消息</p>
                    <p @click="tableSearch1(0)">待发布消息</p>
                    <p @click="tableSearch1(1)">已发布消息</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="标题">
                        <a-input v-model.trim="queryParam.title" />
                      </a-form-item>
                      <a-form-item label="发布人">
                        <a-input v-model.trim="queryParam.publisher" />
                      </a-form-item>
                      <a-form-item label="发布时间" style="margin-bottom:0;">
                        <a-range-picker @change="changeTime" style="width: 100%" :value="dateArr" />
                      </a-form-item>
                      <a-form-item style="text-align: right; margin-bottom: 0; margin-top: 15px">
                        <a-button type="primary" @click="clearForm()">清空</a-button>
                        <a-button type="primary" style="margin-left: 10px" @click="refreshTable">查询</a-button>
                      </a-form-item>
                    </a-form>
                  </a-card>
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-col>
          <a-col :md="11" style="text-align:right" :sm="24">
            <a-button type="primary" @click="$refs.createModal.add()">新建</a-button>
          </a-col>
          <a-col :md="1" style="text-align:right" :sm="24">
            <a-button type="primary" @click="$refs.table.refresh()">刷新</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      class="table-fix"
      ref="table"
      :scroll="scroll"
      size="small"
      rowKey="wxPatientId"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <template slot="overFlow" slot-scope="text, record">
        <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;max-width: 600px">
          {{ record.content }}
        </div>
      </template>
      <span slot="status" slot-scope="text">{{ text | statusFilter}}</span>
      <span slot="operation" slot-scope="text, record">
        <template v-if="record.isCreator == 1">
          <a style="margin-right: 5px" v-if="record.status == 0? true : (record.status == 2? true : false)" @click="addorEditMessage(record)">编辑</a>
          <a style="margin-right: 5px" v-if="record.status == 1? false : true" @click="handleReview(record)">发布</a>
          <a style="margin-right: 5px" v-if="record.isCreator == 1? (record.status == 1? true : false) : false" @click="withdraw(record)">撤回</a>
          <a style="margin-right: 5px" @click="newsDetailView(record)">详情</a>
          <a style="margin-right: 5px" v-if="record.status == 0? true : (record.status == 2? true : false)" @click="del(record)">删除</a>
        </template>
        <template v-if="record.isCreator == 0">
          <a style="margin-right: 5px" @click="newsDetailView(record)">详情</a>
        </template>
      </span>
    </s-table>
    <created-form ref="createModal" @ok="handleOk"></created-form>
    <news-detail ref="newsDetail" @ok="handleOk"></news-detail>
  </a-card>
</template>
<script>
import moment from 'moment'
import { STable } from '@/components'
import { getMessageList, withdrawData, publishData, deleteData } from '@/api/message'
import CreatedForm from './component/createdForm.vue'
import NewsDetail from './component/newsDetail.vue'
import $ from 'jquery'
export default {
  name: 'base',
  components: {
    STable,
    CreatedForm,
    NewsDetail
  },
  data () {
    return {
      dateArr: [],
      bodyStyle: {
        padding: '10px',
        paddingBottom: '0px'
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        type: 1
      },
      scroll: false,
      dataEchoInfo: {},
      loadData: (parameter) => {
        return getMessageList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      form: this.$form.createForm(this),
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
          title: '发布标题',
          dataIndex: 'title',
          width: '120px'
        },
        {
          title: '发布时间',
          dataIndex: 'updatedDate',
          width: '80px',
          customRender: (updatedDate) => (updatedDate) ? moment(updatedDate).format('YYYY-MM-DD') : ''
        },
        {
          title: '发布人',
          dataIndex: 'publisher',
          width: '100px'
        },
        {
          title: '消息来源',
          dataIndex: 'typeName',
          width: '100px'
        },
        {
          title: '阅读状态',
          dataIndex: 'readStatusName',
          width: '100px'
        },
        {
          title: '消息内容',
          dataIndex: 'content',
          width: '600px',
          // render: text => <div dataIndex={text}>{text}</div>
          //   ellipsis: true
          scopedSlots: { customRender: 'overFlow' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: '160px'
        }
      ]
    }
  },
  created () {
    this.scroll = {
      y: window.screen.height - 368 + 'px'
    }
  },
  mounted () {
    var that = this
    $(document).on('click', function (e) {
      if (e.target.className === 'toggleAdvanced') {
        return
      }
      if (
        $(e.target).closest('.tableSearch').length === 0 &&
        $(e.target).closest('.ant-calendar').length === 0 &&
        $(e.target).closest('.ant-calendar-year-panel-table').length === 0 &&
        $(e.target).closest('.ant-calendar-month-panel-table').length === 0
      ) {
        that.advanced = false
      }
    })
  },
  filters: {
    statusFilter (status) {
      if (status === 0) {
        return '未阅'
      } else {
        return '已阅'
      }
    }
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    clearForm () {
      this.queryParam = {
        type: 1
      }
      this.dateArr = []
    },
    tableSearch (type) {
      this.queryParam.queryType = type
      this.$refs.table.refresh()
      this.advanced = false
    },
    tableSearch1 (status) {
      this.queryParam.status = status
      delete this.queryParam.readStatus
      this.$refs.table.refresh()
      this.advanced = false
    },
    tableSearch2 (readStatus) {
      this.queryParam.readStatus = readStatus
      delete this.queryParam.status
      this.$refs.table.refresh()
      this.advanced = false
    },
    refreshTable () {
      this.advanced = false
      this.$refs.table.refresh()
    },
    changeTime (time) {
      this.dateArr = time
      this.queryParam.publishTimeStart = moment(time[0]).format('YYYY-MM-DD 00:00:00')
      this.queryParam.publishTimeEnd = moment(time[1]).format('YYYY-MM-DD 23:59:59')
    },
    // 编辑
    addorEditMessage (record) {
      this.$refs.createModal.edit(record)
    },
    newsDetailView (record) {
      this.$refs.newsDetail.show(record)
    },
    // 发布
    async handleReview (recode) {
      const that = this
      this.$confirm({
        title: '是否要发布这条消息?',
        onOk () {
          publishData(recode.announcementId).then(res => {
            if (res.code === 0) {
              that.$message.success('发布成功')
              that.$refs.table.refresh()
            } else {
              that.$message.error(res.msg)
            }
          })
        },
        onCancel () {}
      })
    },
    // 撤回
    withdraw (record) {
      const that = this
      this.$confirm({
        title: '是否要撤回这条消息?',
        onOk () {
          withdrawData(record.announcementId).then(res => {
            if (res && res.code === 0) {
              that.$message.success('撤回成功')
              that.$refs.table.refresh()
            } else {
              that.$message.error(res && res.msg)
            }
          })
        },
        onCancel () {}
      })
    },
    // 删除
    del (record) {
      const that = this
      this.$confirm({
        title: '是否要删除这条消息?',
        onOk () {
          deleteData(record.announcementId).then(res => {
            if (res.code === 0) {
              that.$message.success('删除成功')
              that.$refs.table.refresh()
            } else {
              that.$message.error(res && res.msg)
            }
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.table-page-search-wrapper .ant-form-inline .ant-form-item {
  margin-bottom: 10px;
}
.table-fix {
  table-layout:fixed;
}
.ant-table-tbody > tr > td {
    max-height: 40px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    cursor: pointer;
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
