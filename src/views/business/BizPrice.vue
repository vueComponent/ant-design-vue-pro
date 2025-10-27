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

    <a-card :bordered="false">
      <!--搜索框-->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="6" :sm="8">
              <a-form-item label="ID">
                <a-input
                  v-model="queryParam.id"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="上游">
                <a-select
                  v-model="queryParam.upstreamApiConfigId"
                  placeholder="全部"
                  @change="$refs.table.refresh(true)"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option
                    v-for="item in upstreamApiConfigData"
                    :key="item.id"
                    :value="item.id"
                    >{{
                      item.name +
                      "-" +
                      item.companyName
                    }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="业务名称">
                <a-input
                  v-model="queryParam.name"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="运营商">
                <a-select
                  v-model="queryParam.isp"
                  default-value="MOBILE"
                  @change="$refs.table.refresh(true)"
                >
                  <a-select-option value="MOBILE">移动</a-select-option>
                  <a-select-option value="UNICOM">联通</a-select-option>
                  <a-select-option value="TELECOM">电信</a-select-option>
                  <a-select-option value="BROADNET">广电</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="价格分组">
                <a-select
                  v-model="queryParam.priceGroupId"
                  placeholder="全部状态"
                  @change="$refs.table.refresh(true)"
                >
                  <a-select-option
                    v-for="item in businessPriceGroupListData"
                    :key="item.id"
                    :value="item.id"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="上游业务编号">
                <a-input
                  v-model="queryParam.upstreamCode"
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
        :rowKey="(record) => record.id"
        :columns="columnsData"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
        :pagination="pagination"
        :scroll="{ x: 1200 }"
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
            <a @click="addAndEditModel()"><a-icon type="plus-square" /> 添加业务</a>
            <a-divider type="vertical" />
            <!--修改结算周期-->
            <a @click="modifySettlePeriodModel"><a-icon type="edit" /> 修改结算周期</a>
            <a-divider type="vertical" />
            <a @click="modifyUpstreamPriceModel"><a-icon type="edit" /> 修改上游价格</a>
            <a-divider type="vertical" />
            <a @click="globalPriceModel"><a-icon type="tool" /> 全局抽成配置</a>
            <a-divider type="vertical" />
            <a @click="referrerCutSaveModel"><a-icon type="tool" /> 推荐人抽成配置</a>
            <a-divider type="vertical" />
            <a @click="modifyDeductModel"><a-icon type="edit" /> 修改抽成</a>
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
        <span slot="name" slot-scope="text, record">
          {{ text }}
        </span>
        <!--上游-->
        <span slot="upstreamApiConfig.name" slot-scope="text, record">
          <div>
            {{ text + '-' + record.upstreamApiConfig.companyName }}
          </div>
          <div style="color: blue;">
            {{ (record.upstreamCode || "--") + " / " + (record.upstreamName || "--") }}
          </div>
        </span>
        <!-- 结算周期 -->
        <span slot="bizSettlePeriod.bossPeriod" slot-scope="text, record">
          {{ bizSettlePeriodName(text) }}
        </span>
        <!-- 用户结算周期 -->
        <span slot="bizSettlePeriod.userPeriod" slot-scope="text, record">
          {{ bizSettlePeriodName(text) }}
        </span>
        <!-- 计费方式-->
        <span slot="billingType" slot-scope="text, record">
          <span v-if="record.billingType === 'DAY95AVG'">日95</span>
          <span v-if="record.billingType === 'BUYOUT'">买断</span>
          <span v-if="record.billingType === 'GUARANTEED'"
            >保底 ({{ record.guaranteedRate + "%" }})</span
          >
        </span>
        <span slot="bossSettlementPeriodName" slot-scope="text, record">
          {{ text + " | " + record.userSettlementPeriodName }}
        </span>
        <!-- 更新时间 -->
        <span slot="updatedAt" slot-scope="text">{{ text !== null ? text : "--" }}</span>
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="addAndEditModel(record)">编辑</a>
          </template>
        </span>
      </s-table>
      <create-form
        ref="createModal"
        :visible="visible"
        :model="model"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <!--全局抽成配置-->
      <a-modal
        :visible="globalPriceVisible"
        :width="680"
        :dialog-style="{ top: '30px' }"
        title="全局抽成配置"
        :footer="null"
        @cancel="globalPriceHandleCancel"
      >
        <!--表单 并将表单的值绑定到this.from-->
        <a-form
          :form="globalPriceForm"
          v-bind="{
            labelCol: { xs: { span: 24 }, sm: { span: 5 } },
            wrapperCol: { xs: { span: 24 }, sm: { span: 17 } },
          }"
        >
          <a-row :gutter="[8]">
            <a-table
              :columns="globalPriceColumns"
              :data-source="globalPriceData"
              size="small"
            >
              <span slot="deductPrice" slot-scope="text, record">
                <a-input
                  type="number"
                  min="0"
                  :value="text"
                  @blur="globalPriceSave($event, 'deductPrice', record)"
                />
              </span>
              <span slot="deductFlow" slot-scope="text, record">
                <a-input
                  type="number"
                  min="0"
                  :value="text"
                  @blur="globalPriceSave($event, 'deductFlow', record)"
                />
              </span>
            </a-table>
          </a-row>
        </a-form>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from "moment";
