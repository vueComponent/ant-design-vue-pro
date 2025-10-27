<template>
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
        <!--搜索框-->
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="6" :sm="8">
              <a-form-item label="设备ID">
                <a-input
                  v-model="queryParam.deviceId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="会员ID">
                <a-input
                  v-model="queryParam.userId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col v-if="advanced" :md="6" :sm="8">
              <a-form-item label="BossID">
                <a-input
                  v-model="queryParam.bossId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col v-if="advanced" :md="6" :sm="8">
              <a-form-item label="代理商ID">
                <a-input
                  v-model="queryParam.agentId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col v-if="advanced" :md="6" :sm="8">
              <a-form-item label="推荐人ID">
                <a-input
                  v-model="queryParam.referrerId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="设备类型">
                <a-select
                  v-model="queryParam.deviceType"
                  placeholder="全部"
                  default-value="0"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="X86">X86</a-select-option>
                  <a-select-option value="BOX">盒子</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="上机类型">
                <a-select v-model="queryParam.machineType" placeholder="全部">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">API</a-select-option>
                  <a-select-option value="1">OS</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-if="advanced" :md="6" :sm="8">
              <a-form-item label="省份">
                <a-input
                  v-model="queryParam.province"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col v-if="advanced" :md="6" :sm="8">
              <a-form-item label="市">
                <a-input
                  v-model="queryParam.city"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="运营商">
                <a-select v-model="queryParam.isp" placeholder="全部" default-value="0">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="MOBILE">移动</a-select-option>
                  <a-select-option value="UNICOM">联通</a-select-option>
                  <a-select-option value="TELECOM">电信</a-select-option>
                  <a-select-option value="BROADNET">广电</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="在线状态">
                <a-select
                  v-model="queryParam.status"
                  placeholder="全部"
                  default-value="0"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="ONLINE">在线</a-select-option>
                  <a-select-option value="OUTLINE">离线</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="阶段状态">
                <a-select v-model="queryParam.stage" placeholder="全部" default-value="0">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="SUBMITTED">已提交</a-select-option>
                  <a-select-option value="CENSORED">验收测试中</a-select-option>
                  <a-select-option value="UNCENSORED">验收未通过</a-select-option>
                  <a-select-option value="INSERVICE">服务中</a-select-option>
                  <a-select-option value="OFFLINE">已下线</a-select-option>
                  <a-select-option value="RETIRED">已清退</a-select-option>
                  <a-select-option value="EXCEPTION">异常</a-select-option>
                </a-select>
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
        :scroll="{ x: 2000 }"
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
            <a @click="onBatchModifyCostPrice"><a-icon type="edit" /> 批量设成本价</a>
            <a-divider type="vertical" />
            <a @click="onBatchModifyPrice"><a-icon type="edit" /> 批量设价</a>
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
        <!-- 节点信息 -->
        <span slot="deviceId" slot-scope="text, record" style="font-size: 12px">
          <div style="margin-bottom: 10px">设备ID：{{ text }}</div>
          <div style="margin-bottom: 10px">业务SN：{{ record.upstreamSn }}</div>
          <div>
            <span>
              <a-tag v-if="text === 'X86'" color="pink">{{ record.deviceTypeName }}</a-tag>
              <a-tag v-else color="green">{{ record.deviceTypeName }}</a-tag>
            </span>
            <span> 
              <!-- 上机类型machineType，0=API，1=OS -->
              <a-tag v-if="record.machineType === 0" color="green">API</a-tag>
              <a-tag v-else color="red">OS</a-tag>
            </span>
            <!-- 运营商 -->
            <span>
              <a-tag v-if="record.isp === 'MOBILE'" color="pink">
                {{ record.ispName }}
              </a-tag>
              <a-tag v-else-if="record.isp === 'UNICOM'" color="green">
                {{ record.ispName }}
              </a-tag>
              <a-tag v-else="record.isp === 'TELECOM'" color="purple">
                {{ record.ispName }}
              </a-tag>
            </span>
            <!--异网-->
            <span v-if="record.crossIsp" style="font-size: 12px;">-> </span>
            <span v-if="record.crossIsp">
              <a-tag v-if="record.crossIsp === 'MOBILE'" color="pink">
                {{ record.crossIspName }}
              </a-tag>
              <a-tag v-else-if="record.crossIsp === 'UNICOM'" color="green">
                {{ record.crossIspName }}
              </a-tag>
              <a-tag v-else="record.crossIsp === 'TELECOM'" color="purple">
                {{ record.crossIspName }}
              </a-tag>
            </span>
            <!-- 地区 -->
            <span>{{ record.province + " - " + record.city }}</span>
          </div>
        </span>
        <!--名称-->
        <span slot="nodeName" slot-scope="text, record">
          <!-- 节点名称 -->
          <div style="margin-bottom: 10px; color: #1b53eb">{{ text }}</div>
          <!-- 状态 -->
          <div style="margin-bottom: 10px">
            <a-badge :status="record.status === 'ONLINE' ? 'success' : 'error'" />
            <span>
              {{ record.statusName }}
            </span>
            <a-divider type="vertical" />
            <a-badge :status="record.stage === 'INSERVICE' ? 'success' : 'error'" />
            <span>{{ record.stageName }}</span>
          </div>
          <div>
            <span v-if="record.transProvSchedule === 0" style="color: #fa0202;font-weight: 500;">
              省内
            </span>
            <span v-else style="color: #0b07ee;font-weight: 500;">
              跨省({{ record.transProvRate }}%)
            </span>
            <a-divider type="vertical" v-if="record.ipv6Schedule === 0" />
            <span v-if="record.ipv6Schedule === 0" style="color: #fa0202;font-weight: 500;">
              仅IPV6调度
            </span>
            <a-divider type="vertical" />
            <span v-if="record.periodSchedule === 'ALL_DAY'" style="color: #0b07ee;font-weight: 500;">
              全天
            </span>
            <span v-else-if="record.periodSchedule === 'NOON_EVENING'" style="color: #f19307;font-weight: 500;">
              午晚高峰
            </span>
            <span v-else-if="record.periodSchedule === 'EVENING'" style="color: #f50808;font-weight: 500;">
              晚高峰
            </span>
          </div>
        </span>
        <!--业务-->
        <span slot="business.name" slot-scope="text, record">
          <div style="margin-bottom: 10px;">
            {{ text }}
          </div>
          {{ multi(record.bwNum, record.usbw) }}M
        </span>
        <!--结算-->
        <span slot="business" slot-scope="text, record">
          {{
            (text.bossSettlementPeriodName || "-") +
            " | " +
            (text.userSettlementPeriodName || "-")
          }}
        </span>
        <!--成本价-->
        <span slot="costPrice" slot-scope="text, record">
          <span v-if="record.costPrice !== null">
            {{ text }}元
          </span>
          <span v-else>-</span>
        </span>
        <!--boss结算周期-->
        <span slot="bossSettlePeriod" slot-scope="text, record">
           <!--使用a-tag渲染-->
           <a-tag v-if="text === 'DAY'" color="green">日结</a-tag>
           <a-tag v-else-if="text === 'WEEK'" color="orange">周结</a-tag>
           <a-tag v-else-if="text === 'MONTH'" color="red">月结</a-tag>
           <span v-else>-</span>
        </span>
        <!--管理单价抽成-->
        <span slot="manageDeductPrice" slot-scope="text, record">
          <!--固定或百分比-->
          <span v-if="record.manageDeductPrice !== null">
            <span v-if="record.manageDeductType === 0">
               {{ text }}元
            </span>
            <span v-else>
              {{ PercentageHelper.toDisplay(text) }}%
            </span>
          </span>
          <span v-else>-</span>
        </span>
        <!--管理流量抽成%-->
        <span slot="manageDeductFlow" slot-scope="text, record">
          <span v-if="record.manageDeductFlow !== null">
            {{ PercentageHelper.toDisplay(text) }}%
          </span>
          <span v-else>-</span>
        </span>
        <!--boss抽成-->
        <span slot="bossDeductPrice" slot-scope="text, record">
          <!--固定或百分比-->
          <span v-if="record.bossDeductPrice !== null">
            <span v-if="record.bossDeductType === 0">
               {{ text }}元
            </span>
            <span v-else>
              {{ PercentageHelper.toDisplay(text) }}%
            </span>
          </span>
          <span v-else>-</span>
        </span>
        <!--BOSS流量抽成%-->
        <span slot="bossDeductFlow" slot-scope="text, record">
          <span v-if="record.bossDeductFlow !== null">
            {{ PercentageHelper.toDisplay(text) }}%
          </span>
          <span v-else>-</span>
        </span>
        <!--用户结算周期-->
        <span slot="userSettlePeriod" slot-scope="text, record">
           <!--使用a-tag渲染-->
           <a-tag v-if="text === 'DAY'" color="green">日结</a-tag>
           <a-tag v-else-if="text === 'WEEK'" color="orange">周结</a-tag>
           <a-tag v-else-if="text === 'MONTH'" color="red">月结</a-tag>
           <span v-else>-</span>
        </span>
        <!--代理抽成-->
        <span slot="agentDeductPrice" slot-scope="text, record">
          <!--固定或百分比-->
          <span v-if="record.agentDeductPrice !== null">
            <span v-if="record.agentDeductType === 0">
               {{ text }}元
            </span>
            <span v-else>
              {{ PercentageHelper.toDisplay(text) }}%
            </span>
          </span>
          <span v-else>-</span>
        </span>
        <!--代理流量抽成%-->
        <span slot="agentDeductFlow" slot-scope="text, record">
          <span v-if="record.agentDeductFlow !== null">
            {{ PercentageHelper.toDisplay(text) }}%
          </span>
          <span v-else>-</span>
        </span>
        <!--推荐人流量抽成%-->
        <span slot="refDeductFlow" slot-scope="text, record">
          <span v-if="record.refDeductFlow !== null">
            {{ PercentageHelper.toDisplay(text) }}%
          </span>
          <span v-else>-</span>
        </span>
        <!--用户单价-->
        <span slot="userPrice" slot-scope="text, record">
          <!--计算用户价格，用户价格=成本价-管理单价抽成（按管理单价类型计算，单价为null不计算）-boss单价抽成（按boss单价类型计算，单价为null不计算）-代理单价抽成（按代理单价类型计算，单价为null不计算），如果成本价为null，不计算用户单价，显示为（-）-->
          <span v-if="record.costPrice === null">-</span>
          <span v-else>
            {{ calculateUserPrice(record) }}元
          </span>
        </span>
        <!--设价-->
        <span slot="action" slot-scope="text, record">
          <a @click="onModifyPrice(record)">设价</a>
        </span>
      </s-table>
    </a-card>
    <create-form
      ref="createModal"
      :visible="visible"
      :model="model"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </page-header-wrapper>
