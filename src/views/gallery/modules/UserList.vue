<template>
  <a-modal title="选择患者" :width="800" :destroyOnClose="destroyOnClose" :bodyStyle="bodyStyle" :centered="centered" :visible="visible" :confirmLoading="confirmLoading" @ok="checkuUser" @cancel="handleCancel">
      <a-table :columns="columns"
      :rowSelection="rowSelection"
      :dataSource="data"
      :pagination="pagination"
      :loading="loading"
       @change="handleTableChange"
    >
      <template slot="name" slot-scope="name">
        {{name.first}} {{name.last}}
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import {getPatientList} from '@/api/patient';
import _ from 'lodash';
const columns = [{
  title: 'Name',
  dataIndex: 'name',
}, {
  title: 'telephone1',
  dataIndex: 'telephone1',
}, {
  title: 'Address',
  dataIndex: 'address',
}];
export default { 
  data() {
    return {
      name:'',
      userData:{},
      data:[],
      pagination: {
        pageSize:5
      },
      loading: false,
      columns,
      visible: false,
      confirmLoading: false,
      destroyOnClose:true,
      centered:true,
      bodyStyle:{
        height:"400px",
        overflow:"auto"
      }
    };
  },
  mounted() {
    this.userData={};
    this.getPatientList(1,this.pagination.pageSize,1)
  },
  methods: {
    add(value) {
      this.userId=value;
      this.visible = true;
    },
    checkuUser() {
      this. $emit('listen',this.userData)
      console.log(this.userData);
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
    },
    handleTableChange (pagination, filters, sorter) {
      this.getPatientList(pagination.current,pagination.pageSize,1)
    },
    getPatientList(pageNumber,pageSize,params,name){
      const that=this;
      const Name=name?name:'';
      const Params = new URLSearchParams();
      Params.append('pageNumber',pageNumber);
      Params.append('pageSize',pageSize);
      Params.append('params',params);
      Params.append('name',Name);
      getPatientList(Params).then(res => {
          that.data=res.data
          that.pagination.total=res.total
      });
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        type:"radio",
        onChange: (selectedRowKeys, selectedRows) => {
          this.userData= selectedRows
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
          }
        }),
      }
    }
  },
};
</script>