// import { mapState } from 'vuex'
import { STable, Ellipsis } from "@/components";
import CreateForm from "@/views/modules/CreateForm";
import CreateInfoModel from "@/views/modules/CreateInfoModel";
import {
  Page,
  Add,
  Edit,
  ModifyDeduct,
  GlobalPriceList,
  GlobalPriceSave,
  ReferrerCutSave,
  GetReferrerCut,
  ModifyUpstreamPrice,
  SettlementPeriodEnumList
} from "@/api/business/list";
// 引入周期结算
import { SaveOrUpdateBatch } from "@/api/business/price";

// 引入业务管理里的价格分组
import { List as BusinessPriceGroupList } from "@/api/business/priceGroup";
import { timeStampToFormatDate } from "@/utils/timeUtil";
// 引入上游api配置
import { List as UpstreamApiConfigList } from "@/api/upstream/apiConfig";
import { multi } from "@/utils/operationUtil";

import { handlerResult, isPageResult } from "@/api/handlerResult";
// 表格字段，checked是否显示
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: "80px",
    checked: true,
  },
  {
    title: "业务名称",
    dataIndex: "name",
    scopedSlots: { customRender: "name" },
    checked: true,
  },
  {
    title: "上游公司/业务",
    dataIndex: "upstreamApiConfig.name",
    scopedSlots: { customRender: "upstreamApiConfig.name" },
     width: "160px",
    checked: true,
  },
  {
    title: "上游价格",
    dataIndex: "businessUpstreamPrice.price",
    checked: true,
    width: "100px",
  },
  {
    title: "价格分组",
    dataIndex: "priceGroupName",
    checked: true,
  },
  {
    title: "boss结算周期",
    dataIndex: "bizSettlePeriod.bossPeriod",
    scopedSlots: { customRender: "bizSettlePeriod.bossPeriod" },
    checked: true,
  },
  {
    title: "用户结算周期",
    dataIndex: "bizSettlePeriod.userPeriod",
    scopedSlots: { customRender: "bizSettlePeriod.userPeriod" },
    checked: true,
  },
  {
    title: "运营商",
    dataIndex: "ispName",
    checked: true,
  },
  {
    title: "单价抽成",
    dataIndex: "businessPrice.deductPrice",
    checked: true,
    width: "100px",
  },
  {
    title: "流量抽成%",
    dataIndex: "businessPrice.deductFlow",
    checked: true,
    width: "100px",
  },
  {
    title: "计费方式",
    dataIndex: "billingType",
    scopedSlots: { customRender: "billingType" },
    checked: true,
    width: "80px",
  },
  {
    title: "BOSS/会员结算周期",
    dataIndex: "bossSettlementPeriodName",
    scopedSlots: { customRender: "bossSettlementPeriodName" },
    checked: true,
  },
  {
    title: "备注",
    dataIndex: "notes",
    checked: true,
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    checked: false,
    width: "150px",
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    scopedSlots: { customRender: "updatedAt" },
    checked: false,
    width: "150px",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: "50px",
    scopedSlots: { customRender: "action" },
    fixed: "right",
    checked: true,
  },
];