</template>

<script>
import { STable } from "@/components";
import CreateForm from "@/views/modules/CreateForm";
import CreateInfoModel from "@/views/modules/CreateInfoModel";
import {
  Page,
  Edit,
} from "@/api/node/list";
import { handlerResult, isPageResult } from "@/api/handlerResult";
import { multi, div } from "@/utils/operationUtil";
// 时间格式化工具
import moment from "moment";
import VueClipboards from "vue-clipboard2";
import { BatchUpdatePrice, UpdateCostPrice } from "@/api/node/price";
// 引入百分比工具
import { PercentageHelper } from "@/utils/PercentageHelper";



// 表格字段，checked是否显示
const columns = [
  {
    title: "设备信息",
    dataIndex: "deviceId",
    scopedSlots: { customRender: "deviceId" },
    fixed: "left",
    checked: true,
    width: "290px",
  },
  {
    title: "BossID",
    dataIndex: "bossId",
    checked: false,
    width: "80px",
  },
  {
    title: "代理商ID",
    dataIndex: "agentId",
    checked: false,
    width: "80px",
  },
  {
    title: "推荐人ID",
    dataIndex: "referrerId",
    checked: false,
    width: "80px",
  },
  {
    title: "用户ID",
    dataIndex: "userId",
    checked: true,
    width: "80px",
  },
  {
    title: "名称/状态/运营商",
    dataIndex: "nodeName",
    scopedSlots: { customRender: "nodeName" },
    checked: true,
    width: "240px",
  },
  {
    title: "业务/上行带宽",
    dataIndex: "business.name",
    scopedSlots: { customRender: "business.name" },
    checked: true,
    width: "120px",
  },
  {
    title: "成本价",
    dataIndex: "costPrice",
    scopedSlots: { customRender: "costPrice" },
    checked: true,
  },
  {
    title: "管理单价抽成",
    dataIndex: "manageDeductPrice",
    scopedSlots: { customRender: "manageDeductPrice" },
    checked: true,
  },
  {
    title: "管理流量抽成%",
    dataIndex: "manageDeductFlow",
    scopedSlots: { customRender: "manageDeductFlow" },
    checked: true,
  },
  {
    title: "BOSS结算周期",
    dataIndex: "bossSettlePeriod",
    scopedSlots: { customRender: "bossSettlePeriod" },
    checked: true,
  },
  {
    title: "BOSS单价抽成",
    dataIndex: "bossDeductPrice",
    scopedSlots: { customRender: "bossDeductPrice" },
    checked: true,
  },
  {
    title: "BOSS流量抽成%",
    dataIndex: "bossDeductFlow",
    scopedSlots: { customRender: "bossDeductFlow" },
    checked: true,
  },
  {
    title: "用户结算周期",
    dataIndex: "userSettlePeriod",
    scopedSlots: { customRender: "userSettlePeriod" },
    checked: true,
  },
  {
    title: "代理商抽成",
    dataIndex: "agentDeductPrice",
    scopedSlots: { customRender: "agentDeductPrice" },
    checked: true,
  },
  {
    title: "代理流量抽成%",
    dataIndex: "agentDeductFlow",
    scopedSlots: { customRender: "agentDeductFlow" },
    checked: true,
  },
  {
    title: "推荐人流量抽成%",
    dataIndex: "refDeductFlow",
    scopedSlots: { customRender: "refDeductFlow" },
    checked: true,
  },
  {
    title: "BOSS/会员结算周期",
    dataIndex: "business",
    scopedSlots: { customRender: "business" },
    checked: true,
    width: "110px",
  },
  {
    title: "用户单价",
    dataIndex: "userPrice",
    scopedSlots: { customRender: "userPrice" },
    checked: true,
  },
  {
    title: "创建/计费时间",
    dataIndex: "createdAt",
    scopedSlots: { customRender: "createdAt" },
    checked: true,
    width: "110px",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: "50px",
    fixed: "right",
    scopedSlots: { customRender: "action" },
    checked: true,
  },
];
// 表格拦数据 localStorage名称，保证每个页面都是唯一的
const columnslocalStorage = "NodePriceColumns3";

