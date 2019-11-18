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
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                更多筛选
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :md="13" class="button-group" :sm="24">
            <span><img v-if="this.projectName" src="../../assets/duigou.png" alt="" /> {{this.projectName}}</span>
            <a-button type="primary" @click="addCaces()">添加病例</a-button>
            <a-button type="primary" @click="checkProject()" style="background: #ff8736;border: none;">选择项目</a-button>
            <!-- <a-button type="primary" style="margin-left: 10px;">导出</a-button> -->
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch(1)">本月新增病例</p>
                    <p @click="tableSearch(2)">本年新增病例</p>
                    <p @click="tableSearch(3)">全部病例</p>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="档案号">
                        <a-input v-model="queryParam.fileCode" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="姓名">
                        <a-input v-model="queryParam.name" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model="queryParam.card" style="width: 100%" />
                      </a-form-item>
                      <a-form-item label="创建日期" style="margin-bottom:0;">
                        <a-range-picker @change="changeTime" style="width: 100%" :value="dateArr" />
                      </a-form-item>
                      <a-form-item style="text-align: right;margin-bottom: 0;margin-top: 15px;">
                        <a-button type="primary" @click="clearForm()">清空</a-button>
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
    <s-table ref="table" size="small" :scroll="scroll" rowKey="patientId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <span slot="name" slot-scope="text,record" @click="showUser(record)">
        <p class="userName">{{text}}</p>
      </span>
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="visit" slot-scope="text">
        <a-badge :status="text | visitTypeFilter" :text="text | visitFilter" /></span>
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
            出组
          </a>
        </template>
      </span>
    </s-table>
    <user-detail ref="detailModal" />
    <drawer :maskClosable="true" ref="drawerModal" @checkedP="checkedP"></drawer>
  </a-card>
</template>
<script>
import moment from 'moment';
import { STable, Ellipsis } from '@/components';
import { getDatalList, getPatientList, deleteCase } from '@/api/group';
import UserDetail from '../list/modules/UserDetail'
import Drawer from './modules/Drawer'

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
  name: 'Group',
  components: {
    STable,
    Ellipsis,
    UserDetail,
    Drawer
  },
  data() {
    return {
      dateArr: [],
      mdl: {},
      bodyStyle: {
        padding: "10px",
        paddingBottom: "0px"
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [{
          title: '档案号',
          dataIndex: 'fileCode',
          width: '200px',
        },
        {
          title: '患者姓名',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: "200px"
        },
        {
          title: '身份证号',
          dataIndex: 'card',
          width: "250px"
        },
        {
          title: '入组日期',
          dataIndex: 'joinDate',
          customRender: joinDate => moment(joinDate).format('YYYY-MM-DD'),
          width: "200px"
        },
        // {
        //   title: '访视状态',
        //   dataIndex: 'visit',
        //   scopedSlots: { customRender: 'visit' },
        //   width: "200px"
        // },
        {
          title: '操作',
          dataIndex: 'action',
          width: '80px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.projectId = this.project.projectId;
        return getPatientList(Object.assign(parameter, this.queryParam)).then(res => {
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      projectName: '',
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
      scroll: false,
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
    this.scroll = {
      y: (window.screen.height - 368) + "px"
    }
  },
  mounted(){
    this.checkProject();
  },
  methods: {
    clearForm() {
      this.queryParam = {}
      this.dateArr = []
    },
    tableSearch(type) {
      const keyWord = {
        "type": type
      }
      this.$refs.table.search(keyWord);
      this.advanced = false;
    },
    refreshTable() {
      this.advanced = false;
      this.$refs.table.refresh();
    },
    showUser(record) {
      this.$refs.detailModal.show(record);
    },
    handleEdit(record) {
      var that = this;
      this.$confirm({
        title: '提示',
        content: '确认将该患者移除项目?',
        onOk() {
          const params = new URLSearchParams();
          params.append('patientId', record.patientId);
          params.append('projectId', that.project.projectId);
          that.confirmLoading = true;
          deleteCase(params).then(res => {
            if (res.code == 0) {
              that.$message.success(res.msg);
              that.$refs.table.refresh();
            }
            that.confirmLoading = false;
          });
        },
        onCancel() {}
      });
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
    addCaces() {
      this.$router.push({ path: '/group/addProject' })
    },
    checkProject() {
      this.$refs.drawerModal.showDrawer();
    },
    checkedP(data) {
      this.project.projectId = data.projectId;
      this.projectName = data.projectName;
      console.log("this.project.projectId", this.project.projectId)
      const key = {
        projectId: data.projectId
      };
      this.$refs.table.search(key)
    },
    changeTime(time) {
      this.dateArr = time;
      this.queryParam.date1 = moment(time[0]).format('YYYY-MM-DD');
      this.queryParam.date2 = moment(time[1]).format('YYYY-MM-DD');
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.table-page-search-wrapper .ant-form-inline .ant-form-item {
  margin-bottom: 10px
}

.tableSearch {
  background: #ffffff;
  position: absolute;
  top: 52px;
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

.userName {
  color: #1FB2FA;
  margin: 0;
}

.userName:active,
.userName:hover {
  text-decoration: underline;
  text-underline-position: under;
  text-decoration-color: #1FB2FA;
  cursor: pointer;
}
.button-group{
  overflow: hidden;
  span{
    float: left;
    color: #1890ff;
    font-size: 18px;
    height: 32px;
    line-height: 32px;
    img{
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-bottom: 3px;
    }
  }
  button{
    float: right;
    margin-right: 10px;
  }
}
</style>