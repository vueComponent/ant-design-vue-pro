<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="18">
            <a-form-item>
              <a-input v-model="queryParam.keyword" placeholder="搜索患者姓名、身份证号" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="6">
            <a-form-item>
              <a-button type="primary" @click="$refs.table.refresh()">查询</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table ref="table" :scroll="scroll" size="small" rowKey="distractId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="operation" slot-scope="text, record">
        <template>
          <a @click="handleReview(record)">审核</a>
        </template>
      </span>
    </s-table>
    <review-form ref="reviewModal" @ok="handleOk"></review-form>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { getSqDataList } from '@/api/distract'
  import { STable } from '@/components'
  import ReviewForm from './modules/ReviewForm'
  export default {
    components: {
      STable,
      ReviewForm
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
          return getSqDataList(Object.assign(parameter, this.queryParam)).then(res => {
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
            title: '申请单号',
            dataIndex: 'distractCode',
            width: '120px'
          },
          {
            title: '档案号',
            dataIndex: 'fileCode',
            width: '180px'
          },
          {
            title: '患者姓名',
            dataIndex: 'patientName',
            width: '120px'
          },
          {
            title: '身份证号',
            dataIndex: 'card',
            width: '200px'
          },
          {
            title: '申请中心',
            dataIndex: 'centerName',
            width: '150px'
          },
          {
            title: '申请时间',
            dataIndex: 'createDate',
            customRender: createDate => moment(createDate).format('YYYY-MM-DD'),
            width: '150px'
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
      handleReview(recode) {
        const data = {
          targetCenterId: recode.targetCenterId,
          distractId: recode.distractId,
          distractCode: recode.distractCode,
          fileCode: recode.fileCode,
          patientName: recode.patientName,
          card: recode.card,
          centerName: recode.centerName,
          createDate: moment(recode.createDate, 'x'),
          reason: recode.reason,
        }
        this.$refs.reviewModal.show(data)
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