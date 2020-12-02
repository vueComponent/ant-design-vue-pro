<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <s-table ref="table" :scroll="scroll" size="small" rowKey="centerName" :columns="columns" :data="loadData" >
       <template slot="operation" slot-scope="text, record">
        <a @click="_export(record)">下载</a>
      </template>
    </s-table>
  </a-card>
</template>
<script>
import moment from 'moment'
import { getEthicsList,ethicsDownload } from '@/api/report'
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
      loadData: parameter => {
        return getEthicsList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      columns: [{
          title: '中心名称',
          dataIndex: 'centerName',
          width: '100px'
        },{
          title: '上传状态',
          dataIndex: 'statusStr',
          width: '120px'
        },{
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: '150px'
        }],
        
    }
  },
  created() {
    this.scroll = {
      x: true,
      y: window.screen.height - 368 + 'px'
    }
   
  },
  mounted() {
    
   
  },
  methods: {
      _export(record) {
        window.open(this.baseUrl + './ethics/download?ethicsId=' + record.ethicsId)
      }
  }
}
</script>
<style lang="less" scoped>
/deep/.table-page-search-wrapper .ant-form-inline .ant-form-item {
  margin-bottom: 10px;
}

.ant-table td {
  white-space: nowrap;
}
</style>