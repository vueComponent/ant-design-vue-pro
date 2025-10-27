<template v-slot:content>
  <page-header-wrapper v-if="pageShow">
    <!--页头-->
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
      说明：个人认证通过接口自动认证，企业认证需要人工审核。<br />
    </template>
    <a-card :bordered="false">
      <!--搜索框-->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="6" :sm="8">
              <a-form-item label="用户ID">
                <a-input
                  v-model="queryParam.userId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="实名类型">
                <a-select v-model="queryParam.authType" placeholder="全部">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">个人</a-select-option>
                  <a-select-option value="1">企业</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="认证状态">
                <a-select v-model="queryParam.authStatus" placeholder="全部">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">已认证</a-select-option>
                  <a-select-option value="2">待审核</a-select-option>
                  <a-select-option value="0">认证失败</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="个人/法人姓名">
                <a-input
                  v-model="queryParam.legalName"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="身份证">
                <a-input
                  v-model="queryParam.idCardNo"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="企业名称">
                <a-input
                  v-model="queryParam.enterpriseName"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="社会统一编码">
                <a-input
                  v-model="queryParam.unifiedSocialCode"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 6) || 6" :sm="8">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)"
                  >查询</a-button
                >
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})"
                  >重置</a-button
                >
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 表格 -->
      <s-table
        ref="table"
        size="middle"
        :showTotal="true"
        :rowKey="(record) => record.userId"
        :columns="columnsData"
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
            <a @click="onBatchReview()"><a-icon type="edit" /> 批量审核</a>
            <a-divider type="vertical" />
            <a @click="remove()"><a-icon type="delete" /> 批量删除</a>
            <!-- 筛选列设置 -->
            <a-dropdown
              style="float: right"
              v-if="screenColumns.visible"
              v-model="screenColumns.model"
            >
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="(item, index) in screenColumns.data"
                  :key="index"
                  @click="saveScreenColumns(index, item)"
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
        <!-- 表格自定义渲染 -->
        <template slot="bossAdvancedId" slot-scope="text">
          {{ text || "--" }}
        </template>
        <template slot="authType" slot-scope="text">
          <a-tag v-if="text === 0" color="#2db7f5">个人</a-tag>
          <a-tag v-else color="#f50">企业</a-tag>
        </template>
        <template slot="authStatus" slot-scope="text">
          <a-tag v-if="text === 0" color="pink">认证失败</a-tag>
          <a-tag v-else-if="text === 1" color="green">已认证</a-tag>
          <a-tag v-else color="orange">审核中</a-tag>
        </template>
        <template slot="enterpriseName" slot-scope="text">
          {{ text || "--" }}
        </template>
        <template slot="unifiedSocialCode" slot-scope="text">
          {{ text || "--" }}
        </template>
        <template slot="updatedAt" slot-scope="text">
          {{ text || "--" }}
        </template>
      </s-table>
      <create-form
        ref="createModal"
        :visible="visible"
        :model="model"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
// import { mapState } from 'vuex'
import { STable, Ellipsis } from "@/components";
import CreateForm from "@/views/modules/CreateForm";
import CreateInfoModel from "@/views/modules/CreateInfoModel";
import { Page, BatchRemove, Create, BatchReview } from "@/api/user/userAuth";
import { handlerResult, isPageResult } from "@/api/handlerResult";
// 表格字段，checked是否显示
const columns = [
  {
    title: "用户id",
    dataIndex: "userId",
    checked: true,
  },
  {
    title: "BossId",
    dataIndex: "bossAdvancedId",
    scopedSlots: { customRender: "bossAdvancedId" },
    checked: true,
  },
  {
    title: "实名类型",
    dataIndex: "authType",
    scopedSlots: { customRender: "authType" },
    checked: true,
  },
  {
    title: "认证状态",
    dataIndex: "authStatus",
    scopedSlots: { customRender: "authStatus" },
    checked: true,
  },
  {
    title: "个人/法人姓名",
    dataIndex: "legalName",
    checked: true,
  },
  {
    title: "身份证",
    dataIndex: "idCardNo",
    checked: true,
  },
  {
    title: "企业名称",
    dataIndex: "enterpriseName",
    scopedSlots: { customRender: "enterpriseName" },
    checked: true,
  },
  {
    title: "社会统一编码",
    dataIndex: "unifiedSocialCode",
    scopedSlots: { customRender: "unifiedSocialCode" },
    checked: true,
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    checked: true,
    width: "150px",
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    scopedSlots: { customRender: "updatedAt" },
    checked: false,
    width: "150px",
  },
];

// 表格拦数据 localStorage名称，保证每个页面都是唯一的
const columnslocalStorage = "BusinessCategoryColumns3";

