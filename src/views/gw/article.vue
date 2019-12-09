<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.title" placeholder="搜索文章标题" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
            </a-form-item>
          </a-col>
          <a-col :md="13" style="text-align:right" :sm="24">
            <a-button type="primary" @click="handleReview">新增</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table ref="table" :scroll="scroll" size="small" rowKey="textId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <template slot="terminal" slot-scope="text">
        <span v-if="text == 1">微信</span>
        <span v-if="text == 2">官网</span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a @click="handleReview(record)">编辑</a>
      </template>
    </s-table>

    <article-detail ref="articleDetail" @ok="handleOk"></article-detail>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { getWebsiteList } from '@/api/text'
  import { STable } from '@/components'
  import ArticleDetail from './modules/ArticleDetail'
  export default {
    components: {
      STable,
      ArticleDetail
    },
    data() {
      return {
        bodyStyle: {
          padding: '10px',
          paddingBottom: '0px'
        },
        // 查询参数
        queryParam: {},
        scroll: false,
        loadData: parameter => {
          return getWebsiteList(Object.assign(parameter, this.queryParam)).then(res => {
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
            title: '文章标题',
            dataIndex: 'title',
            width: '150px'
          },
          {
            title: '文章发布人',
            dataIndex: 'publisher',
            width: '120px'
          },
          {
            title: '发布终端',
            dataIndex: 'terminal',
            scopedSlots: { customRender: 'terminal' },
            width: '100px'
          },
          {
            title: '发布时间',
            dataIndex: 'publishDate',
            customRender: publishDate => moment(publishDate).format('YYYY-MM-DD'),
            width: '150px'
          },
          {
            title: '阅读量',
            dataIndex: 'num',
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
      refreshTable() {
        this.$refs.table.refresh()
      },
      handleReview(recode) {
        this.$refs.articleDetail.show(recode.textId)
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
</style>