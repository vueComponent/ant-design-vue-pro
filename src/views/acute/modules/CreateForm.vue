<template>
  <a-modal :title="options.title" :width="700" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :destroyOnClose="destroyOnClose" :centered="centered" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item>
          <a-input-search placeholder="搜索患者姓名,身份证号" @search="onSearch" v-decorator="['card', { rules: [{ required: true , message: '该选项必填'}] }]" enterButton autocomplete="off" />
        </a-form-item>
        <a-table :columns="columns" :rowSelection="rowSelection" :dataSource="data" :pagination="pagination" :loading="loading" rowKey="patientId">
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
    title: '档案号',
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
        height: '460px',
        overflow: 'auto'
      },
      form: this.$form.createForm(this),
      requiredRule: { rules: [{ required: true, message: '该选项必填' }] },
      pagination: {
        defaultPageSize: 5,
        pageSize: 5,
        hideOnSinglePage: true,
        total: 0
      },
      loading: false,
      columns
    };
  },
  created() {},
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
    },
    onSearch(value) {
      this.getPatientList(1, this.pagination.pageSize, value);
    },
    handleSubmit() {
      var that = this
      if (!this.patientId) {
        this.$message.error('请选择患者')
      } else {
        const p = new URLSearchParams();
        p.append('patientId', this.patientId)
        createSFJx(p)
          .then(res => {
            that.$message.success(res.msg, function() {
              location.href = location.href
            })
          })
      }
      return false;
    },
    handleCancel() {
      this.visible = false;
    },
    getPatientList(pageNumber, pageSize, keyword) {
      const keyWord = keyword ? keyword : '';
      const Params = new URLSearchParams();
      Params.append('pageNumber', pageNumber);
      Params.append('pageSize', pageSize);
      Params.append('keyword', keyWord);
      getPatientList(Params).then(res => {
        this.data = res.data;
        this.pagination.total = res.total;
        this.confirmLoading = false;
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