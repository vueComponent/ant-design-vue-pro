<template>
  <a-row :gutter="24" >
    <a-col :sm="6">
      <a-card :bordered="false">
        <a-spin :spinning="confirmLoading">
          <div class="filterCondition" :style="{height:height}">
            <h4>
              <img src="../../assets/proTitle.png" alt="" />
              入组条件
            </h4>
            <a-checkbox-group @change="onChange" :value="filterCondition">
              <a-row>
                <a-col :span="24" v-for="(item, i) in filterConditionList">
                  <p class="filterConditionItem">
                    <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
                  </p>
                </a-col>
              </a-row>
            </a-checkbox-group>
            <a-button type="primary" block @click="selectfilter">查询</a-button>
          </div>
        </a-spin>
      </a-card>
    </a-col>
    <a-col :sm="18">
      <a-card :bordered="false">
        <div :style="{height:height}">
          <a-row style="margin-bottom: 5px;">
            <a-col :sm="6"><p style="margin-bottom: 0px;" class="queryResults">查询结果</p></a-col>
            <a-col :sm="18" style="text-align:right">
              <a-button type="primary" style="margin-right: 24px;" @click="selectAll">全选</a-button>
              <a-button type="primary" @click="clearSelected">重置</a-button>
            </a-col>
          </a-row>
          <s-table
            style="text:left;"
            ref="table"
            size="small"
            rowKey="patientId"
            :columns="columns"
            :data="loadData"
            :alert="options.alert"
            :rowSelection="options.rowSelection"
            :showPagination="options.showPagination"
            :scroll="options.scroll"
          >
            <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
            <span slot="visit" slot-scope="text"><a-badge :status="text | visitTypeFilter" :text="text | visitFilter" /></span>
            <span slot="description" slot-scope="text">
              <ellipsis :length="8" tooltip>{{ text }}</ellipsis>
            </span>
          </s-table>
          <a-row style="margin-top: 20px;">
            <a-col :sm="6">
              <p>
                共{{ this.total }}个,已添加
                <span>{{ this.selectedRowKeys.length }}</span>
                个
              </p>
            </a-col>
            <a-col :sm="18" style="text-align:right">
              <a-button type="default" style="margin-right: 24px;" @click="goGroup">取消</a-button>
              <a-button type="primary" @click="addProject">添加</a-button>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
import moment from 'moment';
import { STable, Ellipsis } from '@/components';
import { getDatalList, getPatientList, joinProject } from '@/api/group';
import { getDictionaryAttributeByDictionaryId } from '@/api/basis';
import UserDetail from '../list/modules/UserDetail';
import Drawer from './modules/Drawer';
import _ from 'lodash';

const visitMap = {
  0: {
    status: 'default',
    text: '死亡'
  },
  1: {
    status: 'processing',
    text: '跟踪'
  },
  2: {
    status: 'success',
    text: '完成'
  },
  3: {
    status: 'error',
    text: '失访'
  },
  4: {
    status: "warning",
    text: "警告"
  }
};

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    UserDetail,
    Drawer
  },
  data() {
    return {
      mdl: {},
      total: 0,
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      projectId: '',
      // 表头
      columns: [
        {
          title: '档案号',
          dataIndex: 'code',
          width: '120px',
        },
        {
          title: '患者姓名',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: '140px',
        },
        {
          title: '身份证号',
          dataIndex: 'card',
          width: '220px',
        },
        {
          title: '创建日期',
          dataIndex: 'createDate',
          customRender: createDate => moment(createDate).format('YYYY-MM-DD HH:mm:ss'),
          width: '200px',
        },
        {
          title: '访视状态',
          dataIndex: 'visit',
          scopedSlots: { customRender: 'visit' },
          width: '150px',
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        parameter.pageSize = 1000;
        this.queryParam.projectId = this.project.projectId;
        this.queryParam.flag = 1;
        return getPatientList(Object.assign(parameter, this.queryParam)).then(res => {
          this.total = res.data.length;
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
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
        },
        showPagination: false,
        scroll: false
      },
      optionAlertShow: false,
      filterConditionList: [],
      filterCondition: [],
      height:(window.screen.height-270)+"px"
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
    this.options.scroll={
     y:(window.screen.height-400)+"px"
    }
    var that = this;
    const dictionary1 = new URLSearchParams();
    dictionary1.append('dictionaryId', 6);
    dictionary1.append('status', 1);
    this.confirmLoading = true;
    getDictionaryAttributeByDictionaryId(dictionary1).then(res => {
      that.filterConditionList = _.map(res.data, function(v) {
        return {
          label: v.name,
          value: v.dictionaryAttributeId
        };
      });
      _.forEach(that.filterConditionList, function(item) {
        that.filterCondition.push(item.value);
      });
      console.log('this.$route.query.id', that.$route.query.patientId);
      that.confirmLoading = false;
      // });
    });
  },
  mounted() {
    
  },
  methods: {
    onChange(checkedValues) {
      this.filterCondition = checkedValues;
    },
    selectfilter() {
      const key = {
        // filterCondition: this.filterCondition.join(',')
      };
      console.log('key', key);
      this.$refs.table.search(key);
      this.$refs.table.clearSelected();
    },
    goGroup() {
      this.$router.push({ path: '/group/index' });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    addProject() {
      var that = this;
      this.$confirm({
        title: '提示',
        content: '确认添加患者至该项目',
        onOk() {
          if (!that.project.projectId) {
            that.$message.error("请选择项目！")
            that.$router.push({path:'/group/index'})
            return;
          }
          const params = new URLSearchParams();
          params.append('patientArray', that.selectedRowKeys);
          params.append('projectId', that.project.projectId);
          that.confirmLoading = true;
          
          joinProject(params).then(res => {
            if(res.code==0){
                that.$router.push({path:'/group/index'})
            }
            that.confirmLoading = false;
          });
        },
        onCancel() {}
      });

      // console.log(this.selectedRowKeys);
    },
    selectAll() {
      this.$refs.table.selectAll();
    },
    clearSelected() {
      this.$refs.table.clearSelected();
    }
  }
};
</script>
<style lang="less" scoped>
.filterCondition {
  h4 {
    border-bottom: 1px solid #dddddd;
    img {
      width: 65px;
      vertical-align: middle;
    }
    font-size: 20px;
  }
  .filterConditionItem {
    margin: 20px 0;
  }
}
.queryResults {
  color: #1990fe;
  border-left: 10px solid #1990fe;
  padding-left: 20px;
  font-size: 18px;
}
</style>
