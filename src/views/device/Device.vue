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
    <a-card :bordered="false">
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
              <a-form-item label="设备ID">
                <a-input
                  v-model="queryParam.deviceId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="账号类型">
                <a-select
                  v-model="queryParam.lineStatus"
                  placeholder="全部"
                  default-value=""
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">在线</a-select-option>
                  <a-select-option value="0">离线</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="起始">
                <a-date-picker v-model="queryParam.startTime" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="结束">
                <a-date-picker v-model="queryParam.endTime" style="width: 100%" />
              </a-form-item>
            </a-col>
            <template v-if="advanced"> </template>
            <a-col :md="(!advanced && 6) || 6" :sm="8">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)"
                  >查询</a-button
                >
                <a-button
                  style="margin-left: 8px"
                  @click="
                    () =>
                      (this.queryParam = {
                        startTime: moment().subtract(30, 'days').startOf('day'),
                        endTime: moment().startOf('day'),
                      })
                  "
                  >重置</a-button
                >
                <a v-show="false" @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
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
            <span>
              <a-popconfirm
                title="确认拉取设备?"
                ok-text="确认"
                cancel-text="取消"
                @confirm="onPullAllDevice()"
              >
                <a href="#">拉取设备</a>
              </a-popconfirm>
              <a-divider type="vertical" />
              <a @click="batchModifyStateShowModel(false)" style="color: #ff0000"
                >批量失败</a
              >
            </span>
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
        <!-- 表格内容 -->
        <span slot="lineStatus" slot-scope="text">
          <a-tag v-if="text === 1" color="green">在线</a-tag>
          <a-tag v-else color="red">离线</a-tag>
        </span>
        <span slot="deployed" slot-scope="text">
          <a-tag v-if="text === 1" color="green">已部署</a-tag>
          <a-tag v-else color="orange">未部署</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a :href="'http://125.65.79.28:1986/terminal?device_id=' + record.deviceId" target="_blank">远程</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item @click.native="onNetwork(record.deviceId)">网络配置</a-menu-item>
                <a-menu-item @click="onRepel(record)">业务部署</a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down" /></a>
            </a-dropdown>
          </template>
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
    <network-config-modal
    :visible="showConfig"
    :nic-list="nicList"
    :initial-data="dialData"
    @cancel="showConfig = false"
    @submit="handleConfigSubmit"
  />
  </page-header-wrapper>
</template>

<script>
import moment from "moment";
// import { mapState } from 'vuex'
import { STable, Ellipsis } from "@/components";
// import { getRoleList } from '@/api/manage'

import CreateForm from "@/views/modules/CreateForm";
import { Page, ModifyState, PullAllDevice, DialConfig, GetDialConfig } from "@/api/device/device";
import { isPageResult, handlerResult } from "@/api/handlerResult";
import NetworkConfigModal from "./components/NetworkConfigModal";
import { multi } from "@/utils/operationUtil";
const columns = [
  /*
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  */
  {
    title: "ID",
    dataIndex: "id",
    checked: true,
  },
  {
    title: "设备ID",
    dataIndex: "deviceId",
    checked: true,
  },
  {
    title: "在线状态",
    dataIndex: "lineStatus",
    scopedSlots: { customRender: "lineStatus" },
    checked: true,
  },
  {
    title: "部署状态",
    dataIndex: "deployed",
    scopedSlots: { customRender: "deployed" },
    checked: true,
  },
  {
    title: "备注",
    dataIndex: "notes",
    checked: true,
  },
  {
    title: "设备添加时间",
    dataIndex: "deviceAddAt",
    checked: true,
  },
  {
    title: "最后更新时间",
    dataIndex: "lastUpdatedAt",
    checked: true,
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    checked: true,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: "110px",
    scopedSlots: { customRender: "action" },
    checked: true,
  },
];

// 表格拦数据 localStorage名称
const columnslocalStorage = "DeviceColumns1";

