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
import { getIconJxjzDataList } from '@/api/report'
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
        return getIconJxjzDataList(Object.assign(parameter, this.queryParam)).then(res => {
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
          title: '本次急性加重发作日期',
          dataIndex: 't',
          width: '180px'
        },{
          title: '急性加重的症状',
          dataIndex: 't1',
          width: '220px'
        },{
          title: '本次支气管扩张急性加重时的气道分泌物微生物培养',
          dataIndex: 't2str',
          width: '260px'
        },{
          title: '有否分离到微生物',
          dataIndex: 'a',
          width: '220px'
        },{
          title: '分离到细菌检查日期',
          dataIndex: 'a1',
          width: '300px'
        },{
          title: '细菌种类',
          dataIndex: 'a11',
          width: '120px'
        },{
          title: '其他细菌输入内容',
          dataIndex: 'a12',
          width: '100px'
        },{
          title: '分离到真菌检查日期',
          dataIndex: 'a2',
          width: '160px'
        },{
          title: '真菌种类',
          dataIndex: 'a21',
          width: '180px'
        },{
          title: '分离到分枝杆菌检查日期',
          dataIndex: 'a3',
          width: '130px'
        },{
          title: '分枝杆菌种类',
          dataIndex: 'a31',
          width: '120px'
        },{
          title: '分离到其他病原检查日期',
          dataIndex: 'a4',
          width: '160px'
        },{
          title: '其他病原输入框',
          dataIndex: 'a41',
          width: '160px'
        },{
          title: '其他方法检查日期',
          dataIndex: 'a5',
          width: '220px'
        },{
          title: '其他方法种类',
          dataIndex: 'a51',
          width: '220px'
        },{
          title: '本次支气管扩张急性加重时的血常规检测',
          dataIndex: 'b',
          width: '220px'
        },{
          title: '急性加重检查日期',
          dataIndex: 'b11',
          width: '220px'
        },{
          title: '白细胞',
          dataIndex: 'b12',
          width: '220px'
        },{
          title: '中性粒细胞绝对值',
          dataIndex: 'b13',
          width: '220px'
        },{
          title: '淋巴细胞绝对值',
          dataIndex: 'b14',
          width: '220px'
        },{
          title: 'C反应蛋白',
          dataIndex: 'b15',
          width: '220px'
        },{
          title: '本次支气管扩张急性加重的住院日期',
          dataIndex: 'b21',
          width: '220px'
        },{
          title: '本次支气管扩张急性加重的出院日期',
          dataIndex: 'b22',
          width: '220px'
        },{
          title: '本次支气管扩张急性加重时的抗生素治疗',
          dataIndex: 'b3',
          width: '220px'
        },{
          title: '哌拉西林起始日期',
          dataIndex: 'b31',
          width: '220px'
        },{
          title: '哌拉西林结束日期',
          dataIndex: 'b32',
          width: '220px'
        },{
          title: '哌拉西林/他唑巴坦起始日期',
          dataIndex: 'b41',
          width: '220px'
        },{
          title: '哌拉西林/他唑巴坦结束日期',
          dataIndex: 'b42',
          width: '220px'
        },{
          title: '头孢他啶起始日期',
          dataIndex: 'b51',
          width: '220px'
        },{
          title: '头孢他啶结束日期',
          dataIndex: 'b52',
          width: '220px'
        },{
          title: '头孢哌酮起始日期',
          dataIndex: 'b61',
          width: '220px'
        },{
          title: '头孢哌酮结束日期',
          dataIndex: 'b62',
          width: '220px'
        },{
          title: '头孢哌酮/舒巴坦起始日期',
          dataIndex: 'b71',
          width: '220px'
        },{
          title: '头孢哌酮/舒巴坦结束日期',
          dataIndex: 'b72',
          width: '220px'
        },{
          title: '头孢吡肟起始日期',
          dataIndex: 'b81',
          width: '220px'
        },{
          title: '头孢吡肟结束日期',
          dataIndex: 'b82',
          width: '220px'
        },{
          title: '亚胺培南起始日期',
          dataIndex: 'b91',
          width: '220px'
        },{
          title: '亚胺培南结束日期',
          dataIndex: 'b92',
          width: '220px'
        },{
          title: '美罗培南起始日期',
          dataIndex: 'b101',
          width: '220px'
        },{
          title: '美罗培南结束日期',
          dataIndex: 'b102',
          width: '220px'
        },{
          title: '氨曲南起始日期',
          dataIndex: 'b111',
          width: '220px'
        },{
          title: '氨曲南结束日期',
          dataIndex: 'b112',
          width: '220px'
        },{
          title: '环丙沙星起始日期',
          dataIndex: 'b121',
          width: '220px'
        },{
          title: '环丙沙星结束日期',
          dataIndex: 'b122',
          width: '220px'
        },{
          title: '左氧氟沙星起始日期',
          dataIndex: 'b131',
          width: '220px'
        },{
          title: '左氧氟沙星结束日期',
          dataIndex: 'b132',
          width: '220px'
        },{
          title: '阿米卡星起始日期',
          dataIndex: 'b141',
          width: '220px'
        },{
          title: '阿米卡星结束日期',
          dataIndex: 'b142',
          width: '220px'
        },{
          title: '妥布霉素起始日期',
          dataIndex: 'b151',
          width: '220px'
        },{
          title: '妥布霉素结束日期',
          dataIndex: 'b152',
          width: '220px'
        },{
          title: '庆大霉素起始日期',
          dataIndex: 'b161',
          width: '220px'
        },{
          title: '庆大霉素结束日期',
          dataIndex: 'b162',
          width: '220px'
        },{
          title: '多黏菌素E起始日期',
          dataIndex: 'b171',
          width: '220px'
        },{
          title: '多黏菌素E结束日期',
          dataIndex: 'b172',
          width: '220px'
        },{
          title: '多黏菌素B起始日期',
          dataIndex: 'b181',
          width: '220px'
        },{
          title: '多黏菌素B结束日期',
          dataIndex: 'b182',
          width: '220px'
        },{
          title: '磷霉素起始日期',
          dataIndex: 'b191',
          width: '220px'
        },{
          title: '磷霉素结束日期',
          dataIndex: 'b192',
          width: '220px'
        },{
          title: '其他抗生素1名称',
          dataIndex: 'b201',
          width: '220px'
        },{
          title: '其他抗生素1开始日期',
          dataIndex: 'b202',
          width: '220px'
        },{
          title: '其他抗生素1结束日期',
          dataIndex: 'b203',
          width: '220px'
        },{
          title: '其他抗生素2名称',
          dataIndex: 'b211',
          width: '220px'
        },{
          title: '其他抗生素2开始日期',
          dataIndex: 'b212',
          width: '220px'
        },{
          title: '其他抗生素2结束日期',
          dataIndex: 'b213',
          width: '220px'
        },{
          title: '其他抗生素3名称',
          dataIndex: 'b221',
          width: '220px'
        },{
          title: '其他抗生素3开始日期',
          dataIndex: 'b222',
          width: '220px'
        },{
          title: '其他抗生素3结束日期',
          dataIndex: 'b223',
          width: '220px'
        }]
        
    }
  },
  created() {
    this.scroll = {
      x: '18000px',
      y: window.screen.height - 420 + 'px'
    }
   
  },
  mounted() {
    
   
  },
  methods: {
    // 导出
      _export() {
      window.open(this.baseUrl + 'patientReport/exportIconJxjz')
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