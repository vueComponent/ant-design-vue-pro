<template>
  <page-header-wrapper v-if="pageShow">
    <template v-slot:extra>
      <a-tooltip title="刷新页面">
        <a-icon
          type="reload"
          style="font-size: 24px;cursor: pointer;color: #151515;"
          @click="refresh"
        />
      </a-tooltip>
    </template>
    <a-card :bordered="false">
      <s-table
        ref="table"
        size="middle"
        :showTotal="true"
        :rowKey="record=>record.id"
        :columns="columnsData"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
        :pagination="pagination"
      >
        <!-- 表头 -->
        <template slot="title">
          <div style="min-height:30px" class="table-operator">
            <a @click="onSave()"><a-icon type="plus" /> 添加</a>
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
        <!--系统短信-->
        <span slot="system" slot-scope="text">
          {{ text === 1 ? '是' : '否' }}
        </span>
        <span slot="signName" slot-scope="text, record">
          {{ '[' + text + ']' }}
        </span>
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="onSave(record)" title="编辑"><a-icon type="edit" /></a>
            <a-divider type="vertical" />
            <a @click="remove(record)" title="删除"><a-icon type="delete" /></a>
          </template>
        </span>
      </s-table>
    </a-card>
     <!-- 模态框 -->
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
import moment from 'moment'
import { STable, Ellipsis } from '@/components'

import CreateForm from '@/views/modules/CreateForm'
import { Page, Save, Remove } from '@/api/apiConfig/sms'
import { isPageResult } from '@/api/handlerResult'

const columns = [
  /*
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  */
  {
    title: '短信服务商', dataIndex: 'smsServiceName', checked: true
  },
  {
    title: '系统短信', dataIndex: 'system', scopedSlots: { customRender: 'system' }, checked: true
  },
  {
    title: '短信签名', dataIndex: 'signName', scopedSlots: { customRender: 'signName' }, checked: true
  },
  {
    title: '时间', dataIndex: 'createdAt', checked: true
  },
  {
    title: '备注', dataIndex: 'notes', checked: true
  },
  {
    title: "操作",
    dataIndex: "action",
    width: "80px",
    scopedSlots: { customRender: "action" },
    checked: true,
  }
]

// 表格拦数据 localStorage名称
const columnslocalStorage = 'SmsApiConfigColumns'

