<template>
  <a-modal :title="options.title" :width="700" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :destroyOnClose="destroyOnClose" :centered="centered" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item>
          <a-input-search placeholder="搜索患者姓名,身份证号" @search="onSearch" v-decorator="['card', { rules: [{ required: true , message: '该选项必填'}] }]" enterButton autocomplete="off" />
        </a-form-item>
        <a-table v-if="data.length > 0" :columns="columns" :rowSelection="rowSelection" :dataSource="data" :pagination="pagination" rowKey="patientId" @change="handleTableChange">
        </a-table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getPatientList } from '@/api/patient'
import { createSFJx } from '@/api/basis'
import moment from 'moment'
const columns = [{
    title: '患者编号',
    dataIndex: 'code'
  },
  {
    title: '患者姓名',
    dataIndex: 'name'
  },
  {
    title: '身份证号',
    dataIndex: 'card'
  },
  {
    title: '联系方式',
    dataIndex: 'telephone1'
  }
];
export default {
  data() {
    return {
      options: {},
      residences: [],
      patientId: undefined,
      maskClosable: false,
      data: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      visible: false,
      confirmLoading: false,
      centered: true,
      destroyOnClose: true,
      bodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      form: this.$form.createForm(this),
      requiredRule: { rules: [{ required: true, message: '该选项必填' }] },
      pagination: {},
      columns,
      keyword: ''
    };
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.patientId = selectedRows[0].patientId
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      };
    }
  },
  methods: {
    add() {
      this.options.title = '新建急性加重期';
      this.visible = true;
      this.data = [];
      this.patientId = null;
    },
    onSearch(value) {
      this.keyword = value
      this.getPatientList(1, 5);
    },
    handleTableChange(pagination) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getPatientList(pagination.current, 5);
    },
    handleSubmit() {
      if (!this.patientId) {
        this.$message.error('请选择患者')
        return
      }
      this.confirmLoading = true
      const p = new URLSearchParams();
      p.append('patientId', this.patientId)
      createSFJx(p).then(res => {
        this.$emit('ok')
        this.visible = false
        this.$message.success(res.msg);
        this.confirmLoading = false
      })
    },
    handleCancel() {
      this.visible = false;
    },
    getPatientList(pageNumber, pageSize) {
      const Params = new URLSearchParams();
      Params.append('pageNumber', pageNumber);
      Params.append('pageSize', pageSize);
      Params.append('keyWord', this.keyword);
      getPatientList(Params).then(res => {
        this.data = res.data;
        const pagination = { ...this.pagination };
        pagination.total = res.total;
        // this.confirmLoading = false;
        this.pagination = pagination;
      });
    }
  }
};
</script>
<style>
.ant-modal-header {
  padding: 12px 24px !important;
}

.ant-modal-close-x {
  width: 50px !important;
  height: 50px !important;
  line-height: 50px !important;
}
</style>