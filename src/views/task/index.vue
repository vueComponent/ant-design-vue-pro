<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="4" :sm="24">
            <a-form-item ><a-input v-model="keyword" placeholder="" /></a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="$refs.table.refresh(true,keyword)">查询</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" size="default" rowKey="visitTaskId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
       <span slot="warnStatus" slot-scope="text">
        <my-icon type="iconyujing_huaban" :class="text|warnStatusType"></my-icon>
      </span>
      <span slot="name"  slot-scope="text,record" @click="showUser(record)">
        <p class="userName">{{text}}</p>
      </span>
      <span slot="warnStatus" slot-scope="text">
        <my-icon type="iconyujing_huaban" :class="text|warnStatusType"></my-icon>
      </span>
      <span slot="executeStatus" slot-scope="text"><a-badge :status="text | executeStatusTypeFilter" :text="text | executeStatusFilter" /></span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="implement(record)">
            执行
          </a>
          <a-divider type="vertical" />
          <a @click="ignore(record)">
            忽略
          </a>
        </template>
      </span>
    </s-table>
    
    <user-detail ref="detailModal"/>
  </a-card>
</template>

<script>
import moment from 'moment';
import { STable, Ellipsis } from '@/components';
import { getVisitTask,ignoreTask } from '@/api/task';
import { MyIcon } from '@/components/_util/util';
import UserDetail from '../list/modules/UserDetail'

const executeStatusMap = {
  0:{
    status: 'default',
    text: '忽略'
  },
  1: {
    status: 'error',
    text: '未执行'
  },
  2: {
    status: 'processing',
    text: '执行中'
  },
  3: {
    status: 'success',
    text: '已完成'
  }
};
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    MyIcon,
    UserDetail
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      keyword:'',
      // 表头
      columns: [
         {
          title: '预警',
          dataIndex: 'warnStatus',
          scopedSlots: { customRender: 'warnStatus' }
        },
        {
          title: '任务编号',
          dataIndex: 'fileCode'
        },
        {
          title: '患者姓名',
          dataIndex: 'patientName',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '身份证号',
          dataIndex: 'card'
        },{
          title: '联系电话',
          dataIndex: 'telephone'
        },
        {
          title: '创建日期',
          dataIndex: 'createDate',
        },
         {
          title: '到期时间',
          dataIndex: 'planDate',
        },
        {
          title: '任务状态',
          dataIndex: 'executeStatus',
          scopedSlots: { customRender: 'executeStatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter);
        const Params = new URLSearchParams();
        Params.append('pageNumber', parameter.pageNumber);
        Params.append('pageSize', parameter.pageSize);
        Params.append('params', 1);
         Params.append('keyWord', parameter.keyWord);
        return getVisitTask(Params).then(res => {
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: {
          show: false,
          clear: () => {
            this.selectedRowKeys = [];
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    };
  },
  filters: {
    warnStatusType(type){
      const warnStatusMap=["warningColor",'approachColor',"safeColor"]
      return warnStatusMap[type+1]
    },
    executeStatusFilter(type) {
      return executeStatusMap[type].text;
    },
    executeStatusTypeFilter(type) {
      return executeStatusMap[type].status;
    }
  },
  created() {

  },
  methods: {
    showUser(record){
      this.$refs.detailModal.show(record);
    },
    implement(record) {
      //执行      
    },
    ignore(record) {
      //忽略
      const that=this;
       this.$confirm({
        title: '确认忽略该项任务',
        onOk() {          
          const Params = new URLSearchParams();
          Params.append('visitTaskId', record.visitTaskId);
          ignoreTask(Params).then(res => {
            that.$refs.table.refresh(true)
          });
        },
        onCancel() {},
      });
     
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    }
  }
};
</script>
<style lang="less" scoped>
  .warningColor{
    font-size:20px; 
    color: #EB352D;
  } 
   .approachColor{
     font-size:20px;
     color: #F7B430;
   }
   .safeColor{
     font-size:20px;
     color: #23AC3A;
   }
.progressTag {
  display: inline-block;
  width: 140px;

  /deep/ .progressTagContent {
    display: inline-block;
    width: 100px;
    margin-right: 5px;
  }
  /deep/ .progressTagTitle {
    padding-left: 40px;
    margin-bottom: 2px;
  }
  /deep/ .progressTag .anticon {
    color: #4bc5ac;
    font-size: 18px;
    vertical-align: bottom;
  }
  /deep/ .ant-progress-inner {
    background-color: #e5f6ff;
  }
  /deep/ .progressTag .ant-progress-span {
    color: rgb(0, 160, 233);
  }
}

.tableSearch {
  background: #FFFFFF;
  position: absolute;
  top: 52px;
  z-index: 100;
}
.userName{
  color: #1FB2FA;
  margin: 0;
}
.userName:active,.userName:hover{
    text-decoration: underline;
    text-underline-position: under;
    text-decoration-color: #1FB2FA;
    cursor: pointer;
}
</style>
