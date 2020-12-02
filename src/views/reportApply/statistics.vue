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
import { getPatientEntry } from '@/api/report'
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
        return getPatientEntry(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      columns: [{
          title: '患者姓名',
          dataIndex: 'patientName',
          width: '70px'
        },{
          title: '患者性别',
          dataIndex: 'sexName',
          width: '80px'
        },{
          title: '入组编号',
          dataIndex: 'fileCode',
          width: '90px'
        },{
          title: '患者年龄',
          dataIndex: 'age',
          width: '80px'
        },{
          title: '支扩病史资料',
          dataIndex: 'pbm1Status',
          width: '100px'
        },{
          title: '体格检查',
          dataIndex: 'pbm2Status',
          width: '70px'
        },{
          title: '胸部影像学',
          dataIndex: 'pbm4Status',
          width: '100px'
        },{
          title: '病原',
          dataIndex: 'pbm5Status',
          width: '70px'
        },{
          title: '病因学',
          dataIndex: 'pbm6Status',
          width: '70px'
        },{
          title: '肺功能',
          dataIndex: 'pbm7Status',
          width: '70px'
        },{
          title: '心超',
          dataIndex: 'pbm8Status',
          width: '80px'
        },{
          title: '其他',
          dataIndex: 'pbm9Status',
          width: '80px'
        },{
          title: '呼吸系统相关治疗',
          dataIndex: 'pbm10Status',
          width: '115px'
        },{
          title: 'BHO',
          dataIndex: 'qt1Status',
          width: '70px'
        },{
          title: 'QOL-B',
          dataIndex: 'qt2Status',
          width: '70px'
        },{
          title: 'MMRC',
          dataIndex: 'qt4Status',
          width: '70px'
        },{
          title: 'LCQ',
          dataIndex: 'qt5Status',
          width: '70px'
        },{
          title: 'HAD',
          dataIndex: 'qt6Status',
          width: '70px'
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
    // 导出
      _export() {
      window.open(this.baseUrl + 'patient/exportPatientEntry')
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