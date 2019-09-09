<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form :form="form" layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item><a-input v-model="queryParam.keyword" placeholder="搜索患者姓名、身份证号" /></a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="$refs.table.refresh()">查询</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '更多筛选' : '更多筛选' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :md="13" style="text-align:right" :sm="24"><a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button></a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="$refs.table.search({ type: 1 })">本月新增病例</p>
                    <p @click="$refs.table.search({ type: 2 })">本年新增病例</p>
                    <p @click="$refs.table.search({ type: 3 })">全部病例</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card  :bordered="false">
                    <a-form>
                      <a-form-item label="档案号"><a-input v-model="queryParam.code" style="width: 100%" /></a-form-item>
                      <a-form-item label="姓名"><a-input v-model="queryParam.name" style="width: 100%" /></a-form-item>
                      <a-form-item label="身份证号"><a-input v-model="queryParam.card" style="width: 100%" /></a-form-item>
                      <a-form-item label="创建日期" style="margin-bottom:0;">
                        <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"><a-date-picker style="width: 100%" @change="changeTime1" /></a-form-item>
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
    <s-table ref="table" size="default" :scroll="scroll"  rowKey="patientId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="name" slot-scope="text, record" @click="showUser(record)">
        <p class="userName">{{ text }}</p>
      </span>
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="visit" slot-scope="text"><a-badge :status="text | visitTypeFilter" :text="text | visitFilter" /></span>
      <span slot="basisList" slot-scope="basisList">
        <div v-for="pro in basisList" class="progressTag">
           <router-link :to="{path:'/list/basis/' + pro.patientBasisId}"> 
          <div class="progressTagContent">
            <p class="progressTagTitle">{{ pro.typeName }}</p>
            <a-progress class="progressline" :strokeColor="pro.progress == 100 ? '#4BC5AC' : '#00A0E9'"  :strokeWidth="10" :showInfo="false" :percent="parseInt(pro.progress)" size="small" />
          </div>
          <a-icon v-if="pro.progress == 100" type="check-circle" theme="filled" />
          <span class="ant-progress-span" v-if="pro.progress < 100 && pro.progress > 0">23%</span>
          <a-icon style="color:#00A0E9" v-if="pro.progress == 0" type="clock-circle" theme="filled" />
           </router-link>
        </div>
      </span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="8" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">添加访视表</a>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
    <user-detail ref="detailModal" />
  </a-card>
</template>

<script>
import moment from 'moment';
import { STable, Ellipsis } from '@/components';
import StepByStepModal from './modules/StepByStepModal';
import CreateForm from './modules/CreateForm';
import { getPatientList } from '@/api/patient';
import UserDetail from './modules/UserDetail';

const visitMap = {
  0: {
    status: 'default',
    text: '忽略'
  },
  1: {
    status: 'processing',
    text: '未执行'
  },
  2: {
    status: 'success',
    text: '执行中'
  },
  3: {
    status: 'error',
    text: '已完成'
  }
};

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal,
    UserDetail
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '档案号',
            width:"150px",
          dataIndex: 'fileCode'
          
        },
        {
          title: '患者姓名',
          dataIndex: 'name',
           width:"100px",
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '身份证号',
          width:"180px",
          dataIndex: 'card'
        },
        {
          title: '创建日期',
          dataIndex: 'createDate',
             width:"180px",
          customRender: createDate => moment(createDate).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '访视状态',
          dataIndex: 'visit',
           width:"100px",
          scopedSlots: { customRender: 'visit' }
        },
        {
          title: '访视进度',
          dataIndex: 'basisList',
          scopedSlots: { customRender: 'basisList' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
         fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPatientList(Object.assign(parameter, this.queryParam)).then(res => {
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
      scroll:{
        x:"130%",
        y:'350px'
      },
      optionAlertShow: false,
      form: this.$form.createForm(this),
    };
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text;
    },
    statusTypeFilter(type) {
      return statusMap[type].status;
    },
    visitFilter(type) {
      return visitMap[type].text;
    },
    visitTypeFilter(type) {
      return visitMap[type].status;
    }
  },
  created() {},
  methods: {
    clearForm(){
      this.queryParam={}
    },
    showUser(record) {
      this.$refs.detailModal.show(record);
    },
    handleEdit(record) {
      this.$refs.createModal.edit(record);
    },
    handleSub(record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`);
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`);
      }
    },
    handleOk() {
      this.$refs.table.refresh();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      };
    },
    changeTime1(time) {
      console.log(time);
      this.queryParam.date1 = moment(time).format('YYYY-MM-DD');
    },
    changeTime2(time) {
      console.log(time);
      this.queryParam.date2 = moment(time).format('YYYY-MM-DD');
    }
  }
};
</script>
<style lang="less" scoped>
.ant-table td { white-space: nowrap; }
 
/deep/.ant-table-row-hover .progressTag .ant-progress-inner{
       background-color:#ffffff!important;
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
    text-align: center;
    color: #000;
    margin-bottom: 0;
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
