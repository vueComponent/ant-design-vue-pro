<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
        <a-form layout="inline">
            <a-row :gutter="16">
                 <a-col :md="13" style="text-align: right;width: 100%;padding: 0 8px;margin-bottom: 10px;" :sm="24">
                    <a-button type="primary" @click="_export">导出</a-button>
                </a-col>
            </a-row>
        </a-form>
    </div>
    <s-table ref="table" :scroll="scroll"  size="small" rowKey="centerName" :columns="columns" :data="loadData"  showPagination="auto">
    </s-table>
  </a-card>
</template>
<script>
import moment from 'moment'
import { getIconJxNumList } from '@/api/report'
import { STable } from '@/components'
export default {
  components: {
    STable
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      bodyStyle: {
        padding: '10px',
        paddingBottom: '0px'
      },
      scroll: false,
      loadData: parameter => {
        return getIconJxNumList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      columns: [{
          title: '中心名称',
          dataIndex: 'name',
          width: '120px'
        },{
          title: '提交数量',
          dataIndex: 'submitNum',
          width: '90px'
        },{
          title: '未提交数量',
          dataIndex: 'unSubmitNum',
          width: '90px'
        },{
          title: '总数',
          dataIndex: 'totleNum',
          width: '90px'
        }]
        
    }
  },
  created() {
    // this.scroll = {
    //   x: '18000px',
    //   y: window.screen.height - 420 + 'px'
    // }
   
  },
  mounted() {
    
   
  },
  methods: {
    // 导出
      _export() {
      window.open(this.baseUrl + 'patientReport/exportIconJxNum')
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

  /deep/ .ant-card-body .ant-form-horizontal .ant-form-item>.ant-form-item-label {
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

.ant-table td {
  white-space: nowrap;
}
.ant-table-fixed-header .ant-table-scroll .ant-table-header {
    min-width: 0px !important;
}
</style>