export default {
  name: "BusinessCategory",
  components: {
    STable,
    Ellipsis,
    CreateForm,
    CreateInfoModel,
  },
  data() {
    // 表格列的配置
    this.columns = columns;
    return {
      // 页面是否显示
      pageShow: true,
      // 分页数组
      pagination: {
        pageSizeOptions: ["10", "30", "50", "70", "100", "150", "200"],
        showTotal: (total) => `共 ${total} 条数据`,
      },
      // 使用的表格栏数据
      columnsData: [],
      // 筛选列对象,data=数据,visible=是否显示筛选列(如果不显示，使用columns显示全部表格数据),model=菜单是否显示
      screenColumns: { data: [], visible: true, model: false },
      // 搜索 展开/收起
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        // 每次加载删除选择中值
        this.selectedRowKeys = [];
        this.selectedRows = [];
        // 分页请求参数
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        // 分页
        return Page(requestParameters).then((res) => {
          if (isPageResult(res)) {
            // return {"pageNo": 1,"pageSize": 10,"totalCount": 0,"totalPage": 0,"data": [ ]}
            return res.result;
          }
        });
      },
      // 选中项的 key 数组
      selectedRowKeys: [],
      // 选中项数组添加到 selectedRows 中
      selectedRows: [],
      visible: false,
      model: null,
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
  // el 创建前
  beforeCreate() {
    // 创建表单
    this.form = this.$form.createForm(this);
    // 创建工单类型管理表单
    this.ticketTypeForm = this.$form.createForm(this);
  },
  created() {
    this.queryParam = {};
    // 初始化表格列数据
    this.initColumnsData();
  },
  computed: {
    // 表格选择功能的配置
    rowSelection() {
      return {
        // 指定选中项的 key 数组，需要和 onChange 进行配合
        selectedRowKeys: this.selectedRowKeys,
        // 选中项发生变化时的回调
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
        this.selectedRowKeys = [];
        this.selectedRows = [];
        // this.queryParam = {}
        // 设置起始和结束时间
        this.queryParam = {};
      });
    },
    /**
     * @description: 表格选中状态改变执行
     * @param {*}
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      // 设置选中k值
      this.selectedRowKeys = selectedRowKeys;
      // 设置选中行数据
      this.selectedRows = selectedRows;
    },
    /**
     * 搜索展开收起切换
     */
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    /**
     * 初始化表格列数据
     */
    initColumnsData() {
      this.screenColumns.data =
        localStorage.getItem(columnslocalStorage) === null
          ? columns
          : JSON.parse(localStorage.getItem(columnslocalStorage));
      // 获取表格列数据
      const createColumnsData = this.createColumnsData(this.screenColumns.data);
      // 判断是否使用筛选列功能，真使用，假不使用
      this.columnsData = this.screenColumns.visible ? createColumnsData : columns;
    },
    /**
     *  保存表格栏数据到localStorage，并且把新的数据赋值给columnsData
     * @param {*} index 索引
     * @param {*} item 列对象
     */
    saveScreenColumns(index, item) {
      // 设置checked值
      item.checked = !item.checked;
      // 筛选列数据赋值给data
      const data = this.screenColumns.data;
      // 设置当选索引表格栏数据
      data[index] = item;
      // 把表格栏数据保存到localStorage中
      localStorage.setItem(columnslocalStorage, JSON.stringify(data));
      // 保存数据后，把更改后的数据重新赋值给columnsData
      this.columnsData = this.createColumnsData(data);
    },
    /**
     * 按筛选列数据checked为真，生成新表格列数据
     * @param {*} screenColumns 筛选列数据
     */
    createColumnsData(screenColumns) {
      var data = [];
      // 遍历筛选列数据
      screenColumns.forEach((item) => {
        // 判断checked为真
        if (item.checked) {
          // 添加到数组里
          data.push(item);
        }
      });
      return data;
    },
    /**
     * 关闭
     */
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      const form = this.$refs.createModal.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log(values);
          // 通过URLSearchParams组装请求参数
          var form1 = new URLSearchParams();
          form1.append("userIds[]", values.userIds);
          form1.append("targetStatus", values.targetStatus);
          form1.append("failedReason", values.failedReason === undefined ? '' : values.failedReason );
          BatchReview(form1).then((response) => {
            if (handlerResult(response)) {
              this.visible = false;
              // 刷新表格
              this.$refs.table.refresh();
            }
          });
        }
      });
    },
    /**
     * 删除
     */
    remove() {
      // 判断必须选中一个
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning("最少选择一个");
        return;
      }
      const userIds = [];
      this.selectedRows.map((item) => {
        userIds.push(item.userId);
      });
      const self = this;
      this.$confirm({
        title: "您确定要删除?",
        content: (h) => (
          <div style="color:red;">正在删除{self.selectedRows.length}条记录</div>
        ),
        onOk() {
          // eslint-disable-next-line promise/param-names
          return new Promise((resilve, reject) => {
            BatchRemove(userIds)
              .then((response) => {
                if (response.code === 0) {
                  self.$message.success("操作成功");
                  // 刷新表格
                  self.$refs.table.refresh();
                } else {
                  self.$message.error(response.message);
                }
              })
              .catch((err) => {
                self.$message.error(err + "");
              })
              .finally(() => {
                resilve();
              });
          });
        },
        class: "test",
      });
    },
    // 点击批量审核
    onBatchReview() {
      // 判断必须选中一个
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning("最少选择一个");
        return;
      }
      const userIds = [];
      this.selectedRows.map((item) => {
        userIds.push(item.userId);
      });

      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "批量编辑",
        where: {
          // 是否显示
          notVshow: true,
          label: "ID",
          decorator: ["userIds", { initialValue: userIds }],
        },
        data: [
          {
            label: "审核状态",
            item: [
              {
                formType: "radio-group",
                col: 24,
                decorator: ["targetStatus", { initialValue: "SUCCESS" }],
                options: [
                  { label: "通过", value: "SUCCESS" },
                  { label: "失败", value: "FAIL" },
                ],
              },
            ],
          },
          {
            label: "认证失败原因",
            item: [
              {
                formType: "textarea",
                col: 24,
                placeholder: "审核通过可以为空，未通过审核请填写原因",
                decorator: ["failedReason"],
              },
            ],
          },
        ],
      };
    },
  },
};
</script>
