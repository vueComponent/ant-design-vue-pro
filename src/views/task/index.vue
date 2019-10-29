<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.keyWord" placeholder="搜索患者姓名、身份证号" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
              <a @click="advanced = !advanced" style="margin-left: 8px">
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
                    <p @click="tableSearch(1)">未执行任务</p>
                    <p @click="tableSearch(2)">未执行随访</p>
                    <p @click="tableSearch(3)">未执行访视</p>
                    <p @click="tableSearch(4)">已执行随访</p>
                    <p @click="tableSearch(5)">已执行访视</p>
                    <p @click="tableSearch(6)">全部任务</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="档案号">
                        <a-input v-model="queryParam.fileCode" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="患者姓名">
                        <a-input v-model="queryParam.patientName" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model="queryParam.card" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="任务名称">
                        <a-select v-model="queryParam.type" style="width: 100%">
                          <a-select-option value="2">半年随访任务</a-select-option>
                          <a-select-option value="3">年访视任务</a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="计划执行日期" style="margin-bottom:0;">
                        <a-range-picker @change="changeTime" style="width: 100%" :value="dateArr" />
                      </a-form-item>
                      <a-form-item style="text-align: right;margin-bottom: 0;margin-top: 15px;">
                        <a-button type="primary" @click="clearForm">清空</a-button>
                        <a-button type="primary" style="margin-left: 10px;" @click="refreshTable">查询</a-button>
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
    <s-table ref="table" :scroll="scroll" size="small" rowKey="patientBasisId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <template slot="warnStatus" slot-scope="text">
        <img width="25px" v-if="text == 1" src="../../assets/warn-1.png" :alt="text">
        <img width="25px" v-else-if="text == 2" src="../../assets/warn-2.png" :alt="text">
        <img width="25px" v-else-if="text > 2" src="../../assets/warn-3.png" :alt="text">
      </template>
      <template slot="patientName" slot-scope="text,record">
        <a @click="showUser(record)">{{text}}</a>
      </template>
      <template slot="executeStatus" slot-scope="text">
        <a-badge :status="text | executeStatusTypeFilter" :text="text | executeStatusFilter" />
      </template>
      <template slot="operation" slot-scope="text, record">
        <a @click="implement(record)">执行</a>
      </template>
    </s-table>
    <user-detail ref="detailModal" />
  </a-card>
</template>
<script>
  import moment from 'moment';
  import { getVisitTask, ignoreTask } from '@/api/task';
  import { STable } from '@/components';
  import UserDetail from '../list/modules/UserDetail'
  const executeStatusMap = {
    0: {
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
    name: 'Task',
    components: {
      STable,
      UserDetail
    },
    data() {
      return {
        bodyStyle: {
          padding: "10px",
          paddingBottom: "0px"
        },
        // 查询参数
        queryParam: {},
        advanced: false,
        // 表头
        columns: [
          {
            title: '预警',
            dataIndex: 'warnStatus',
            scopedSlots: { customRender: 'warnStatus' },
            width: "70px"
          },
          {
            title: '任务编号',
            dataIndex: 'code',
            width: "100px"
          },
          {
            title: '任务名称',
            dataIndex: 'typeName',
            customRender: typeName => typeName + '任务',
            width: "120px"
          },
          {
            title: '档案号',
            dataIndex: 'fileCode',
            width: "110px"
          },
          {
            title: '患者姓名',
            dataIndex: 'patientName',
            scopedSlots: { customRender: 'patientName' },
            align: 'center',
            width: '100px'
          },
          {
            title: '身份证号',
            dataIndex: 'card',
            width: '160px',
          },
          {
            title: '联系电话',
            dataIndex: 'telephone',
            width: '120px',
          },
          {
            title: '创建日期',
            dataIndex: 'createDate',
            customRender: createDate => moment(createDate).format('YYYY-MM-DD'),
            width: '120px'
          },
          {
            title: '到期时间',
            dataIndex: 'planDate',
            customRender: planDate => moment(planDate).format('YYYY-MM-DD'),
            width: '120px',
          },
          {
            title: '任务状态',
            dataIndex: 'executeStatus',
            scopedSlots: { customRender: 'executeStatus' },
            width: '110px',
          },
          {
            title: '操作',
            width: '100px',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return getVisitTask(Object.assign(parameter, this.queryParam)).then(res => {
            return res;
          });
        },

        selectedRowKeys: [],
        selectedRows: [],
        scroll: false,
        dateArr: [],
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
        }
      };
    },
    created() {
      this.scroll = {
        y: (window.screen.height - 368) + "px"
      }
    },
    filters: {
      executeStatusFilter(type) {
        return executeStatusMap[type].text;
      },
      executeStatusTypeFilter(type) {
        return executeStatusMap[type].status;
      }
    },
    methods: {
      clearForm() {
        this.queryParam = {}
        this.dateArr = []
      },
      refreshTable() {
        this.advanced = false;
        this.$refs.table.refresh();
      },
      changeTime(time) {
        this.dateArr = time;
        this.queryParam.createDateStart = moment(time[0]).format('YYYY-MM-DD');
        this.queryParam.createDateEnd = moment(time[1]).format('YYYY-MM-DD');
      },
      tableSearch(type) {
        const keyWord = {
          "queryType": type
        }
        this.$refs.table.search(keyWord);
        this.advanced = false;
      },
      showUser(record) {
        this.$refs.detailModal.show(record);
      },
      implement(record) {
        //执行
        this.$router.push('/list/task/' + record.patientBasisId)
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      }
    }
  };
</script>
<style lang="less" scoped>
  //   /deep/.ant-table td {
  //     white-space: nowrap;
  //   }

  //   .warningColor {
  //     font-size: 20px;
  //     color: #eb352d;
  //   }

  //   .approachColor {
  //     font-size: 20px;
  //     color: #f7b430;
  //   }

  //   .safeColor {
  //     font-size: 20px;
  //     color: #23ac3a;
  //   }

  //   .progressTag {
  //     display: inline-block;
  //     width: 140px;

  //     /deep/ .progressTagContent {
  //       display: inline-block;
  //       width: 100px;
  //       margin-right: 5px;
  //     }

  //     /deep/ .progressTagTitle {
  //       padding-left: 40px;
  //       margin-bottom: 2px;
  //     }

  //     /deep/ .progressTag .anticon {
  //       color: #4bc5ac;
  //       font-size: 18px;
  //       vertical-align: bottom;
  //     }

  //     /deep/ .ant-progress-inner {
  //       background-color: #e5f6ff;
  //     }

  //     /deep/ .progressTag .ant-progress-span {
  //       color: rgb(0, 160, 233);
  //     }
  //   }

  /deep/.table-page-search-wrapper .ant-form-inline .ant-form-item {
    margin-bottom: 10px;
  }

  .tableSearch {
    background: #ffffff;
    position: absolute;
    top: 52px;
    box-shadow: 4px 4px 10px #ddd;
    z-index: 100;

    /deep/ .ant-card-body .ant-form-horizontal .ant-form-item > .ant-form-item-label {
      width: 100px !important;
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
</style>