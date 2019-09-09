<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item ><a-input v-model="queryParam.keyWord" placeholder="搜索患者姓名、身份证号" /></a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="$refs.table.refresh()">查询</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  更多筛选
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
              <div>
                <a-tabs defaultActiveKey="1">
                  <a-tab-pane tab="常用检索" key="1">
                    <div class="commonRetrieval">                      
                      <p @click="$refs.table.search({ type: 0})">忽略任务</p>
                      <p @click="$refs.table.search({ type: 1 })">未执行任务</p>
                      <p @click="$refs.table.search({ type: 2 })">执行中任务</p>
                      <p @click="$refs.table.search({ type: 3 })">已完成任务</p>
                    </div>
                  </a-tab-pane>
                  <a-tab-pane tab="自定义检索" key="2" forceRender>
                    <a-card  :bordered="false">
                      <a-form>
                        <a-form-item  label="档案号"><a-input v-model="queryParam.code" style="width: 100%" /></a-form-item>
                        <a-form-item  label="姓名"><a-input v-model="queryParam.name" style="width: 100%" /></a-form-item>
                        <a-form-item  label="身份证号"><a-input v-model="queryParam.card" style="width: 100%" /></a-form-item>
                      <a-form-item label="创建日期" style="margin-bottom:0;">
                        <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"><a-date-picker style="width: 100%"  @change="changeTime1"  /></a-form-item>
                        <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">-</span>
                        <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"><a-date-picker style="width: 100%" @change="changeTime2" /></a-form-item>
                      </a-form-item>
                      <a-form-item style="text-align: right;margin-bottom: 0;margin-top: 15px;">
                          <a-button type="primary"  @click="clearForm()">清空</a-button>
                         <a-button type="primary" style="margin-left: 10px;" @click="$refs.table.refresh()">查询</a-button>
                      </a-form-item>
                      </a-form>
                    </a-card>
                  </a-tab-pane>
                </a-tabs>
              </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" size="default" rowKey="visitTaskId" :scroll="scroll" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
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
      queryParam: {
        params:1
      },
      keyword:'',
      // 表头
      columns: [
         {
          title: '预警',
          dataIndex: 'warnStatus',
          scopedSlots: { customRender: 'warnStatus' },
          width:"50px"
        },
        {
          title: '任务编号',
          dataIndex: 'fileCode',
            width:"120px"
        },
        {
          title: '患者姓名',
          dataIndex: 'patientName',
          scopedSlots: { customRender: 'name' },
             width: '100px',
        },
        {
          title: '身份证号',
          dataIndex: 'card',
               width: '200px',
        },{
          title: '联系电话',
          dataIndex: 'telephone',
               width: '150px',
        },
        {
          title: '创建日期',
          dataIndex: 'createDate',
              width: '110px',
        },
         {
          title: '到期时间',
          dataIndex: 'planDate',
                width: '110px',
        },
        {
          title: '任务状态',
          dataIndex: 'executeStatus',
          scopedSlots: { customRender: 'executeStatus' },
            width: '110px',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
           fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData:parameter => {
        return getVisitTask(Object.assign(parameter, this.queryParam)).then(res => {
          return res;
        });
      },
      // parameter => {
      //   console.log('loadData.parameter', parameter);
      //   const Params = new URLSearchParams();
      //   Params.append('pageNumber', parameter.pageNumber);
      //   Params.append('pageSize', parameter.pageSize);
      //   Params.append('params', 1);
      //    Params.append('keyWord', parameter.keyWord);
      //   return getVisitTask(Params).then(res => {
      //     return res;
      //   });
      // },

      
      selectedRowKeys: [],
      selectedRows: [],
      scroll:{
     y:'350px'
   },
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
    clearForm(){
      this.queryParam={}
    },
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
    },
    changeTime1(time) {
      console.log(time);
      this.queryParam.createDateStart = moment(time).format('YYYY-MM-DD');
    },
    changeTime2(time) {
      console.log(time);
      this.queryParam.createDateEnd = moment(time).format('YYYY-MM-DD');
    }
  }
};
</script>
<style lang="less" scoped>
  /deep/.ant-table td { white-space: nowrap; }
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
  background: #ffffff;
  position: absolute;
  top: 52px;
  box-shadow: 4px 4px 10px #ddd;
  z-index: 100;
  /deep/ .ant-card-body .ant-form-horizontal .ant-form-item > .ant-form-item-label {
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
.userName {
  color: #1fb2fa;
  margin: 0;
  &:active,
  &:hover {
    text-decoration: underline;
    text-underline-position: under;
    text-decoration-color: #1fb2fa;
    cursor: pointer;
  }
}
</style>
