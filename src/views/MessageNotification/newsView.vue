<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索姓名" />
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
                    <p @click="tableSearch()">全部消息</p>
                    <p @click="tableSearch(1)">已发布消息</p>
                    <p @click="tableSearch(0)">未发布消息</p>
                  </div>
                </a-tab-pane>
                <!-- <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="姓名">
                        <a-input v-model.trim="queryParam.name" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model.trim="queryParam.card" />
                      </a-form-item>
                      <a-form-item style="text-align: right; margin-bottom: 0; margin-top: 15px">
                        <a-button type="primary" @click="clearForm()">清空</a-button>
                        <a-button type="primary" style="margin-left: 10px" @click="refreshTable">查询</a-button>
                      </a-form-item>
                    </a-form>
                  </a-card>
                </a-tab-pane> -->
              </a-tabs>
            </div>
          </a-col>
          <a-col :md="12" style="text-align:right" :sm="24">
            <a-button type="primary" @click="$refs.createModal.add()">新建</a-button>
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
        <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
          {{ record.content }}
        </div>
      </template>
      <span slot="operation" slot-scope="text, record">
        <template>
          <a v-if="record.status == 0? true : (record.status == 2? true : false)" @click="addorEditMessage(record)">编辑</a>&nbsp;&nbsp;
          <a v-if="record.status == 1? false : true" @click="handleReview(record)">发布</a>&nbsp;&nbsp;
          <a v-if="record.status == 1" @click="withdraw(record)">撤回</a>&nbsp;&nbsp;
          <a>详情</a>&nbsp;&nbsp;
          <a v-if="record.status == 0? true : (record.status == 2? true : false)" @click="del(record)">删除</a>
        </template>
      </span>
    </s-table>
    <created-form ref="createModal" @ok="handleOk"></created-form>
  </a-card>
</template>
<script>
import moment from 'moment'
import { STable } from '@/components'
import { getMessageList, withdrawData, publishData, deleteData } from '@/api/message'
import CreatedForm from './component/createdForm.vue'
import $ from 'jquery'
export default {
  components: {
    STable,
    CreatedForm
  },
  data () {
    return {
      bodyStyle: {
        padding: '10px',
        paddingBottom: '0px'
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        status: 0
      },
      scroll: false,
      dataEchoInfo: {},
      loadData: (parameter) => {
        return getMessageList(Object.assign(parameter, this.queryParam.status)).then((res) => {
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
          title: '发布时间',
          dataIndex: 'updatedDate',
          width: '100px',
          customRender: (updatedDate) => moment(updatedDate).format('YYYY-MM-DD')
        },
        {
          title: '发布人',
          dataIndex: 'creatorName',
          width: '80px'
        },
        {
          title: '消息内容',
          dataIndex: 'content',
          width: '200px',
          render: text => <div dataIndex={text}>{text}</div>
          //   ellipsis: true
        //   scopedSlots: { customRender: 'overFlow' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: '120px'
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
        $(e.target).closest('.tableSearch').length == 0 &&
        $(e.target).closest('.ant-calendar').length == 0 &&
        $(e.target).closest('.ant-calendar-year-panel-table').length === 0 &&
        $(e.target).closest('.ant-calendar-month-panel-table').length === 0
      ) {
        that.advanced = false
      }
    })
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    // clearForm() {
    //   this.queryParam = {}
    // },
    tableSearch (type) {
      this.queryParam = type
      this.$refs.table.refresh()
      this.advanced = false
    },
    refreshTable () {
      this.advanced = false
      this.$refs.table.refresh()
    },
    // 编辑
    addorEditMessage (record) {
      this.$refs.createModal.edit(record)
    },
    // 发布
    async handleReview (recode) {
      let that = this
      this.$confirm({
        title: '是否要发布这条消息?',
        onOk () {
          publishData(recode.announcementId).then(res => {
            if (res.code == 0) {
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
      let that = this
      this.$confirm({
        title: '是否要撤回这条消息?',
        onOk () {
          withdrawData(record.announcementId).then(res => {
            if (res && res.code == 0) {
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
      let that = this
      this.$confirm({
        title: '是否要删除这条消息?',
        onOk () {
          deleteData(record.announcementId).then(res => {
            if (res.code == 0) {
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
// /deep/td {
//   white-space:nowrap;
// //   whitewhite-space:nowrap;  //强制在一行显示
//   overflow:hidden;    //溢出的内容切割隐藏
//   text-overflow:ellipsis; //当内联溢出块容器时，将溢出部分替换为…
// }
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