// 全局抽成配置列表字段
const globalPriceColumns = [
  {
    title: "用户类型",
    dataIndex: "userTypeName",
    key: "userTypeName",
    scopedSlots: { customRender: "userTypeName" },
  },
  {
    title: "运营商",
    dataIndex: "ispName",
    key: "ispName",
    scopedSlots: { customRender: "ispName" },
  },
  {
    title: "单价抽成/元",
    dataIndex: "deductPrice",
    key: "deductPrice",
    scopedSlots: { customRender: "deductPrice" },
  },
  {
    title: "流量抽成%(百分比)",
    dataIndex: "deductFlow",
    key: "deductFlow",
    scopedSlots: { customRender: "deductFlow" },
  },
];
// 表格拦数据 localStorage名称，保证每个页面都是唯一的
const columnslocalStorage = "BusinessListColumns21";

export default {
  name: "UserList",
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
        if(this.queryParam.priceGroupId === undefined) {
          return
        }
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
      moment,
      visible: false,
      model: null,
      timeStampToFormatDate,
      // 业务价格分组数据
      businessPriceGroupListData: [],
      // 保持绑定上游业务选择的对象
      upstreamBusiness: null,
      // 全局抽成配置表格字段
      globalPriceColumns,
      // 显示全局抽成配置弹窗
      globalPriceVisible: false,
      // 全局抽成配置数据
      globalPriceData: [],
      // 推荐人抽成对象
      referrerCutObj: null,
      // 上游公司api配置数据
      upstreamApiConfigData: [],
      multi
    };
  },
  // el 创建前
  beforeCreate() {
    // 创建表单
    this.globalPriceForm = this.$form.createForm(this);
  },
  created() {
    // 初始化表格列数据
    this.initColumnsData();
    this.init();
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
    // 初始化
    init() {
      this.queryParam = { isp: "MOBILE" };
      this.businessPriceGroupList();
      this.getReferrerCut();
      this.upstreamApiConfigList();
      // console.log("init");
    },
    // 刷新
    refresh() {
      this.pageShow = false;
      this.$nextTick(async function () {
        // 设置起始和结束时间
        this.pageShow = true;
        this.selectedRowKeys = [];
        this.selectedRows = [];
        this.init();
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
     * 弹窗关闭
     */
    handleCancel() {
      this.visible = false;
    },
    /**
     * 弹窗确定
     */
    handleOk() {
      const form = this.$refs.createModal.form;
      form.validateFields(async (errors, values) => {
        if (!errors) {
          if (values.method === "add") {
            // 添加
            Add(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.method === "edit") {
            // 编辑
            Edit(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.method === "modifyDeduct") {
            // 修改价格
            const ids = [];
            // 遍历选中的行
            this.selectedRows.map((item) => {
              // 获取id，添加到id数组中
              ids.push(item.id);
            });
            var param = new URLSearchParams();
            param.append("ids[]", ids);
            param.append("isp", this.queryParam.isp);
            param.append("priceGroupId", this.queryParam.priceGroupId);
            // 遍历values键和值
            for (const key in values) {
              // 添加到url参数
              param.append(key, values[key] === undefined ? "" : values[key]);
            }
            // 编辑
            ModifyDeduct(param).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.method === "modifyUpstreamPrice") {
            // 修改价格
            const ids = [];
            // 遍历选中的行
            this.selectedRows.map((item) => {
              // 获取id，添加到id数组中
              ids.push(item.id);
            });
            var param = new URLSearchParams();
            param.append("ids[]", ids);
            param.append("isp", this.queryParam.isp);
            // 遍历values键和值
            for (const key in values) {
              // 添加到url参数
              param.append(key, values[key] === undefined ? "" : values[key]);
            }
            ModifyUpstreamPrice(param).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.method === "referrerCutSave") {
            // 推荐人流量抽成保存设置
            ReferrerCutSave(values).then((response) => {
              if (handlerResult(response)) {
                // 执行获取推荐人抽成列表
                this.getReferrerCut();
              }
            });
          } else if (values.method === "modifySettlePeriod") {
            /**
             * 保存或更新批量
             */
            // 获取选中id，组装参数
            const data = [];
            // 遍历选中的行
            this.selectedRows.map((item) => {
              // 组装参数
              data.push({
                bizId: item.id,
                groupId: this.queryParam.priceGroupId,
                bossPeriod: values.bossPeriod,
                userPeriod: values.userPeriod,
              })
            });

            // 更新
            const res = await SaveOrUpdateBatch(data);
            if (handlerResult(res)) {
              // 刷新表格
              this.$refs.table.refresh();
              this.visible = false;
            }
          }
        }
      });
    },
    /**
     * 获取业务价格分组集合
     */
    async businessPriceGroupList() {
      await BusinessPriceGroupList().then((res) => {
        if (res.code === 0) {
          this.queryParam.priceGroupId = res.result[0].id;
          this.businessPriceGroupListData = res.result;
          // 加载完数据，刷新下表格
          this.$refs.table.refresh();
        }
      });
    },
    /**
     * 修改业务价格
     * @param {*} event
     * @param {*} record
     * @param {*} mode 要更改的字段，加方括号可以做对象的key
     */
    modifyBusinessPrice(event, record, mode) {
      if (event.target.value.length === 0) {
        this.$message.error("不能为空");
        return;
      }
      // 判断值是否相等，字符串数组和数字判断不能全等
      if (event.target.value == record.businessPrice[mode]) {
        return;
      }
      // 执行修改，mode加方括号可以做对象的key
      ModifyBusinessPrice({
        id: record.businessPrice.id,
        [mode]: event.target.value,
      }).then((res) => {
        if (handlerResult(res)) {
          // 刷新表格
          this.$refs.table.refresh();
        }
      });
    },
    /**
     * 添加或编辑
     * @param {*} record 不传添加，否则编辑
     */
    async addAndEditModel(record) {
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      let options = [];
      this.upstreamApiConfigData.forEach((item) => {
        options.push({
          label:
            item.name +
            "-" +
            item.companyName,
          value: item.id,
        });
      });

      // 获取结算周期枚举
      const res = await SettlementPeriodEnumList();
      this.model = {
        title: record ? "编辑" : "添加",
        where: {
          // 是否显示
          notVshow: record ? false : true,
          label: "ID",
          decorator: ["id", { initialValue: record ? record.id : null }],
        },
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: record ? "edit" : "add" }],
              },
            ],
          },
          {
            label: "上游",
            notVif: record,
            item: [
              {
                formType: "select",
                col: 24,
                options: options,
                decorator: [
                  "upstreamApiConfigId",
                  {
                    initialValue: record ? record.upstreamApiConfigId : undefined,
                    rules: [{ required: true, message: "请选择" }],
                  },
                ],
              },
            ],
          },
          {
            label: "业务名称",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入业务名称",
                decorator: [
                  "name",
                  {
                    initialValue: record ? record.name : "",
                    rules: [{ required: true, message: "业务名称不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "设备类型",
            notVif: record,
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: [
                  { label: 'X86', value: 'X86' },
                  { label: '盒子', value: 'BOX' },
                ],
                decorator: [
                  "deviceType",
                  {
                    initialValue: record ? record.deviceType : 'X86',
                  },
                ],
              },
            ],
          },
          {
            label: "计费方式",
            notVif: record,
            item: [
              {
                formType: "select",
                col: 24,
                options: [
                  { label: "日95", value: "DAY95AVG" },
                  { label: "买断", value: "BUYOUT" },
                  { label: "保底", value: "GUARANTEED" },
                ],
                decorator: [
                  "billingType",
                  {
                    initialValue: record ? record.billingType : "DAY95AVG",
                    rules: [{ required: true, message: "网络类型不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "保底率%",
            notVif: record,
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "计费方式为保底，不为空",
                decorator: [
                  "guaranteedRate",
                  {
                    initialValue: record ? record.guaranteedRate : undefined,
                  },
                ],
              },
            ],
          },
          {
            label: "是否有需求",
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: [
                  { label: "是", value: 1 },
                  { label: "否", value: 0 },
                ],
                decorator: [
                  "demand",
                  {
                    initialValue: record ? record.demand : 1,
                  },
                ],
              },
            ],
          },
          {
            label: "异网调度",
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: [
                  { label: "不支持", value: 0 },
                  { label: "支持", value: 1 },
                ],
                decorator: [
                  "crossIspSchedule",
                  {
                    initialValue: record ? record.crossIspSchedule : 0,
                  },
                ],
              },
            ],
          },
          {
            label: "跨省调度",
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: [
                  { label: "不支持", value: 0 },
                  { label: "支持", value: 1 },
                  { label: "默认支持", value: 2 },
                ],
                decorator: [
                  "transProvSchedule",
                  {
                    initialValue: record ? record.transProvSchedule : 0,
                  },
                ],
              },
            ],
          },
          {
            label: "ipv6调度",
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: [
                  { label: "不支持", value: 0 },
                  { label: "支持", value: 1 },
                ],
                decorator: [
                  "ipv6Schedule",
                  {
                    initialValue: record ? record.ipv6Schedule : 0,
                  },
                ],
              },
            ],
          },
          {
            label: "调度时段",
            help: "默认不设置为全天调度",
            item: [
              {
                formType: "select",
                mode: "tags",
                col: 24,
                options: [
                  { label: "全天调度", value: 'ALL_DAY' },
                  { label: "午晚高峰", value: 'NOON_EVENING' },
                  { label: "晚高峰", value: 'EVENING' },
                ],
                decorator: [
                  "periodSchedule",
                  {
                    initialValue: record ? record.periodScheduleArray : [],
                  },
                ],
              },
            ],
          },
          {
            label: "上行带宽限制",
            help: "格式：可以填100或100-50(前面限制最小值100M，后面50的倍数，上报带宽必须50倍数)，设置100不校验倍数，为空不做任何限制",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "上行带宽最小值,为空不限制",
                decorator: [
                  "minUsbw",
                  {
                    initialValue: record ? record.minUsbw : undefined,
                  },
                ],
              },
            ],
          },
          {
            label: "BOSS结算周期",
            item: [
              {
                formType: "select",
                col: 24,
                options: res.result,
                placeholder: "BOSS结算周期不能为空",
                decorator: [
                  "bossSettlementPeriod",
                  {
                    initialValue: record ? record.bossSettlementPeriod : undefined,
                    rules: [{ required: true, message: "BOSS结算周期不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "会员结算周期",
            item: [
              {
                formType: "select",
                col: 24,
                options: res.result,
                placeholder: "会员结算周期不能为空",
                decorator: [
                  "userSettlementPeriod",
                  {
                    initialValue: record ? record.userSettlementPeriod : undefined,
                    rules: [{ required: true, message: "会员结算周期不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "上游业务编号",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入上游业务编号",
                decorator: [
                  "upstreamCode",
                  {
                    initialValue: record ? record.upstreamCode : "",
                  },
                ],
              },
            ],
          },
          {
            label: "上游业务编号",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入上游业务名称",
                decorator: [
                  "upstreamName",
                  {
                    initialValue: record ? record.upstreamName : "",
                  },
                ],
              },
            ],
          },
          {
            label: "备注",
            item: [
              {
                formType: "textarea",
                col: 24,
                placeholder: "请输入备注，可以为空",
                decorator: ["notes", { initialValue: record ? record.remark : null }],
              },
            ],
          },
        ],
      };
      this.visible = true;
    },
    /**
     * 修改抽成
     */
    modifyDeductModel() {
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一个,再操作");
        return;
      }
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "修改抽成",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "modifyDeduct" }],
              },
            ],
          },
          {
            label: "价格抽成",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "价格抽成，为空不修改",
                decorator: ["deductPrice"],
              },
            ],
          },
          {
            label: "流量抽成%",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "流量抽成按百分比，为空不修改",
                decorator: ["deductFlow"],
              },
            ],
          },
        ],
      };
    },
    modifySettlePeriodModel() {
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一个,再操作");
        return;
      }
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      // 结算周期数组
      const settlePeriodOptions = [
        {
          label: "日结",
          value: "DAY",
        },
        {
          label: "周结",
          value: "WEEK",
        },
        {
          label: "月结",
          value: "MONTH",
        }
      ];

      this.model = {
        title: "修改结算周期",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "modifySettlePeriod" }],
              },
            ],
          },
          {
            label: "BOSS结算周期",
            // 说明不修改，可以为空
            help: "不修改，可以为空",
            item: [
              {
                formType: "select",
                col: 24,
                placeholder: "不修改，可以为空",
                options: settlePeriodOptions,
                decorator: ["bossPeriod"],
              },
            ],
          },
          {
            label: "用户结算周期",
            // 说明不修改，可以为空
            help: "不修改，可以为空",
            item: [
              {
                formType: "select",
                col: 24,
                placeholder: "不修改，可以为空",
                options: settlePeriodOptions,
                decorator: ["userPeriod"]
              },
            ],
          },
        ],
      };
    },
    /**
     * 修改结算周期
     */
    async modifySettlementPeriodModel() {
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一个,再操作");
        return;
      }
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      // 获取结算周期枚举
      const res = await SettlementPeriodEnumList();
      this.model = {
        title: "修改结算周期",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "modifySettlementPeriod" }],
              },
            ],
          },
          {
            label: "结算周期",
            item: [
              {
                formType: "select",
                col: 24,
                options: res.result,
                placeholder: "结算周期不能为空",
                decorator: [
                  "period",
                  { rules: [{ required: true, message: "结算周期不能为空" }] },
                ],
              },
            ],
          },
        ],
      };
    },
    /**
     * 获取业务全局价格
     */
    async globalPriceList() {
      await GlobalPriceList().then((res) => {
        if (res.code === 0) {
          this.globalPriceData = res.result;
        }
      });
    },
    /**
     * 业务全局价格弹出框
     */
    globalPriceModel() {
      // 获取业务全局价格
      this.globalPriceList();
      // 显示模态框
      this.globalPriceVisible = true;
    },
    /**
     * 业务全局价格模态框取消
     */
    globalPriceHandleCancel() {
      this.globalPriceVisible = false;
    },
    /**
     * 全局价格保存
     * @param {*} event
     * @param {*} key
     * @param {*} record
     */
    globalPriceSave(event, key, record) {
      // 判断值是否为空
      if (event.target.value.length === 0) {
        this.$message.error("抽成不能为空");
        return;
      }
      // 判断值是否一致
      if (Number.parseInt(event.target.value) === record[key]) {
        return;
      }
      // 请求后端保存全局价格
      GlobalPriceSave({
        id: record.id,
        userType: record.userType,
        isp: record.isp,
        [key]: event.target.value,
      }).then((res) => {
        if (handlerResult(res)) {
          this.globalPriceList();
        }
      });
    },
    /**
     * 获取推荐人抽成
     */
    async getReferrerCut() {
      await GetReferrerCut().then((res) => {
        console.log("getReferrerCut");
        this.referrerCutObj = res.result;
      });
    },
    /**
     * 推荐人保存设置弹出层
     */
    referrerCutSaveModel() {
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "推荐人流量抽成",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "referrerCutSave" }],
              },
            ],
          },
          {
            label: "流量抽成",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "流量抽成，为空不修改",
                decorator: [
                  "cut",
                  {
                    initialValue: this.referrerCutObj
                      ? multi(this.referrerCutObj.cut, 100)
                      : "",
                    rules: [{ required: false, message: "请输入流量抽成" }],
                  },
                ],
              },
            ],
          },
        ],
      };
    },
    /**
     * 获取上游接口集合
     */
    async upstreamApiConfigList() {
      // 获取上游接口集合
      await UpstreamApiConfigList().then((res) => {
        if (res.code === 0) {
          // 赋值
          console.log("upstreamApiConfigList");
          this.upstreamApiConfigData = res.result;
        }
      });
    },
    /**
     * 修改上游价格
     */
    modifyUpstreamPriceModel() {
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一个,再操作");
        return;
      }
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "修改上游价格",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "modifyUpstreamPrice" }],
              },
            ],
          },
          {
            label: "价格",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "上游价不能为空",
                decorator: ["price"],
              },
            ],
          },
        ],
      };
    },
    /**
     * 结算周期枚举转换名称
     * @param {*} value 枚举值
     * @returns 名称
     */
    bizSettlePeriodName(value) {
      if (value === 'DAY') {
        return '日结'
      } else if (value === 'WEEK') {
        return '周结'
      } else if (value === 'MONTH') {
        return '月结'
      } else {
        return '--'
      }
    },

  },
};
</script>
<style></style>
