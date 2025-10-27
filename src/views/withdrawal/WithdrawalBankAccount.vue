<template>
  <page-header-wrapper v-if="pageShow">
    <template v-slot:extra>
      <a-tooltip title="刷新页面">
        <a-icon
          type="reload"
          style="font-size: 24px; cursor: pointer; color: #151515"
          @click="refresh"
        />
      </a-tooltip>
    </template>
    <template v-slot:content>
      <!--1. 微信佣金提现功能，在微信支付商户平台-产品中心，开通付款到零钱。<br />-->
    </template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="16">
            <!-- 用户ID -->
            <a-col :md="6" :sm="8">
              <a-form-item label="用户ID">
                <a-input
                  v-model="queryParam.userId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>

            <!-- BOSS高级版ID -->
            <a-col :md="6" :sm="8">
              <a-form-item label="BOSS高级版ID">
                <a-input
                  v-model="queryParam.bossAdvancedId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>

            <!-- 账号类型 -->
            <a-col :md="6" :sm="8">
              <a-form-item label="账号类型">
                <a-select
                  v-model="queryParam.accountType"
                  placeholder="请选择账号类型"
                  default-value=""
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">个人</a-select-option>
                  <a-select-option value="1">企业</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <!-- 持卡人姓名 / 企业名称 -->
            <a-col :md="6" :sm="8">
              <a-form-item label="持卡人/企业名称">
                <a-input
                  v-model="queryParam.holderName"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>

            <!-- 银行卡号 -->
            <a-col :md="6" :sm="8">
              <a-form-item label="银行卡号">
                <a-input
                  v-model="queryParam.bankCardNumber"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>

            <!-- 身份证号 -->
            <a-col :md="6" :sm="8">
              <a-form-item label="身份证号">
                <a-input
                  v-model="queryParam.idCardNumber"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>

            <!-- 预留手机号 -->
            <a-col :md="6" :sm="8">
              <a-form-item label="银行预留手机号">
                <a-input
                  v-model="queryParam.reservedPhone"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>

            <!-- 银行名称 -->
            <a-col :md="6" :sm="8">
              <a-form-item label="银行名称">
                <a-input
                  v-model="queryParam.bankName"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>

            <!-- 查询与重置按钮 -->
            <a-col :md="6" :sm="8">
              <span
                class="table-page-search-submitButtons"
                style="float: right; overflow: hidden"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)"
                  >查询</a-button
                >
                <a-button style="margin-left: 8px" @click="resetQueryParams"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="middle"
        :showTotal="true"
        :rowKey="(record) => record.id"
        :columns="columnsData.length === 0 ? columns : columnsData"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
        :pagination="pagination"
      >
        <!-- 表头 -->
        <template slot="title">
          <div
            style="
              min-height: 28px;
              line-height: 28px;
              overflow: auto;
              overflow-y: hidden;
              _height: 1%;
            "
            class="table-operator"
          >
            <!-- 筛选列设置 -->
            <a-dropdown style="float: right" v-model="screeVisible">
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="(item, index) in screenColumns"
                  :key="index"
                  @click="saveColumnsLocalStorage(index, item)"
                >
                  <a-checkbox :checked="item.checked">{{ item.title }}</a-checkbox>
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 0px"
                ><a-icon type="profile" /> 筛选列设置 <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </div>
        </template>
        <!-- 表格内容 -->
        <span slot="state" slot-scope="text, record">
          {{ record.stateName }}
          <a-icon
            v-if="record.state === 2"
            type="question-circle"
            :title="record.stateDesc"
          />
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-action:operate>
            <a @click="remove(record)" title="删除"><a-icon type="delete" />删除</a>
          </template>
        </span>
      </s-table>
    </a-card>
    <a-modal
      :visible="accountStateVisible"
      :width="560"
      title="审核"
      @ok="accountStateHandleOk"
      @cancel="accountStateHandleCancel"
    >
      <!--表单 并将表单的值绑定到this.from-->
      <a-form
        :form="accountStateForm"
        v-bind="{
          labelCol: { xs: { span: 24 }, sm: { span: 5 } },
          wrapperCol: { xs: { span: 24 }, sm: { span: 17 } },
        }"
      >
        <!--每一项元素-->
        <a-form-item label="Id">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-input v-decorator="['id']" :disabled="true" />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="类型">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-radio-group
                @change="onChangeAccountState"
                v-decorator="[
                  'state',
                  { initialValue: 1, rules: [{ required: true, message: '不能为空' }] },
                ]"
              >
                <a-radio :value="1"> 通过 </a-radio>
                <a-radio :value="2"> 拒绝 </a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="isStateDescShow" label="拒绝原因">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-input
                v-decorator="[
                  'stateDesc',
                  {
                    rules: [
                      { required: true, message: '不能为空' },
                      { max: 50, message: '不能超过50个字符串' },
                    ],
                  },
                ]"
                placeholder="请输入拒绝原因"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from "moment";