export default {
  name: 'SmsApiConfig',
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  data () {
    this.columns = columns
    return {
      // 页面是否显示
      pageShow: true,
      /**
       * 表格
       */
      // 分页数组
      pagination: {
        pageSizeOptions: ['10', '30', '50', '70', '100'],
        showTotal: total => `共 ${total} 条数据`
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
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        // 每次加载删除选择中值
        this.selectedRowKeys = []
        this.selectedRows = []
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return Page(requestParameters).then((res) => {
          if (isPageResult(res)) {
            return res.result
          }
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      visible: false,
      model: null,
      moment
    }
  },
  created () {
    // 初始化表格列数据
    this.initColumnsData()
  },
  computed: {
    rowSelection () {
      return {
        // 指定选中项的 key 数组，需要和 onChange 进行配合
        selectedRowKeys: this.selectedRowKeys,
        // 选中项发生变化时的回调
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    // 刷新
    refresh () {
      this.pageShow = false
      this.$nextTick(function () {
        this.pageShow = true
      })
    },
    /**
     * @description: 表格选中状态改变执行
     * @param {*}
     */
     onSelectChange (selectedRowKeys, selectedRows) {
      // 设置选中k值
      this.selectedRowKeys = selectedRowKeys
      // 设置选中行数据
      this.selectedRows = selectedRows
    },
     /**
     * 搜索展开收起切换
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
     * 初始化表格列数据
     */
    initColumnsData () {
      this.screenColumns.data = localStorage.getItem(columnslocalStorage) === null ? columns : JSON.parse(localStorage.getItem(columnslocalStorage))
      // 获取表格列数据
      const createColumnsData = this.createColumnsData(this.screenColumns.data)
      // 判断是否使用筛选列功能，真使用，假不使用
      this.columnsData = this.screenColumns.visible ? createColumnsData : columns
    },
    /**
     *  保存表格栏数据到localStorage，并且把新的数据赋值给columnsData
     * @param {*} index 索引
     * @param {*} item 列对象
     */
    saveScreenColumns (index, item) {
      // 设置checked值
      item.checked = !item.checked
      // 筛选列数据赋值给data
      const data = this.screenColumns.data
      // 设置当选索引表格栏数据
      data[index] = item
      // 把表格栏数据保存到localStorage中
      localStorage.setItem(columnslocalStorage, JSON.stringify(data))
      // 保存数据后，把更改后的数据重新赋值给columnsData
      this.columnsData = this.createColumnsData(data)
    },
    /**
     * 按筛选列数据checked为真，生成新表格列数据
     * @param {*} screenColumns 筛选列数据
     */
    createColumnsData (screenColumns) {
      var data = []
      // 遍历筛选列数据
      screenColumns.forEach(item => {
        // 判断checked为真
        if (item.checked) {
          // 添加到数组里
          data.push(item)
        }
      })
      return data
    },
    // 删除
    remove(record) {
      const self = this;
      this.$confirm({
        title: "您确定要删除?",
        content: (h) => <div style="color:red;">正在删除：ID: {record.id}</div>,
        onOk() {
          return new Promise((resolve) => {
            Remove({ id: record.id })
              .then((response) => {
                if (response.code === 0) {
                  self.$message.success("操作成功");
                  // 刷新表格
                  self.$refs.table.refresh(true)
                } else {
                  self.$message.error(response.message);
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
     * 添加和保存编辑
     */
    onSave(record) {
      const form = this.$refs.createModal.form;
      form.resetFields();
      this.visible = true;
      this.model = {
        title: record ? "编辑" : "添加",
        where: {
          // 是否显示
          notVshow: record === undefined,
          label: "ID",
          decorator: ["id", { initialValue: record ? record.id : '' }],
        },
        data: [
          {
            label: "短信服务商",
            item: [
              {
                formType: "select",
                options: [
                  { label: "阿里短信", value: 'ALISMS' },
                  { label: "云智信", value: 'YUNZHIXIN' }
                ],
                decorator: [
                  "smsService",
                  {
                    initialValue: record ? record.smsService : 'ALISMS',
                    rules: [{ required: true, message: "不能为空" }],
                  },
                ]
              },
            ],
          },
          {
            label: "系统短信",
            item: [
              {
                formType: "radio-group",
                options: [
                  { label: "是", value: 1 },
                  { label: "否", value: 0 },
                ],
                decorator: ["system", { initialValue: record ? record.system : 0 }],
              },
            ],
          },
          {
            label: "短信签名",
            item: [
              {
                formType: "input",
                decorator: [
                  "signName",
                  {
                    initialValue: record ? record.signName : '',
                    rules: [{ required: true, message: "短信签名不能为空" }],
                  },
                ],
                placeholder: "请输入短信签名",
              },
            ],
          },
          {
            label: "接口编号",
            item: [
              {
                formType: "input",
                decorator: [
                  "apiId",
                  {
                    initialValue: record ? record.apiId : '',
                    rules: [{ required: true, message: "接口编号不能为空" }],
                  },
                ],
                placeholder: "请输入接口编号",
              },
            ],
          },
          {
            label: "接口密钥",
            item: [
              {
                formType: "input",
                decorator: [
                  "apiKey",
                  {
                    initialValue: record ? record.apiKey : '',
                    rules: [{ required: true, message: "接口密钥不能为空" }],
                  },
                ],
                placeholder: "请输入接口密钥",
              },
            ],
          },
          {
            label: "模板编码",
            item: [
              {
                formType: "input",
                decorator: [
                  "tplCode",
                  {
                    initialValue: record ? record.tplCode : '',
                    rules: [{ required: true, message: "模板编码不能为空" }],
                  },
                ],
                placeholder: "请输入模板编码",
              },
            ],
          },
        ],
      };
    },
    /**
     * 添加和编辑关闭
     */
     handleCancel() {
      const form = this.$refs.createModal.form;
      form.resetFields();
      this.visible = false;
    },
    /**
     * 添加和编辑提交表单
     */
    handleOk() {
      const form = this.$refs.createModal.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          // 编辑
          Save(values).then((response) => {
            if (response.code === 0) {
              this.$message.success("操作成功");
              this.visible = false;
              // 刷新表格
              this.$refs.table.refresh(true)
            } else {
              this.$message.error(response.message);
            }
          }).catch((error) => {
            this.$message.error(error + "");
          });
        }
      });
    }
  }
}
</script>
