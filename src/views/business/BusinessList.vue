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
            <a-col v-if="advanced" :md="6" :sm="8">
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
        <!--是否启用-->
        <span slot="enabled" slot-scope="text, record">
          <!--使用开关控件-->
          <a-switch v-model="record.enabled" active-value="1" inactive-value="0" @change="() => handleSwitchChange(record, 'enabled')" />
        </span>
        <!--排序-->
        <span slot="sort" slot-scope="text, record">
          <!--使用input修改-->
          <a-input-number style="width: 70px;" v-model="record.sort" :min="0" :max="1000" @blur="() => handleSortChange(record, 'sort')" />
        </span>
        <template slot="crossIspScheduleName" slot-scope="text, record">
          <span v-if="record.crossIspSchedule === 0" style="color: red;font-size: 12px;">{{ text }}</span>
          <span v-else-if="record.crossIspSchedule === 1" style="color: blue;font-size: 12px;">{{
            text
          }}</span>
          <span v-else>--</span>
        </template>
        <template slot="transProvScheduleName" slot-scope="text, record">
          <span v-if="record.transProvSchedule === 0" style="color: red;font-size: 12px;">{{ text }}</span>
          <span v-else-if="record.transProvSchedule === 1" style="color: blue;font-size: 12px;">{{
            text
          }}</span>
          <span v-else-if="record.transProvSchedule === 2" style="color: #0ab844;font-size: 12px;">{{
            text
          }}</span>
          <span v-else>--</span>
        </template>
        <template slot="ipv6ScheduleName" slot-scope="text, record">
          <span v-if="record.ipv6Schedule === 0" style="color: red;font-size: 12px;">{{ text }}</span>
          <span v-else-if="record.ipv6Schedule === 1" style="color: blue;font-size: 12px;">{{
            text
          }}</span>
          <span v-else>--</span>
        </template>
        <!-- 计费方式-->
        <span slot="billingType" slot-scope="text, record">
          <span v-if="record.billingType === 'DAY95AVG'">日95</span>
          <span v-if="record.billingType === 'BUYOUT'">买断</span>
          <span v-if="record.billingType === 'GUARANTEED'"
            >保底 ({{ record.guaranteedRate + "%" }})</span
          >
        </span>
        <span slot="periodScheduleArray" slot-scope="text, record">
          <span v-if="text.length > 0">
            {{  
              text.map((item) => {
                if (item === "ALL_DAY") return "全天";
                if (item === "NOON_EVENING") return "午晚高峰";
                if (item === "EVENING") return "晚高峰";
              }).join(", ")
            }}
          </span>
          <span v-else>--</span>
        </span>
        <span slot="minUsbw" slot-scope="text">
          {{ text || '--' }}
        </span>
        <!-- 更新时间 -->
        <span slot="updatedAt" slot-scope="text">{{ text !== null ? text : "--" }}</span>
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="onExt(record)" title="配置要求"><a-icon type="tool" /></a>
            <a-divider type="vertical" />
            <a @click="addAndEditModel(record)" title="编辑"><a-icon type="edit" /></a>
            <a-divider type="vertical" />
            <a @click="remove(record)" title="删除"><a-icon type="delete" /></a>
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
  Remove,
  Add,
  Edit,
  UpdateSort,
  UpdateEnabled,
} from "@/api/business/list";
import { Save as SaveExt, GetById as ExtGetById } from "@/api/business/ext";

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
    title: "是否启用",
    dataIndex: "enabled",
    scopedSlots: { customRender: "enabled" },
    width: "80px",
    checked: true,
  },
  {
    title: "排序",
    dataIndex: "sort",
    scopedSlots: { customRender: "sort" },
    width: "80px",
    checked: true,
  },
  {
    title: "业务需求",
    dataIndex: "demandName",
    scopedSlots: { customRender: "demandName" },
    width: "80px",
    checked: true,
  },
  {
    title: "异网调度",
    dataIndex: "crossIspScheduleName",
    scopedSlots: { customRender: "crossIspScheduleName" },
    width: "80px",
    checked: true,
  },
  {
    title: "跨省调度",
    dataIndex: "transProvScheduleName",
    scopedSlots: { customRender: "transProvScheduleName" },
    width: "80px",
    checked: true,
  },
  {
    title: "ipv6调度",
    dataIndex: "ipv6ScheduleName",
    scopedSlots: { customRender: "ipv6ScheduleName" },
    width: "80px",
    checked: true,
  },
  {
    title: "上行带宽限制",
    dataIndex: "minUsbw",
    scopedSlots: { customRender: "minUsbw" },
    width: "80px",
    checked: true,
  },
  {
    title: "调度时段",
    dataIndex: "periodScheduleArray",
    scopedSlots: { customRender: "periodScheduleArray" },
    checked: true,
  },
  {
    title: "计费方式",
    dataIndex: "billingType",
    scopedSlots: { customRender: "billingType" },
    checked: true,
    width: "80px",
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
    width: "100px",
    scopedSlots: { customRender: "action" },
    fixed: "right",
    checked: true,
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
      // 保持绑定上游业务选择的对象
      upstreamBusiness: null,
      // 上游公司api配置数据
      upstreamApiConfigData: [],
      multi,
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
      this.upstreamApiConfigList();
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
          } else if(values.method === 'saveExt'){
            SaveExt(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.visible = false;
              }
            });
          }
        }
      });
    },
    /**
     * 删除
     */
    remove(record) {
      const self = this;
      this.$confirm({
        title: "您确定要删除?",
        content: (h) => <div style="color:red;">正在删除: {record.name}</div>,
        onOk() {
          // eslint-disable-next-line promise/param-names
          return new Promise((resilve, reject) => {
            Remove({ id: record.id })
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
    // 开关修改
    handleSwitchChange(record, key) {
      // record[key] = record[key] === 0 ? 1 : 0;
      // 打印
      console.log("handleSwitchChange", record, key);
      UpdateEnabled({
        id: record.id,
        enabled: record[key],
      }).then((res) => {
        if (handlerResult(res)) {
          // 刷新列表
          this.$refs.table.refresh();
        }
      });
      // 刷新列表
    },
    // 排序修改
    handleSortChange(record, key) {
      // 打印
      console.log("handleSortChange", record, key);
      record[key] = Number.parseInt(record[key]);
      UpdateSort({
        id: record.id,
        sort: record[key],
      }).then((res) => {
        if (handlerResult(res)) {
          // 刷新列表
          this.$refs.table.refresh();
        }
      });
    },
    // 点击业务需求配置
    async onExt(record) {
      // 先查询业务需求配置
      const res = await ExtGetById(record.id)
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "业务需求配置: " + record.name,
        where: {
          // 是否显示
          notVshow: true,
          label: "ID",
          decorator: ["businessId", { initialValue: record.id }],
        },
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "saveExt" }],
              },
            ],
          },
          {
            label: "压测带宽标准%",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "压测带宽标准大于指定值，不填默认5%",
                decorator: ["bandwidthPressureRate", { initialValue: res.result ? res.result.bandwidthPressureRate : undefined }],
              },
            ],
          },
          {
            label: "压测丢包率%",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "丢包率小于等于指定值，不填默认小于3%",
                decorator: ["packetLossRate", { initialValue: res.result ? res.result.packetLossRate : undefined }],
              },
            ],
          },
        ],
      };
    },
  },
};
</script>
<style></style>