export default {
  name: "NodePrice",
  components: {
    STable,
    CreateForm,
    CreateInfoModel,
    VueClipboards,
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
            return res.result;
          }
        });
      },
      // 选中项的 key 数组
      selectedRowKeys: [],
      // 选中项数组添加到 selectedRows 中
      selectedRows: [],
      // 百分比工具
      PercentageHelper,
      visible: false,
      model: null,
      moment,
      multi,
      div,
      // ...其他数据
      editDrawerVisible: false,
      currentEditRecord: null,
      addDrawervisible: false,
      settlePeriodOptions : [
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
      ],
      deductTypeOptions : [
        {
          label: "固定金额",
          value: 0,
        },
        {
          label: "百分比",
          value: 1,
        }
      ],
    };
  },
  // el 创建前
  beforeCreate() {
    // 创建表单
    this.form = this.$form.createForm(this);
  },
  created() {
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
    handleChange() {},
  },
  methods: {
    // 刷新
    refresh() {
      this.pageShow = false;
      this.$nextTick(function () {
        this.pageShow = true;
        this.selectedRowKeys = [];
        this.selectedRows = [];
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
     * 弹窗关闭
     */
    handleCancel() {
      this.visible = false;
      this.model = null;
      this.form.resetFields(); // 清理表单数据（可不做）
    },
    /**
     * 弹窗确定
     */
    handleOk() {
      const form = this.$refs.createModal.form;
      form.validateFields(async (errors, values) => {
        if (!errors) {
          if (values.method === "batchModifyPrice") {
            // 检查是否选择了节点
            if (this.selectedRows.length === 0) {
              this.$message.error("请至少选择一个节点,再操作");
              return;
            }
            // 从选中项中提取节点ID
            values.ids = this.selectedRows.map((row) => row.id);
            // 批量设价
            BatchUpdatePrice(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.method === "modifyPrice") {
            values.ids = [values.id];
            // 编辑
            BatchUpdatePrice(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.method === "modifyCostPrice") {
            // 从选中项中提取节点ID
            values.ids = this.selectedRows.map((row) => row.id);
            // 批量设成本价
            BatchUpdatePrice(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          }
          this.model = null;
          this.form.resetFields(); // 清理表单数据（可不做）
        }
      });
    },
    /**
     * 节点编辑
     */
    onEdit(record) {
      this.currentEditRecord = record;
      this.editDrawerVisible = true;
    },
    // 添加设备
    onAdd() {
      this.addDrawervisible = true;
    },
    /**
     * @description: 点击批量设价
     * @param {*}
     */
    onBatchModifyPrice() {
      // 校验选中节点
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一个,再操作");
        return;
      }
      this.visible = true;
      // const form = this.$refs.createModal.form;
      this.form.resetFields(); // 清理表单数据（可不做）
      this.model = null;
      this.model = {
        title: "批量设价",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "batchModifyPrice" }],
              },
            ],
          },
          // 管理单价抽成
          {
            label: "管理单价抽成类型",
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: this.deductTypeOptions,
                decorator: [
                  "manageDeductType",
                ],
              },
            ],
          },
          // 管理单价抽成
          {
            label: "管理单价抽成",
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "manageDeductPrice",
                ],
              },
            ],
          },
          {
            label: "管理流量抽成%",
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "manageDeductFlow",
                ],
              },
            ],
          },
          {
            label: "BOSS结算周期",
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: this.settlePeriodOptions,
                decorator: [
                  "bossSettlePeriod",
                ],
              },
            ],
          },
          {
            label: "BOSS抽成类型",
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: this.deductTypeOptions,
                decorator: [
                  "bossDeductType",
                  {
                    initialValue: 0,
                  },
                ],
              },
            ],
          },
          {
            label: "BOSS单价抽成%",
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "bossDeductPrice",
                ],
              },
            ],
          },
          {
            label: "BOSS流量抽成",
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "bossDeductFlow",
                ],
              },
            ],
          },
          {
            label: "用户结算周期",
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: this.settlePeriodOptions,
                decorator: [
                  "userSettlePeriod",
                  {
                    initialValue: "WEEK",
                  },
                ],
              },
            ],
          },
          // 代理商抽成类型
          {
            label: "代理商抽成类型",
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: this.deductTypeOptions,
                decorator: [
                  "agentDeductType",
                  {
                    initialValue: 0,
                  },
                ],
              },
            ],
          },
          // 代理商单价抽成
          {
            label: "代理商单价抽成",
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "agentDeductPrice",
                ],
              },
            ],
          },
          // 代理商流量抽成
          {
            label: "代理商流量抽成%",
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "agentDeductFlow",
                ],
              },
            ],
          },
          // 推荐人流量抽成%
          {
            label: "推荐人流量抽成%",
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "refDeductFlow",
                ],
              },
            ],
          },
        ],
      };
    },
    // 编辑价格
    onModifyPrice(record) {
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "批量设价",
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
                decorator: ["method", { initialValue: "modifyPrice" }],
              },
            ],
          },
          // 管理单价抽成
          {
            label: "管理单价抽成类型",
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: this.deductTypeOptions,
                decorator: [
                  "manageDeductType",
                  {
                    initialValue: record.manageDeductType,
                    rules: [{ required: true, message: "管理单价抽成不能为空" }],
                  },
                ],
              },
            ],
          },
          // 管理单价抽成
          {
            label: "管理单价抽成",
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "manageDeductPrice",
                  {
                    initialValue: record.manageDeductType !==null && record.manageDeductType === 1 ? PercentageHelper.toDisplay(record.manageDeductPrice) : record.manageDeductPrice,
                    rules: [{ required: true, message: "管理单价抽成不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "管理流量抽成%",
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "manageDeductFlow",
                  {
                    initialValue: record.manageDeductFlow !== null ? PercentageHelper.toDisplay(record.manageDeductFlow) : undefined,
                    rules: [{ required: true, message: "管理流量抽成不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "BOSS结算周期",
            notVif: !record.bossId,
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: this.settlePeriodOptions,
                decorator: [
                  "bossSettlePeriod",
                  {
                    initialValue: record.bossSettlePeriod,
                    rules: [{ required: true, message: "BOSS结算周期不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "BOSS抽成类型",
            notVif: !record.bossId,
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: this.deductTypeOptions,
                decorator: [
                  "bossDeductType",
                  {
                    initialValue: record.bossDeductType,
                    rules: [{ required: true, message: "BOSS抽成类型不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "BOSS单价抽成",
            notVif: !record.bossId,
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "bossDeductPrice",
                  {
                    initialValue: record.bossDeductType !==null && record.bossDeductType === 1 ? PercentageHelper.toDisplay(record.bossDeductPrice) : record.bossDeductPrice,
                    rules: [{ required: true, message: "BOSS单价抽成不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "BOSS流量抽成%",
            notVif: !record.bossId,
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "bossDeductFlow",
                  {
                    initialValue: record.bossDeductFlow !== null ? PercentageHelper.toDisplay(record.bossDeductFlow) : undefined,
                    rules: [{ required: true, message: "BOSS流量抽成不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "用户结算周期",
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: this.settlePeriodOptions,
                decorator: [
                  "userSettlePeriod",
                  {
                    initialValue: record.userSettlePeriod,
                    rules: [{ required: true, message: "用户结算周期不能为空" }],
                  },
                ],
              },
            ],
          },
          // 代理商抽成类型
          {
            label: "代理商抽成类型",
            notVif: !record.agentId,
            item: [
              {
                formType: "radio-group",
                col: 24,
                options: this.deductTypeOptions,
                decorator: [
                  "agentDeductType",
                  {
                    initialValue: record.agentDeductType,
                    rules: [{ required: true, message: "代理商抽成类型不能为空" }],
                  },
                ],
              },
            ],
          },
          // 代理商单价抽成
          {
            label: "代理商单价抽成",
            notVif: !record.agentId,
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "agentDeductPrice",
                  {
                    initialValue: record.agentDeductType !==null && record.agentDeductType === 1 ? PercentageHelper.toDisplay(record.agentDeductPrice) : record.agentDeductPrice,
                    rules: [{ required: true, message: "代理商单价抽成不能为空" }],
                  },
                ],
              },
            ],
          },
          // 代理商流量抽成
          {
            label: "代理商流量抽成%",
            notVif: !record.agentId,
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "agentDeductFlow",
                  {
                    initialValue: record.agentDeductFlow !== null ? PercentageHelper.toDisplay(record.agentDeductFlow) : undefined,
                    rules: [{ required: true, message: "代理商流量抽成不能为空" }],
                  },
                ],
              },
            ],
          },
          // 推荐人流量抽成%
          {
            label: "推荐人流量抽成%",
            notVif: !record.referrerId,
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "refDeductFlow",
                  {
                    initialValue: record.refDeductFlow !== null ? PercentageHelper.toDisplay(record.refDeductFlow) : undefined,
                    rules: [{ required: true, message: "推荐人流量抽成%不能为空" }],
                  },
                ],
              },
            ],
          },
        ],
      };
    },
    /**
     * 批量设成本价
     */
    onBatchModifyCostPrice() {
      // 校验选中节点
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一个,再操作");
        return;
      }
      this.visible = true;
      // const form = this.$refs.createModal.form;
      this.form.resetFields(); // 清理表单数据（可不做）
      this.model = null;
      this.model = {
        title: "批量设成本价",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "modifyCostPrice" }],
              },
            ],
          },
          {
            label: "成本价",
            help: "成本价为空，按上游价格计算",
            item: [
              {
                formType: "input",
                col: 24,
                decorator: ["costPrice"],
              },
            ],
          }
        ],
      };
    },
    /**
   * 计算用户价格
   * 用户价格 = 成本价 - 管理单价抽成 - boss单价抽成 - 代理单价抽成
   * 如果成本价为null，返回null
   * 如果抽成类型为0（固定金额），直接减去金额
   * 如果抽成类型为1（百分比），按百分比计算
   * 如果抽成值为null，则不计算该部分
   */
  calculateUserPrice(record) {
    // 如果成本价为null，返回null
    if (record.costPrice === null) {
      return null;
    }
    
    let userPrice = parseFloat(record.costPrice);
    
    // 计算管理单价抽成
    if (record.manageDeductPrice !== null) {
      if (record.manageDeductType === 0) {
        // 固定金额抽成
        userPrice -= parseFloat(record.manageDeductPrice);
      } else if (record.manageDeductType === 1) {
        // 百分比抽成
        userPrice -= userPrice * parseFloat(record.manageDeductPrice);
      }
    }
    
    // 计算BOSS单价抽成
    if (record.bossDeductPrice !== null) {
      if (record.bossDeductType === 0) {
        // 固定金额抽成
        userPrice -= parseFloat(record.bossDeductPrice);
      } else if (record.bossDeductType === 1) {
        // 百分比抽成
        userPrice -= userPrice * parseFloat(record.bossDeductPrice);
      }
    }
    
    // 计算代理单价抽成
    if (record.agentDeductPrice !== null) {
      if (record.agentDeductType === 0) {
        // 固定金额抽成
        userPrice -= parseFloat(record.agentDeductPrice);
      } else if (record.agentDeductType === 1) {
        // 百分比抽成
        userPrice -= userPrice * parseFloat(record.agentDeductPrice);
      }
    }
    
    // 确保价格不为负数
    userPrice = Math.max(0, userPrice);
    
    // 保留2位小数
    return userPrice.toFixed(2);
  },
  },
};
</script>
<style scoped>
.color-red {
  color: red;
}
.disk-info {
  margin-top: 20px;
  color: #252525;
  font-size: 16px;
  /** 字体加粗 */
  font-weight: 600;
}
</style>
