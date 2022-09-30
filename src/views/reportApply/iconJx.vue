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
    <s-table ref="table" :scroll="scroll" size="small" rowKey="centerName" :columns="columns" :data="loadData" showPagination="auto">
    </s-table>
  </a-card>
</template>
<script>
import moment from 'moment'
import { getIconJxDataList } from '@/api/report'
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
        return getIconJxDataList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      columns: [{
        title: '患者编号',
        dataIndex: 'fileCode',
        width: '120px',
        ellipsis: true,
        fixed: 'left'
      }, {
        title: '患者姓名',
        dataIndex: 'patientName',
        width: '90px',
        ellipsis: true,
        fixed: 'left'
      }, {
        title: '患者性别',
        dataIndex: 'sexName',
        width: '90px',
        ellipsis: true
      }, {
        title: '患者年龄',
        dataIndex: 'age',
        width: '90px',
        ellipsis: true
      }, {
        title: 'BSI评分',
        dataIndex: 'bsi',
        width: '100px',
        ellipsis: true
      }, {
        title: 'FACED评分',
        dataIndex: 'faced',
        width: '100px',
        ellipsis: true
      }, {
        title: 'BACI评分',
        dataIndex: 'baci',
        width: '100px',
        ellipsis: true
      }, {
        title: 'REFFI评分',
        dataIndex: 'reffi',
        width: '160px',
        ellipsis: true
      }, {
        title: 'BHQ问卷得分',
        dataIndex: 'bhq',
        width: '160px',
        ellipsis: true
      }, {
        title: 'MMRC评分',
        dataIndex: 'mmrc',
        width: '130px',
        ellipsis: true
      }, {
        title: 'HADS评分',
        dataIndex: 'had',
        width: '120px',
        ellipsis: true
      }, {
        title: 'lcq总评分',
        dataIndex: 'lcq',
        width: '120px',
        ellipsis: true
      }, {
        title: 'lcq生理评分',
        dataIndex: 'lcqSl',
        width: '110px',
        ellipsis: true
      }, {
        title: 'lcq心理评分',
        dataIndex: 'lcqXl',
        width: '110px',
        ellipsis: true
      }, {
        title: 'lcq社会评分',
        dataIndex: 'lcqSh',
        width: '110px',
        ellipsis: true
      }, {
        title: 'qolb身体评分',
        dataIndex: 'qolb1',
        width: '120px',
        ellipsis: true
      }, {
        title: 'qolb角色评分',
        dataIndex: 'qolb2',
        width: '120px',
        ellipsis: true
      }, {
        title: 'qolb活力评分',
        dataIndex: 'qolb3',
        width: '120px',
        ellipsis: true
      }, {
        title: 'qolb情绪评分',
        dataIndex: 'qolb4',
        width: '120px',
        ellipsis: true
      }, {
        title: 'qolb社会评分',
        dataIndex: 'qolb5',
        width: '120px',
        ellipsis: true
      }, {
        title: 'qolb医疗评分',
        dataIndex: 'qolb6',
        width: '120px',
        ellipsis: true
      }, {
        title: 'qolb健康评分',
        dataIndex: 'qolb7',
        width: '120px',
        ellipsis: true
      }, {
        title: 'qolb呼吸评分',
        dataIndex: 'qolb8',
        width: '120px',
        ellipsis: true
      }, {
        title: '提交时间',
        dataIndex: 'submitDate',
        width: '120px',
        ellipsis: true
      }, {
        title: '支气管扩张症诊断日期',
        dataIndex: 'a1',
        width: '160px',
        ellipsis: true
      }, {
        title: '过去两年的支扩急性加重住院次数',
        dataIndex: 'a2',
        width: '220px',
        ellipsis: true
      }, {
        title: '过去一年的支扩急性加重住院次数',
        dataIndex: 'a3',
        width: '230px',
        ellipsis: true
      }, {
        title: '过去一年支扩的急性加重次数',
        dataIndex: 'a4',
        width: '230px',
        ellipsis: true
      }, {
        title: '最后一次急性加重住院的时间',
        dataIndex: 'a5',
        width: '200px',
        ellipsis: true
      }, {
        title: '最后一次急性加重出院的时间',
        dataIndex: 'a6',
        width: '200px',
        ellipsis: true
      }, {
        title: '目前合并呼吸系统相关疾病',
        dataIndex: 'a7',
        width: '200px'
      }, {
        title: '经皮血氧饱和度SpO2',
        dataIndex: 'b1',
        width: '160px',
        ellipsis: true
      }, {
        title: '身高',
        dataIndex: 'b2',
        width: '120px',
        ellipsis: true
      }, {
        title: '体重',
        dataIndex: 'b3',
        width: '120px',
        ellipsis: true
      }, {
        title: 'BMI',
        dataIndex: 'b4',
        width: '120px',
        ellipsis: true
      }, {
        title: '有无桶状胸',
        dataIndex: 'b5',
        width: '120px',
        ellipsis: true
      }, {
        title: '有无杵状指',
        dataIndex: 'b6',
        width: '120px',
        ellipsis: true
      }, {
        title: '是无啰音',
        dataIndex: 'b7',
        width: '120px',
        ellipsis: true
      }, {
        title: '胸部CT检查日期',
        dataIndex: 'c1',
        width: '120px',
        ellipsis: true
      }, {
        title: '支扩位于CT图像',
        dataIndex: 'c2',
        width: '120px',
        ellipsis: true
      }, {
        title: '分离到微生物',
        dataIndex: 'd1',
        width: '120px',
        ellipsis: true
      }, {
        title: '分离到细菌检查日期',
        dataIndex: 'd2',
        width: '120px',
        customRender: d2 => moment(d2).format('YYYY-MM-DD'),
        ellipsis: true
      }, {
        title: '细菌种类',
        dataIndex: 'd3',
        width: '120px',
        ellipsis: true
      }, {
        title: '分离到真菌检查日期',
        dataIndex: 'd4',
        width: '120px',
        customRender: d4 => moment(d4).format('YYYY-MM-DD'),
        ellipsis: true
      }, {
        title: '真菌种类',
        dataIndex: 'd5',
        width: '120px',
        ellipsis: true
      }, {
        title: '分离到分枝杆菌检查日期',
        dataIndex: 'd6',
        width: '120px',
        customRender: d6 => moment(d6).format('YYYY-MM-DD'),
        ellipsis: true
      }, {
        title: '分枝杆菌种类',
        dataIndex: 'd7',
        width: '120px',
        ellipsis: true
      }, {
        title: '其他病原',
        dataIndex: 'd8',
        width: '120px',
        ellipsis: true
      }, {
        title: '其他病原种类',
        dataIndex: 'd9',
        width: '120px',
        ellipsis: true
      }, {
        title: '胃食管反流病量表评分',
        dataIndex: 'e1',
        width: '120px',
        ellipsis: true
      }, {
        title: '胃食管反流病评分日期',
        dataIndex: 'e2',
        width: '120px',
        ellipsis: true
      }, {
        title: '变应性支气管肺曲霉病各类相关检查',
        dataIndex: 'e3',
        width: '120px',
        ellipsis: true
      }, {
        title: '变应性支气管肺曲霉病各类相关检查日期',
        dataIndex: 'e4',
        width: '120px',
        ellipsis: true
      }, {
        title: '外周血嗜酸细胞',
        dataIndex: 'e5',
        width: '120px',
        ellipsis: true
      }, {
        title: '血总IgE',
        dataIndex: 'e6',
        width: '120px',
        ellipsis: true
      }, {
        title: '曲霉特异IgE',
        dataIndex: 'e7',
        width: '120px',
        ellipsis: true
      }, {
        title: '曲霉皮肤点刺试验',
        dataIndex: 'e8',
        width: '120px',
        ellipsis: true
      }, {
        title: '胸部CT有无中心性支扩',
        dataIndex: 'e9',
        width: '120px',
        ellipsis: true
      }, {
        title: '胸部CT提示高密度黏液栓嵌顿',
        dataIndex: 'e10',
        width: '120px',
        ellipsis: true
      }, {
        title: '各类自身免疫抗体检查',
        dataIndex: 'e11',
        width: '120px',
        ellipsis: true
      }, {
        title: '自身免疫抗体检查时间',
        dataIndex: 'e12',
        width: '120px',
        ellipsis: true
      }, {
        title: 'ANA',
        dataIndex: 'e13',
        width: '120px',
        ellipsis: true
      }, {
        title: 'ENA',
        dataIndex: 'e14',
        width: '120px',
        ellipsis: true
      }, {
        title: 'ANCA',
        dataIndex: 'e15',
        width: '120px',
        ellipsis: true
      }, {
        title: '自身免疫抗体检查其他检查',
        dataIndex: 'e16',
        width: '120px',
        ellipsis: true
      }, {
        title: '各类血清免疫球蛋白检查',
        dataIndex: 'e17',
        width: '120px',
        ellipsis: true
      }, {
        title: '各类血清免疫球蛋白检查日期',
        dataIndex: 'e18',
        width: '120px',
        ellipsis: true
      }, {
        title: '血清IgM',
        dataIndex: 'e19',
        width: '120px',
        ellipsis: true
      }, {
        title: '血清IgG',
        dataIndex: 'e20',
        width: '120px',
        ellipsis: true
      }, {
        title: '血清IgA',
        dataIndex: 'e21',
        width: '120px',
        ellipsis: true
      }, {
        title: '各类血清补体检查',
        dataIndex: 'e22',
        width: '120px',
        ellipsis: true
      }, {
        title: '各类血清补体检查日期',
        dataIndex: 'e23',
        width: '120px',
        ellipsis: true
      }, {
        title: '血清C3',
        dataIndex: 'e24',
        width: '120px',
        ellipsis: true
      }, {
        title: '血清C4',
        dataIndex: 'e25',
        width: '120px',
        ellipsis: true
      }, {
        title: '抗蛋白酶基因检查',
        dataIndex: 'e26',
        width: '120px',
        ellipsis: true
      }, {
        title: 'α-1抗蛋白酶基因检查日期',
        dataIndex: 'e27',
        width: '120px',
        ellipsis: true
      }, {
        title: 'α-1抗蛋白酶基因检查',
        dataIndex: 'e28',
        width: '120px',
        ellipsis: true
      }, {
        title: '各类纤毛功能相关检测',
        dataIndex: 'e29',
        width: '120px',
        ellipsis: true
      }, {
        title: '各类纤毛功能相关检测日期',
        dataIndex: 'e30',
        width: '120px',
        ellipsis: true
      }, {
        title: '呼出一氧化氮测定',
        dataIndex: 'e31',
        width: '120px',
        ellipsis: true
      }, {
        title: '电镜检测的活检',
        dataIndex: 'e32',
        width: '120px',
        ellipsis: true
      }, {
        title: '分析纤毛摆动频率的活检',
        dataIndex: 'e33',
        width: '120px',
        ellipsis: true
      }, {
        title: '各类纤毛功能相关检测基因检测',
        dataIndex: 'e34',
        width: '120px',
        ellipsis: true
      }, {
        title: '肺功能测试检查日期',
        dataIndex: 'f1',
        width: '120px',
        ellipsis: true
      }, {
        title: 'FVC',
        dataIndex: 'f2',
        width: '120px',
        ellipsis: true
      }, {
        title: 'FVC pred',
        dataIndex: 'f3',
        width: '120px',
        ellipsis: true
      }, {
        title: 'FEV1',
        dataIndex: 'f4',
        width: '120px',
        ellipsis: true
      }, {
        title: 'FEV1 pred',
        dataIndex: 'f5',
        width: '120px',
        ellipsis: true
      }, {
        title: 'FEV1/ FVC',
        dataIndex: 'f6',
        width: '120px',
        ellipsis: true
      }, {
        title: '各类血气分析检查日期',
        dataIndex: 'f7',
        width: '120px',
        ellipsis: true
      }, {
        title: '酸碱度',
        dataIndex: 'f8',
        width: '120px',
        ellipsis: true
      }, {
        title: '氧分压',
        dataIndex: 'f9',
        width: '120px',
        ellipsis: true
      }, {
        title: '二氧化碳分压',
        dataIndex: 'f10',
        width: '120px',
        ellipsis: true
      }, {
        title: '肺动脉氧分压差',
        dataIndex: 'f11',
        width: '120px',
        ellipsis: true
      }, {
        title: '动脉血氧饱和度SaO2',
        dataIndex: 'f12',
        width: '120px',
        ellipsis: true
      }, {
        title: '血常规检查日期',
        dataIndex: 'g1',
        width: '120px',
        ellipsis: true
      }, {
        title: '血生化检查日期',
        dataIndex: 'g2',
        width: '120px',
        ellipsis: true
      }, {
        title: '血红蛋白',
        dataIndex: 'g3',
        width: '120px',
        ellipsis: true
      }, {
        title: '白细胞',
        dataIndex: 'g4',
        width: '120px',
        ellipsis: true
      }, {
        title: '红细胞',
        dataIndex: 'g5',
        width: '120px',
        ellipsis: true
      }, {
        title: '血小板',
        dataIndex: 'g6',
        width: '120px',
        ellipsis: true
      }, {
        title: '中性粒细胞绝对值',
        dataIndex: 'g7',
        width: '120px',
        ellipsis: true
      }, {
        title: '嗜酸细胞绝对值',
        dataIndex: 'g8',
        width: '120px',
        ellipsis: true
      }, {
        title: '血糖',
        dataIndex: 'g9',
        width: '120px',
        ellipsis: true
      }, {
        title: '白蛋白',
        dataIndex: 'g10',
        width: '120px',
        ellipsis: true
      }, {
        title: '前白蛋白',
        dataIndex: 'g11',
        width: '120px',
        ellipsis: true
      }, {
        title: '既往有否长期氧疗',
        dataIndex: 'h1',
        width: '120px',
        ellipsis: true
      }, {
        title: '既往有否无创辅助通气',
        dataIndex: 'h2',
        width: '120px',
        ellipsis: true
      }, {
        title: '既往有否进行各类物理治疗',
        dataIndex: 'h3',
        width: '120px',
        ellipsis: true
      }, {
        title: '物理治疗方式',
        dataIndex: 'h4',
        width: '120px',
        ellipsis: true
      }, {
        title: '既往有否进行各类呼吸疾病药物治疗',
        dataIndex: 'h5',
        width: '120px',
        ellipsis: true
      }, {
        title: '规律抗生素治疗',
        dataIndex: 'h6',
        width: '120px',
        ellipsis: true
      }, {
        title: '祛痰药物治疗',
        dataIndex: 'h7',
        width: '120px',
        ellipsis: true
      }, {
        title: '支气管扩张剂',
        dataIndex: 'h8',
        width: '120px',
        ellipsis: true
      }, {
        title: '吸入激素',
        dataIndex: 'h9',
        width: '120px',
        ellipsis: true
      }, {
        title: '其他治疗',
        dataIndex: 'h10',
        width: '220px',
        ellipsis: true
      }, {
        title: '既往有否进行各类免疫调节剂治疗',
        dataIndex: 'h11',
        width: '120px',
        ellipsis: true
      }, {
        title: '免疫调节剂治疗方式',
        dataIndex: 'h12',
        ellipsis: true
      }]

    }
  },
  created() {
    this.scroll = {
      x: '15000px',
      y: window.screen.height - 420 + 'px'
    }

  },
  mounted() {


  },
  methods: {
    // 导出
    _export() {
      window.open(this.baseUrl + 'patientReport/exportIconJx')
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