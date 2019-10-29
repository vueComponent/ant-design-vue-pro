<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.title" placeholder="搜索文章标题" />
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

    <s-table ref="table" :scroll="scroll" size="small" :rowKey="id" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="operation" slot-scope="text, record">
        <template>
          <a @click="handleReview(record)">编辑</a>
        </template>
      </span>
    </s-table>

    <article-detail ref="articleDetail" @ok="handleOk"></article-detail>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { getWxArticleList } from '@/api/text'
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
          return getWxArticleList(Object.assign(parameter, this.queryParam)).then(res => {
            return res
          })
        },
        selectedRowKeys: [],
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
      refreshTable() {
        this.$refs.table.refresh()
      },
      handleReview(recode) {
        const params = {
          textId: recode.textId,
          terminal: recode.terminal
        }
        this.$refs.articleDetail.show(params)
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