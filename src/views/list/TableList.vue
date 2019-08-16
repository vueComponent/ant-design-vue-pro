<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="6" :sm="24">
            <a-form-item label="规则编号"><a-input v-model="queryParam.id" placeholder="" /></a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :md="12" style="text-align:right" :sm="24"><a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button></a-col>
          <a-col v-if="advanced" class="tableSearch" :md="6">
              <a-card>
                <a-form-item label="使用状态">
                  <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="调用次数"><a-input-number v-model="queryParam.callNo" style="width: 100%" /></a-form-item>
                <a-form-item label="更新日期"><a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期" /></a-form-item>
                <a-form-item label="使用状态">
                  <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="使用状态">
                  <a-select placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-card>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" size="default" rowKey="patientId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="visit" slot-scope="text"><a-badge :status="text | visitTypeFilter" :text="text | visitFilter" /></span>
      <span slot="basisList" slot-scope="basisList">
        <div v-for="pro in basisList" class="progressTag">
          <div class="progressTagContent">
            <p class="progressTagTitle">{{ pro.name }}</p>
            <a-progress :strokeColor="pro.progress == 100 ? '#4BC5AC' : '#00A0E9'" :strokeWidth="10" :showInfo="false" :percent="parseInt(pro.progress)" size="small" />
          </div>
          <a-icon v-if="pro.progress == 100" type="check-circle" theme="filled" />
          <span class="ant-progress-span" v-if="pro.progress < 100 && pro.progress > 0">23%</span>
          <a-icon style="color:#00A0E9" v-if="pro.progress == 0" type="clock-circle" theme="filled" />
        </div>
      </span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="8" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">
            <a-icon type="home" />
            配置
          </a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">
            <a-icon type="home" />
            订阅报警
          </a>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
    <step-by-step-modal ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment';
import { STable, Ellipsis } from '@/components';
import StepByStepModal from './modules/StepByStepModal';
import CreateForm from './modules/CreateForm';
import { getPatientList } from '@/api/patient';

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
    StepByStepModal
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
          title: '创建日期',
          dataIndex: 'createDate',
          customRender: createDate => moment(createDate).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '访视状态',
          dataIndex: 'visit',
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
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter);
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
      optionAlertShow: false
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
  created() {

  },
  methods: {
    handleEdit(record) {
      console.log(record);
      this.$refs.modal.edit(record);
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
    }
  }
};
</script>
<style lang="less" scoped>
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
</style>