export default {
  name: "Device",
  components: {
    STable,
    Ellipsis,
    CreateForm,
    NetworkConfigModal
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
        pageSizeOptions: ["10", "30", "50", "70", "100"],
        showTotal: (total) => `共 ${total} 条数据`,
      },
      // 表格栏数据对象
      columnsData: [],
      // 筛选列对象,data=数据,visible=是否显示筛选列(如果不显示，使用columns显示全部表格数据),model=菜单是否显示
      screenColumns: { data: [], visible: true, model: false },
      // 筛选列设置
      screeVisible: false,

      /**
       * 查询
       */
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        startTime: moment().subtract(30, "days").startOf("day"),
        endTime: moment().startOf("day"),
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        // 每次加载删除选择中值
        this.selectedRowKeys = [];
        this.selectedRows = [];
        this.queryParam.startTime = moment(this.queryParam.startTime).format(
          "YYYY-MM-DD"
        );
        this.queryParam.endTime = moment(this.queryParam.endTime).format("YYYY-MM-DD");
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
      model: null,
      visible: false,
      multi,
      showConfig: false,
      nicList: [
        { name: 'eth0', mac: 'bc24:11:ee:b9:e0', bandwidth: '-1Mbps' },
        { name: 'dummy0', mac: 'e2:d7:2c:c2:e4:b4', bandwidth: '-1Mbps' }
      ],
      deviceId: '',
      dialMode: 'SERVER_DIAL',
      dialData: { 
        type: 'SERVER_DIAL',
        data: []
      },
      configLoading: false
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
    // 初始化表格列数据
    this.initColumnsData();
    // 设置起始和结束时间
    this.queryParam = {
      startTime: moment().subtract(30, "days").startOf("day"),
      endTime: moment().startOf("day"),
    };
  },
  computed: {
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
        // 设置起始和结束时间
        this.queryParam = {
          startTime: moment().subtract(30, "days").startOf("day"),
          endTime: moment().startOf("day"),
        };
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
     * 批量修改状态
     */
    batchModifyStateShowModel(state) {
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一个，再操作");
        return;
      }
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields();
      this.model = {
        title: "确定要" + (state ? "批量成功？" : "批量失败？"),
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "batchModifyState" }],
              },
            ],
          },
          {
            label: "",
            notVshow: true,
            item: [
              { formType: "input", decorator: ["isState", { initialValue: state }] },
            ],
          },
          {
            label: "正在操作",
            item: [{ formType: "text", value: this.selectedRows.length + "条记录" }],
          },
          {
            label: "备注",
            notVif: state,
            item: [
              {
                formType: "textarea",
                decorator: ["desc", { rules: [{ required: true, message: "不能为空" }] }],
                placeholder: "请输入失败原因",
              },
            ],
          },
        ],
      };
    },
    /**
     * 修改提现订单状态显示
     */
    modifyStateShowModel(record, state) {
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields();
      this.model = {
        title: "确定要" + (state ? "成功？" : "失败？"),
        where: {
          // 是否显示
          notVshow: record,
          label: "ID",
          decorator: ["id", { initialValue: record.id }],
        },
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "modifyState" }],
              },
            ],
          },
          {
            label: "",
            notVshow: true,
            item: [
              { formType: "input", decorator: ["isState", { initialValue: state }] },
            ],
          },
          {
            label: "操作ID",
            item: [{ formType: "text", value: record.id }],
          },
          {
            label: "备注",
            notVif: state,
            item: [
              {
                formType: "textarea",
                decorator: ["desc", { rules: [{ required: true, message: "不能为空" }] }],
                placeholder: "请输入失败原因",
              },
            ],
          },
        ],
      };
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      const form = this.$refs.createModal.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          // 通过URLSearchParams组装请求参数
          var params = new URLSearchParams();
          params.append("isState", values.isState);
          if (values.desc !== undefined) {
            params.append("desc", values.desc);
          }
          if (values.method === "batchModifyState") {
            // 批量修改状态
            const idArr = [];
            this.selectedRows.map((item) => {
              idArr.push(item.id);
            });
            params.append("id[]", idArr);
            this.modifyState(params, form);
          } else if (values.method === "modifyState") {
            params.append("id[]", [values.id]);
            this.modifyState(params, form);
          }
        }
      });
    },
    /**
     * 拉取设备
     */
    onPullAllDevice() {
      PullAllDevice().then((response) => {
        if (handlerResult(response)) {
          this.$refs.table.refresh(); // 刷新表格
        }
      });
    },
    handleConfigSubmit(result) {
      console.log('配置结果:', JSON.stringify(result));
      DialConfig(this.deviceId, result.dialMode, result.configs).then((response) => {
      });
      /*

      AddServersPpp(this.deviceId, result.configs).then((response) => {

      });
*/
      console.log('配置结果:', JSON.stringify(result));
      // 处理提交数据
    },
    async onNetwork(deviceId){
      // 防止重复调用
      if (this.configLoading) return;
      this.configLoading = true;

      // 防止重复调用
      if (this.showConfig) {
        this.showConfig = false;
        await this.$nextTick();
      }
      this.showConfig = true
      this.deviceId = deviceId
      GetDialConfig(this.deviceId).then((response) => {
        if (handlerResult(response)) {
          this.dialData.type = response.type
          this.dialData.data = response.details
        }
      })
    },
    // 修改状态
    modifyState(params, form) {
      ModifyState(params).then((response) => {
        if (handlerResult(response)) {
          this.visible = false;
          form.resetFields(); // 清理表单数据（可不做）
          this.$refs.table.refresh(); // 刷新表格
        }
      });
    },
  },
};
</script>
