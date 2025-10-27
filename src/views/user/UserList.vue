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
              <a-form-item label="用户ID">
                <a-input
                  v-model="queryParam.id"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="BossId">
                <a-input
                  v-model="queryParam.bossId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="代理商ID">
                <a-input
                  v-model="queryParam.agentId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="推荐人ID">
                <a-input
                  v-model="queryParam.referrerId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="用户账号">
                <a-input
                  v-model="queryParam.userName"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="姓名">
                <a-input
                  v-model="queryParam.sexName"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="QQ号">
                <a-input
                  v-model="queryParam.qq"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="直属用户">
                <a-select
                  v-model="queryParam.directlyUnder"
                  placeholder="全部"
                  default-value="0"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">是</a-select-option>
                  <a-select-option value="0">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="用户类型">
                <a-select
                  v-model="queryParam.userType"
                  placeholder="全部"
                  default-value="0"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="USER">会员</a-select-option>
                  <a-select-option value="AGENT">代理商</a-select-option>
                  <a-select-option value="BOSS">BOSS</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="用户状态">
                <a-select
                  v-model="queryParam.state"
                  placeholder="全部状态"
                  default-value="0"
                >
                  <a-select-option value="">全部状态</a-select-option>
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">停用</a-select-option>
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
            <a @click="addUserModel"><a-icon type="user-add" />添加用户</a>
            <a-divider type="vertical" />
            <a @click="modifyPriceGroupModel"><a-icon type="edit" />修改价格分组</a>
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
        <span slot="userName" slot-scope="text, record">
          <!--个人认证-->
          <span>
            {{ text }}
          </span>
          <!--未认证-->
          <span v-if="!record.realnameVerifi || record.realnameVerifi.status === 0">
            <a-tooltip>
              <template slot="title"> 未认证 </template>
              <a-icon :style="{ fontSize: '18px', color: '#696969' }" type="idcard" />
            </a-tooltip>
          </span>
          <!--已认证-->
          <span v-else>
            <!--气泡卡片显示认证信息-->
            <a-popover placement="right">
              <template slot="content">
                <p v-if="record.realnameVerifi.authType === 1" style="margin-top: 10px">
                  企业名称：{{ record.realnameVerifi.enterpriseName }}
                </p>
                <p v-if="record.realnameVerifi.authType === 1">
                  社会统一编码：{{ record.realnameVerifi.unifiedSocialCode }}
                </p>
                <p>
                  {{
                    (record.realnameVerifi.authType === 0 ? "姓名" : "法人") +
                    "：" +
                    record.realnameVerifi.legalName
                  }}
                </p>
                <p>
                  {{
                    (record.realnameVerifi.authType === 0 ? "身份证" : "法人身份证") +
                    "：" +
                    record.realnameVerifi.idCardNo
                  }}
                </p>
              </template>
              <template slot="title">
                <span v-if="record.realnameVerifi.authType === 0">个人认证</span>
                <span v-if="record.realnameVerifi.authType === 1">企业认证</span>
              </template>
              <a-icon
                v-if="record.realnameVerifi.authType === 0"
                :style="{ fontSize: '18px', color: '#08c' }"
                type="idcard"
              />
              <a-icon
                v-else
                :style="{ fontSize: '18px', color: '#D2691E' }"
                type="idcard"
              />
            </a-popover>
          </span>
        </span>
        <span slot="userType" slot-scope="text, record">
          <a-tag v-if="record.userType === 'USER'">{{ record.userTypeName }}</a-tag>
          <a-tag v-if="record.userType === 'AGENT'" color="green">{{
            record.userTypeName
          }}</a-tag>
          <!--boss气泡卡片-->
          <a-popover v-if="record.userType === 'BOSS'" placement="right">
            <template slot="content">
              <p style="margin-top: 10px">
                代理商：{{ record.bossConfig.bossVersion.agents }} 个
              </p>
              <p>
                会员：{{ record.bossConfig.bossVersion.users }} 个
              </p>
              <p>
                总带宽：{{ record.bossConfig.bossVersion.totalBandwidth === 0 ? '-' : record.bossConfig.bossVersion.totalBandwidth + 'G' }}
              </p>
              <p>
                到期时间：{{ moment(record.bossConfig.dueTime).format('YYYY-MM-DD') }}
              </p>
            </template>
            <template slot="title">
              <span>{{ record.bossConfig.bossVersion.name + ' - ' + record.bossConfig.bossVersion.typeName }}</span>
            </template>
            <a-tag color="red">{{
              record.userTypeName
            }}</a-tag>
          </a-popover>
        </span>
        <span slot="priceGroupName" slot-scope="text">
          {{ text === null ? "-" : text }}
        </span>
        <span slot="loginTime" slot-scope="text">{{
          text > 0 ? moment(text).format('YYYY-MM-DD HH:mm:ss') : "-"
        }}</span>
        <span slot="lastLoginTime" slot-scope="text">{{
          text > 0 ? moment(text).format('YYYY-MM-DD HH:mm:ss') : "-"
        }}</span>
        <span slot="createTime" slot-scope="text">{{
          moment(text).format('YYYY-MM-DD HH:mm:ss')
        }}</span>
        <span slot="modifyTime" slot-scope="text">{{
          text > 0 ? moment(text).format('YYYY-MM-DD HH:mm:ss') : "-"
        }}</span>
        <span slot="state" slot-scope="text, record">
          <a-tag v-if="text === 0" color="#108ee9">正常</a-tag>
          <a-tag v-else color="#f50">停用</a-tag>
          <a-tooltip v-if="text !== 0">
            <template slot="title">
              {{ record.stateDesc }}
            </template>
            <a-icon type="question-circle" />
          </a-tooltip>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item @click="editModel(record)"
                  ><a-icon type="edit" />编辑</a-menu-item
                >
                <a-menu-item @click="queryUserInfo(record)"
                  ><a-icon type="eye" />详细信息</a-menu-item
                >
                <a-menu-item @click="modifyUserTypeModel(record)"
                  ><a-icon type="edit" />更改会员类型</a-menu-item
                >
                <a-menu-item v-if="record.userType === 'BOSS'" @click="onModifyBossDueTime(record)"
                  ><a-icon type="edit" />修改BOSS到期时间</a-menu-item
                >
                <a-menu-item
                  v-if="record.state === 1"
                  @click="modifyStateModel(record, true)"
                  ><a-icon type="unlock" />启用</a-menu-item
                >
                <a-menu-item
                  v-if="record.state === 0"
                  @click="modifyStateModel(record, false)"
                  ><a-icon type="lock" />禁用</a-menu-item
                >
                <a-menu-item v-action:remove @click="userDel(record)"
                  ><a-icon type="delete" />删除</a-menu-item
                >
              </a-menu>
              <a>更多操作<a-icon type="down" /></a>
            </a-dropdown>
          </template>
        </span>
      </s-table>
      <!-- 查询用户详细信息modal -->
      <create-info-model
        ref="createUserInfoModal"
        :visible="userInfoVisible"
        :model="userInfoModel"
        @cancel="handleUserInfoCancel"
      />
      <!-- 模态框 -->
      <create-form
        ref="createModal"
        :visible="visible"
        :model="model"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <!--更改用户类型-->
      <a-modal
        :visible="modifyUserTypeVisible"
        :width="680"
        :dialog-style="{ top: '30px' }"
        title="更改用户类型"
        @cancel="modifyUserTypeHandleCancel"
        @ok="modifyUserTypeHandleOk"
      >
        <!--表单 并将表单的值绑定到this.from-->
        <a-form
          :form="modifyUserTypeForm"
          v-bind="{
            labelCol: { xs: { span: 24 }, sm: { span: 5 } },
            wrapperCol: { xs: { span: 24 }, sm: { span: 17 } },
          }"
        >
          <a-form-item label="用户ID">
            <a-input v-decorator="['userId']" disabled />
          </a-form-item>
          <!--每一项元素-->
          <a-form-item label="用户类型">
            <a-row :gutter="[8]">
              <a-col :span="24">
                <a-select
                  default-value="USER"
                  placeholder="请选择"
                  v-decorator="[
                    'userType',
                    {
                      rules: [{ required: true, message: '岗位名称不能为空' }],
                    },
                  ]"
                  @change="onUserTypeChange"
                >
                  <a-select-option value="USER"> 会员 </a-select-option>
                  <a-select-option value="AGENT"> 代理商 </a-select-option>
                  <a-select-option value="BOSS"> BOSS </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item v-if="isBoss" label="Boss版本">
            <a-row :gutter="[8]">
              <a-col :span="24">
                <a-select
                  placeholder="请选择"
                  v-decorator="[
                    'bossVersionId',
                    {
                      rules: [{ required: true, message: 'Boss版本不能为空' }],
                    },
                  ]"
                >
                  <a-select-option
                    v-for="item in bossVersionData"
                    :key="item.id"
                    :value="item.id"
                    >{{
                      item.name + "-" + (item.type === 1 ? "旗舰版" : "标准版")
                    }}</a-select-option
                  >
                </a-select>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item v-if="isBoss" label="BOSS到期时间">
            <a-row :gutter="[8]">
              <a-col :span="24">
                <a-input
                  placeholder="请输入天数"
                  autocomplete="off"
                  v-decorator="[
                    'bossTime',
                    {
                      rules: [{ required: true, message: '请输入天数' }],
                    },
                  ]"
                />
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { pwd } from "@/utils/PwdUtil";
// import { mapState } from 'vuex'
import { STable, Ellipsis } from "@/components";
// import { getRoleList } from '@/api/manage'
import CreateForm from "@/views/modules/CreateForm";
import CreateInfoModel from "@/views/modules/CreateInfoModel";
// 导入public接口
import { BusinessPriceGroupList } from "@/api/public";
import { List as BossVersionList } from "@/api/user/bossVersion/";
import {
  Page,
  ModifyState,
  RemoveById,
  Add,
  Edit,
  ModifyPriceGroup,
  ModifyUserType,
  ModifyBossDueTime
} from "@/api/user/list";
import { timeStampToFormatDate } from "@/utils/timeUtil";
import { handlerResult, isPageResult } from "@/api/handlerResult";
// 表格字段，checked是否显示
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    checked: true,
  },
  {
    title: "BossId",
    dataIndex: "bossId",
    checked: true,
  },
  {
    title: "代理商ID",
    dataIndex: "agentId",
    checked: true,
  },
  {
    title: "推荐人ID",
    dataIndex: "referrerId",
    checked: true,
  },
  {
    title: "用户类型",
    dataIndex: "userType",
    scopedSlots: { customRender: "userType" },
    checked: true,
  },
  {
    title: "价格分组",
    dataIndex: "priceGroupName",
    scopedSlots: { customRender: "priceGroupName" },
    checked: true,
  },
  {
    title: "账号",
    dataIndex: "userName",
    scopedSlots: { customRender: "userName" },
    checked: true,
    width: "130px",
  },
  {
    title: "余额",
    dataIndex: "money",
    checked: true,
  },
  {
    title: "姓名",
    dataIndex: "sexName",
    checked: true,
  },
  {
    title: "QQ号",
    dataIndex: "qq",
    checked: false,
  },
  {
    title: "微信号",
    dataIndex: "weixin",
    checked: false,
  },
  {
    title: "状态",
    dataIndex: "state",
    scopedSlots: { customRender: "state" },
    checked: true,
    width: "80px",
  },
  {
    title: "邀请码",
    dataIndex: "inviteCode",
    checked: true,
  },
  {
    title: "登录ip",
    dataIndex: "loginIp",
    checked: false,
  },
  {
    title: "登录时间",
    dataIndex: "loginTime",
    scopedSlots: { customRender: "loginTime" },
    checked: false,
  },
  {
    title: "上次登录ip",
    dataIndex: "lastLoginIp",
    checked: false,
  },
  {
    title: "上次登录时间",
    dataIndex: "lastLoginTime",
    scopedSlots: { customRender: "lastLoginTime" },
    checked: false,
  },
  {
    title: "注册时间",
    dataIndex: "createTime",
    scopedSlots: { customRender: "createTime" },
    checked: true,
    width: "150px",
  },
  {
    title: "修改时间",
    dataIndex: "modifyTime",
    scopedSlots: { customRender: "modifyTime" },
    checked: false,
    width: "150px",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: "150px",
    scopedSlots: { customRender: "action" },
    checked: true,
  },
];
// 表格拦数据 localStorage名称，保证每个页面都是唯一的
const columnslocalStorage = "UserListColumns6";

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
      visible: false,
      model: null,
      // 查看用户详细信息Modal
      userInfoVisible: false,
      userInfoModel: null,
      timeStampToFormatDate,
      // 价格分组数组
      businessPriceGroupData: [],
      // 更改用户类型弹窗是否显示
      modifyUserTypeVisible: false,
      // boss版本数据
      bossVersionData: [],
      // 用户类型是否选择boss类型
      isBoss: false,
      moment
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
    // 创建表单
    this.modifyUserTypeForm = this.$form.createForm(this);
  },
  created() {
    // 初始化表格列数据
    this.initColumnsData();
    // 获取价格分组列表
    this.businessPriceGroupList();
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
        this.queryParam = {};
        // 获取价格分组列表
        this.businessPriceGroupList();
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
    // 会员详细信息查看
    userInfoShow(record) {
      this.model = {
        title: "查看会员详细信息",
        data: [
          {
            label: "ID",
            item: [
              {
                formType: "text",
                col: 24,
                value: record.id,
              },
            ],
          },
          {
            label: "余额",
            item: [
              {
                formType: "text",
                col: 24,
                value: record.money,
              },
            ],
          },
          {
            label: "会员状态",
            item: [
              {
                formType: "text",
                col: 24,
                value: record.stateName,
              },
            ],
          },
          {
            label: "接口状态",
            item: [
              {
                formType: "text",
                col: 24,
                value: record.apiStateName,
              },
            ],
          },
          {
            label: "注册时间",
            item: [
              {
                formType: "text",
                col: 24,
                value:
                  record.createTime === null
                    ? "-"
                    : timeStampToFormatDate(record.createTime),
              },
            ],
          },
          {
            label: "上次登录时间",
            item: [
              {
                formType: "text",
                col: 24,
                value:
                  record.lastLoginTime === null
                    ? "-"
                    : timeStampToFormatDate(record.lastLoginTime),
              },
            ],
          },
          {
            label: "上次登录IP",
            item: [
              {
                formType: "text",
                col: 24,
                value: record.lastLoginIp,
              },
            ],
          },
          {
            label: "最后登录时间",
            item: [
              {
                formType: "text",
                col: 24,
                value:
                  record.loginTime === null
                    ? "-"
                    : timeStampToFormatDate(record.loginTime),
              },
            ],
          },
          {
            label: "最后登录IP",
            item: [
              {
                formType: "text",
                col: 24,
                value: record.loginIp,
              },
            ],
          },
        ],
      };
      this.visible = true;
    },
    /**
     * 修改会员状态
     * @param {*} record 列表对象
     * @param {*} state 状态true启动，false停用
     */
    modifyStateModel(record, state) {
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: state ? "启用" : "停用",
        where: {
          // 是否显示
          isShow: true,
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
                decorator: ["modelName", { initialValue: "modifyState" }],
              },
            ],
          },
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["state", { initialValue: state }],
              },
            ],
          },
          {
            label: "原因",
            notVif: state,
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "desc",
                  { rules: [{ required: true, message: "请输入原因" }] },
                ],
              },
            ],
          },
        ],
      };
      this.visible = true;
    },
    /**
     * 关闭
     */
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      /*
      if (this.selectedRows.length === 0) {
        this.$message.error('请至少选择一个,再操作')
        return
      }
      */
      const form = this.$refs.createModal.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.modelName === "addUser") {
            // 添加用户
            Add(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.modelName === "edit") {
            // 编辑
            // md5加密
            values.superPassword = pwd(values.superPassword);
            Edit(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.modelName === "modifyState") {
            // 编修改用户状态
            ModifyState(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.modelName === "modifyPriceGroup") {
            // 判断必须选中一个
            if (this.selectedRowKeys.length === 0) {
              this.$message.warning("请选择要修改的用户");
              return;
            }
            // 设置id数组
            values.id = this.selectedRows.map((item) => item.id);
            // 修改价格分组
            var params = new URLSearchParams();
            params.append("id[]", values.id);
            params.append("priceGroup", values.priceGroup);
            ModifyPriceGroup(params).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.modelName === "modifyBossDueTime") {
            // 修改boss到期时间
            ModifyBossDueTime(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          }
        }
      });
    },
    /**
     * 关闭用户信息
     */
    handleUserInfoCancel() {
      this.userInfoVisible = false;
    },
    // 查询用户详细信息
    queryUserInfo(record) {
      this.userInfoVisible = true;
      this.userInfoModel = {
        title: "详细信息",
        data: [
          { label: "会员ID", value: record.id },
          { label: "BossId", value: record.bossId },
          { label: "代理商ID", value: record.agentId },
          { label: "推荐人ID", value: record.referrerId },
          { label: "会员账号", value: record.userName },
          { label: "余额", value: record.money },
          { label: "类型", value: record.userType },
          { label: "QQ号", value: record.qq },
          { label: "微信号", value: record.weixin },
          { label: "状态", value: record.state },
          { label: "节点数", value: record.deviceNum },
          {
            label: "上次登录时间",
            value:
              record.lastLoginTime === null || record.lastLoginTime === 0
                ? "-"
                : this.timeStampToFormatDate(record.lastLoginTime),
          },
          { label: "上次登录ip", value: record.lastLoginIp },
          {
            label: "登录时间",
            value:
              record.lastLoginTime === null || record.lastLoginTime === 0
                ? "-"
                : this.timeStampToFormatDate(record.lastLoginTime),
          },
          { label: "登录ip", value: record.loginIp },
          { label: "注册时间", value: this.timeStampToFormatDate(record.createTime) },
          {
            label: "更新时间",
            value:
              record.modifyTime === null || record.modifyTime === 0
                ? "-"
                : this.timeStampToFormatDate(record.modifyTime),
          },
        ],
      };
      // this.userInfoModel = model
    },
    /**
     * 删除用户
     */
    userDel(record) {
      const self = this;
      this.$confirm({
        title: "您确定要删除用户?",
        content: (h) => (
          <div style="color:red;">
            正在删除：ID: {record.id}, 账号: {record.userName}
          </div>
        ),
        onOk() {
          // eslint-disable-next-line promise/param-names
          return new Promise((resilve, reject) => {
            RemoveById({ id: record.id })
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
    // 查询财务明细
    queryFinance(record) {
      // ({ path: '/finance/user?userId=' + record.user.id })
      this.$router.push({ name: "FinanceUser", params: { userId: record.id } });
    },
    queryDepositOrder(record) {
      this.$router.push({ name: "AddFundsOrder", params: { userId: record.user.id } });
    },
    // 用户添加model
    addUserModel() {
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "添加用户",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["modelName", { initialValue: "addUser" }],
              },
            ],
          },
          {
            label: "会员类型",
            item: [
              {
                formType: "radio-group",
                options: [
                  { label: "会员", value: "USER" },
                  { label: "代理商", value: "AGENT" }
                ],
                decorator: [
                  "userType",
                  {
                    initialValue: "USER",
                    rules: [{ required: true, message: "还未选择会员类型" }],
                  },
                ],
              },
            ],
          },
          {
            label: "账号",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入手机号",
                decorator: [
                  "userName",
                  {
                    rules: [
                      { required: true, min: 11, max: 11, message: "请输入11位手机号码" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            label: "QQ号",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入QQ号，可以不填",
                decorator: ["qq"],
              },
            ],
          },
          {
            label: "微信号",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入微信号，可以不填",
                decorator: ["weixin"],
              },
            ],
          },
          {
            label: "登录密码",
            item: [
              {
                formType: "input",
                type: "password",
                col: 24,
                placeholder: "请输入登录密码，最低8位",
                decorator: [
                  "password",
                  { rules: [{ required: true, min: 8, message: "登录密码最低8位" }] },
                ],
              },
            ],
          },
        ],
      };
    },
    /**
     * 编辑
     */
    editModel(record) {
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "编辑",
        where: {
          // 是否显示
          notVshow: false,
          label: "ID",
          decorator: ["id", { initialValue: record.id }],
        },
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              { formType: "input", decorator: ["modelName", { initialValue: "edit" }] },
            ],
          },
          {
            label: "BossId",
            notVshow: record.userType === "BOSS",
            item: [
              {
                formType: "input",
                decorator: ["bossId", { initialValue: record.bossId }],
                placeholder: "请输入BossId",
              },
            ],
          },
          {
            label: "代理商ID",
            notVshow: record.userType === "BOSS" || record.userType === "AGENT",
            item: [
              {
                formType: "input",
                decorator: ["agentId", { initialValue: record.agentId }],
                placeholder: "请输入代理商ID",
              },
            ],
          },
          {
            label: "推荐人ID",
            notVshow: record.userType === "BOSS" || record.userType === "AGENT",
            item: [
              {
                formType: "input",
                decorator: ["referrerId", { initialValue: record.referrerId }],
                placeholder: "请输入推荐人ID",
              },
            ],
          },
          {
            label: "登录账号",
            item: [
              {
                formType: "input",
                decorator: [
                  "userName",
                  {
                    initialValue: record.userName,
                    rules: [{ required: true, message: "登录账号不能为空" }],
                  },
                ],
                placeholder: "请输入登录账号",
              },
            ],
          },
          {
            label: "QQ号",
            item: [
              {
                formType: "input",
                decorator: ["qq", { initialValue: record.qq }],
                placeholder: "请输入QQ号",
              },
            ],
          },
          {
            label: "微信",
            item: [
              {
                formType: "input",
                decorator: ["weixin", { initialValue: record.weixin }],
                placeholder: "请输入微信",
              },
            ],
          },
          {
            label: "登录密码",
            item: [
              {
                formType: "input",
                decorator: [
                  "password",
                  { rules: [{ min: 8, message: "登录密码最少8位" }] },
                ],
                placeholder: "修改登录密码，为空不修改",
              },
            ],
          },
          {
            label: "超级密码",
            item: [
              {
                formType: "input",
                type: "password",
                col: 24,
                placeholder: "请输入超级密码",
                decorator: [
                  "superPassword",
                  { rules: [{ required: true, message: "超级密码不能为空" }] },
                ],
              },
            ],
          },
        ],
      };
      this.visible = true;
    },
    /**
     * 修改boss到期时间
     * @param {*} record
     */
    onModifyBossDueTime(record) {
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "修改BOSS到期时间",
        where: {
          // 是否显示
          notVshow: false,
          label: "ID",
          decorator: ["userId", { initialValue: record.id }],
        },
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["modelName", { initialValue: "modifyBossDueTime" }],
              },
            ],
          },
          {
            label: "到期时间",
            item: [
              {
                formType: "text",
                col: 24,
                value: moment(record.bossConfig.dueTime).format('YYYY-MM-DD'),
              },
            ],
          },
          {
            label: "增加到期时间/天",
            item: [
              {
                formType: "input",
                type: "number",
                col: 24,
                placeholder: "请输入到期时间,(单位：天)，叠加之前的到期时间",
                decorator: [
                  "dueTime",
                  { rules: [{ required: true, message: "到期时间不能为空" }] },
                ],
              },
            ],
          },
        ],
      };
      this.visible = true;
    },
    /**
     * 获取业务价格组列表
     */
    businessPriceGroupList() {
      BusinessPriceGroupList().then((res) => {
        this.businessPriceGroupData = res.result;
      });
    },
    /**
     * 修改业务价格组model
     */
    modifyPriceGroupModel() {
      // 判断必须选中一个
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning("请选择要修改的用户");
        return;
      }
      // 创建数组
      let priceGroup = [];
      this.businessPriceGroupData.forEach((item) => {
        priceGroup.push({ label: item.name, value: item.id });
      });
      this.model = {
        title: "修改价格分组",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["modelName", { initialValue: "modifyPriceGroup" }],
              },
            ],
          },
          {
            label: "价格分组",
            item: [
              {
                formType: "select",
                decorator: [
                  "priceGroup",
                  { rules: [{ required: true, message: "请选择业务价格组" }] },
                ],
                options: priceGroup,
                placeholder: "请选择业务价格组",
              },
            ],
          },
        ],
      };
      this.visible = true;
    },
    /**
     * 修改用户类型关闭
     */
    modifyUserTypeHandleCancel() {
      // 关闭弹窗
      this.modifyUserTypeVisible = false;
    },
    /**
     *  修改用户类型
     */
    async modifyUserTypeModel(record) {
      // 清理表单数据
      // this.modifyUserTypeForm.resetFields();
      // 设置是否为BOSS
      this.isBoss = record.userType === "BOSS";
      setTimeout(() => {
        // 设置表单数据
        this.modifyUserTypeForm.setFieldsValue({
          userId: record.id,
          userType: record.userType,
        });
      }, 300);

      // 查询所有的版本集合
      const res = await BossVersionList();
      if (res.code === 0) {
        // 赋值
        this.bossVersionData = res.result;
      }
      // 显示弹窗
      this.modifyUserTypeVisible = true;
    },
    modifyUserTypeHandleOk() {
      const form = this.modifyUserTypeForm;
      form.validateFields(async (errors, values) => {
        if (!errors) {
          // 编辑
          const res = await ModifyUserType(values);
          if (handlerResult(res)) {
            // 刷新表格
            this.$refs.table.refresh();
            this.modifyUserTypeVisible = false;
          }
        }
      });
    },
    /**
     * 用户类型点击
     */
    onUserTypeChange(value) {
      this.isBoss = value === "BOSS";
    },
  },
};
</script>
