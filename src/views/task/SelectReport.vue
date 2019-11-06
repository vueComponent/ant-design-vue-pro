<template>
  <a-modal title="选择报告" :width="800" :destroyOnClose="destroyOnClose" :bodyStyle="bodyStyle" :centered="centered" :visible="visible" :confirmLoading="confirmLoading" @ok="checkuUser" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-table :columns="columns" rowKey="reportCollectDetailId" :rowSelection="rowSelection" :dataSource="data" :pagination="pagination" :loading="loading" @change="handleTableChange">
      </a-table>
    </a-spin>
  </a-modal>
</template>
<script>
import { getImportDataList } from '@/api/report'
import moment from 'moment'
import _ from 'lodash'
const columns = [{
    title: '档案号',
    dataIndex: 'fileCode'
  },
  {
    title: '患者姓名',
    dataIndex: 'patientName'
  },
  {
    title: '报告名称',
    dataIndex: 'reportTypeName'
  },
  {
    title: '采集日期',
    dataIndex: 'collectDate',
    customRender: collectDate => moment(collectDate).format('YYYY-MM-DD')
  }
];
export default {
  name: 'SelectReport',
  data() {
    return {
      data: [],
      pagination: {
        defaultPageSize: 5,
        pageSize: 5,
        hideOnSinglePage: true,
        total: 0
      },
      loading: false,
      columns,
      visible: false,
      confirmLoading: false,
      destroyOnClose: true,
      centered: true,
      bodyStyle: {
        height: '480px',
        overflow: 'auto'
      },
      patientId: undefined,
      typeId: undefined,
      selectedData: {}
    }
  },
  methods: {
    add(patientId, typeId) {
      this.visible = true
      this.confirmLoading = true
      this.selectedData = {}
      this.patientId = patientId
      this.typeId = typeId
      this.data = []
      this.getImportDataList(1, this.pagination.pageSize);
    },
    checkuUser() {
      if (JSON.stringify(this.selectedData) == '{}') {
        this.$message.error('您还未选择要导入的报告！')
        return
      }
      this.$emit('listen', this.selectedData);
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    handleTableChange(pagination, filters, sorter) {
      this.getImportDataList(pagination.current, pagination.pageSize)
    },
    getImportDataList(pageNumber, pageSize) {
      const params = new URLSearchParams()
      params.append('pageNumber', pageNumber)
      params.append('pageSize', pageSize)
      params.append('patientId', this.patientId)
      params.append('reportTypeId', this.typeId)
      getImportDataList(params).then(res => {
        this.data = res.data
        this.pagination.total = res.total
        this.confirmLoading = false
      });
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedData = selectedRows[0];
        }
      };
    }
  }
};
</script>