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
import { getIconCgsfDataList } from '@/api/report'
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
        return getIconCgsfDataList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      columns: [{
          title: '患者编号',
          dataIndex: 'fileCode',
          width: '120px'
        },{
          title: '患者姓名',
          dataIndex: 'patientName',
          width: '90px'
        },{
          title: '患者性别',
          dataIndex: 'sexName',
          width: '90px'
        },{
          title: '患者年龄',
          dataIndex: 'age',
          width: '90px'
        },{
          title: '随访期间有无长期氧疗',
          dataIndex: 'a1',
          width: '180px'
        },{
          title: '随访期间有否无创辅助通气',
          dataIndex: 'a2',
          width: '220px'
        },{
          title: '随访期间有无进行各类物理治疗',
          dataIndex: 'a3',
          width: '260px'
        },{
          title: '物理治疗方式',
          dataIndex: 'a4',
          width: '120px'
        },{
          title: '随访期间有无进行各类呼吸疾病药物治疗',
          dataIndex: 'a5',
          width: '300px'
        },{
          title: '规律抗生素治疗',
          dataIndex: 'a6',
          width: '120px'
        },{
          title: '祛痰药物治疗',
          dataIndex: 'a7',
          width: '100px'
        },{
          title: '支气管扩张剂',
          dataIndex: 'a8',
          width: '160px'
        },{
          title: '支气管扩张剂其他内容输入',
          dataIndex: 'a9',
          width: '180px'
        },{
          title: '吸入激素',
          dataIndex: 'a10',
          width: '130px'
        },{
          title: '其他治疗',
          dataIndex: 'a11',
          width: '120px'
        },{
          title: '各类免疫调节剂治疗',
          dataIndex: 'a12',
          width: '160px'
        },{
          title: '免疫调节剂治疗方式',
          dataIndex: 'a13',
          width: '160px'
        },{
          title: '免疫调节剂治疗方式其他输入',
          dataIndex: 'a14',
          width: '220px'
        }]
        
    }
  },
  created() {
    this.scroll = {
      x: '3000px',
      y: window.screen.height - 420 + 'px'
    }
   
  },
  mounted() {
    
   
  },
  methods: {
    // 导出
      _export() {
      window.open(this.baseUrl + 'patientReport/exportIconCgsf')
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