import { STable, Ellipsis } from "@/components";
import CreateForm from "@/views/modules/CreateForm";
import {
  Page,
  Remove
} from "@/api/withdrawal/bankAccount";
import { isPageResult, handlerResult } from "@/api/handlerResult";
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    checked: true,
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    checked: true,
  },
  {
    title: 'BOSS高级版ID',
    dataIndex: 'bossAdvancedId',
    customRender: (text) => (text && text !== null ? text : '--'),
    checked: true,
  },
  {
    title: '账号类型',
    dataIndex: 'accountType',
    customRender: (text) => (text === 0 ? '个人' : text === 1 ? '企业' : '-'),
    checked: true,
  },
  {
    title: '持卡人/企业名称',
    dataIndex: 'holderName',
    checked: true,
  },
  {
    title: '银行名称',
    dataIndex: 'bankName',
    checked: true,
  },
  {
    title: '银行卡类型',
    dataIndex: 'bankCardType',
    checked: true,
  },
  {
    title: '银行卡号',
    dataIndex: 'bankCardNumber',
    checked: true,
  },
  {
    title: '身份证号',
    dataIndex: 'idCardNumber',
    checked: true,
  },
  {
    title: '银行预留手机号',
    dataIndex: 'reservedPhone',
    checked: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    checked: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '120px',
    scopedSlots: { customRender: 'action' },
    checked: true,
  },
];
const columns2 = [
  {
    title: "提现类型",
    dataIndex: "typeName",
    key: "typeName",
    width: "180px",
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    slots: { title: "name" },
    scopedSlots: { customRender: "name" },
  },
  {
    title: "显示",
    dataIndex: "state",
    key: "state",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "state" },
  },
  {
    title: "操作人",
    dataIndex: "operatorName",
    key: "operatorName",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "operatorName" },
  },
  {
    title: "操作",
    key: "action",
    width: "60px",
    scopedSlots: { customRender: "action" },
  },
];
// 表格拦数据 localStorage名称
const columnsLocalStorage = "WithdrawAccountColumns3";

export default {
  name: "UserList",
  components: {
    STable,
    Ellipsis,
    CreateForm,
  },
  // el 创建前
  beforeCreate() {
    this.accountStateForm = this.$form.createForm(this);
  },
  data() {
    this.columns = columns;
    return {
      // 页面是否显示
      pageShow: true,
      /**
       * 表格
       */
      // 分页数组
      pagination: {
        pageSizeOptions: ["10", "30", "50", "70", "100", "150", "200"],
        showTotal: (total) => `共 ${total} 条数据`,
      },
      // 表格栏数据对象
      columnsData: [],
      // 筛选列设置数据对象，其他
      screenColumns:
        localStorage.getItem(columnsLocalStorage) === null
          ? columns
          : JSON.parse(localStorage.getItem(columnsLocalStorage)),
      // 筛选列设置
      screeVisible: false,

      /**
       * 查询
       */
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        // 每次加载删除选择中值
        this.selectedRowKeys = [];
        this.selectedRows = [];
        if (this.queryParam.type === "") {
          delete this.queryParam.type;
        }
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return Page(requestParameters).then((res) => {
          if (isPageResult(res)) {
            return res.result;
          }
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      moment,
      columns2,
      accountStateVisible: false,
      isStateDescShow: false,
    };
  },
  filters: {
    /*
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
    */
  },
  created() {
    // 设置表格栏数据
    this.setColumnsData();
    this.orgList();
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  methods: {
    // 刷新
    refresh() {
      this.pageShow = false;
      this.$nextTick(function () {
        this.pageShow = true;
      });
    },
    // 设置表格栏数据对象
    setColumnsData() {
      var dataNew = [];
      for (var i = 0; i < this.screenColumns.length; i++) {
        if (this.screenColumns[i].checked) {
          dataNew.push(this.screenColumns[i]);
        }
      }
      this.columnsData = dataNew;
    },
    // 保存表格栏数据对象到localStorage
    saveColumnsLocalStorage(index, item) {
      var staticData = item;
      staticData.checked = !item.checked;
      this.columns[index] = staticData;
      var dataNew = [];
      for (var i = 0; i < this.columns.length; i++) {
        if (this.columns[i].checked) {
          dataNew.push(this.columns[i]);
        }
      }
      localStorage.setItem(columnsLocalStorage, JSON.stringify(this.columns));
      this.columnsData = dataNew;
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    /**
     * 查询展开收起
     */
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 删除
    remove(record) {
      const self = this;
      this.$confirm({
        title: "您确定要删除?",
        content: (h) => <div style="color:red;">正在删除：{record.id}</div>,
        onOk() {
          return new Promise((resolve) => {
            Remove(record.id)
              .then((response) => {
                if (handlerResult(response)) {
                  // 刷新表格
                  self.$refs.table.refresh();
                }
              })
              .catch((err) => {
                self.$message.error(err + "");
              })
              .finally(() => {
                resolve();
              });
          });
        },
        class: "test",
      });
    },
    /**
     * 状态审核显示
     */
    modifyAccountStateShow(record) {
      this.accountStateForm.resetFields(); // 清除表单
      setTimeout(() => {
        this.accountStateForm.setFieldsValue({ id: record.id });
        this.accountStateForm.setFieldsValue({ stateDesc: record.stateDesc });
      }, 300);
      this.accountStateVisible = true;
    },
    /**
     * 状态审核关闭
     */
    accountStateHandleCancel() {
      this.accountStateVisible = false;
    },
    /**
     * 点击审核状态
     */
    onChangeAccountState(e) {
      if (e.target.value === 2) {
        this.isStateDescShow = true;
      } else {
        this.isStateDescShow = false;
      }
    },
    /**
     * 审核状态操作
     */
    accountStateHandleOk() {
      this.accountStateForm.validateFields((errors, values) => {
        if (!errors) {
          ModifyAccountState(values).then((res) => {
            if (handlerResult(res)) {
              this.accountStateVisible = false;
              // 刷新表格
              this.$refs.table.refresh();
            }
          });
        }
      });
    },
  },
};
</script>
@/api/withdraw/bankAccount