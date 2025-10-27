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
    <template v-slot:content>
    </template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="6" :sm="8">
              <a-form-item label="标题">
                <a-input v-model="queryParam.title" @keyup.enter="$refs.table.refresh(true)" allowClear />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
            </template>
            <a-col :md="(!advanced && 6) || 6" :sm="8">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
                <a v-show="false" @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
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
          <div style="min-height:30px" class="table-operator">
            <a-button @click="onSave()"><a-icon type="add" />添加</a-button>
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
        <span slot="createTime" v-html="moment(text).format('YYYY-MM-DD HH:mm:ss')" slot-scope="text" />
        <span slot="updateTime" v-html="text !== null && text !== 0 ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'" slot-scope="text" />
        <span slot="action" slot-scope="text, record">
          <a @click="onSave(record.id)" title="编辑"><a-icon type="edit" /></a>
          <a-divider type="vertical" />
          <a @click="remove(record)" title="删除"><a-icon type="delete" /></a>
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
    <!--添加或编辑model-->
    <a-modal
        :visible="saveVisible"
        :width="840"
        :dialog-style="{ top: '30px' }"
        :title="title"
        okText="确定"
        cancel-text="取消"
        @cancel="handleSaveCancel"
        @ok="handleSaveOk"
      >
        <!--表单 并将表单的值绑定到this.from-->
        <a-form :form="saveForm" v-bind="{labelCol: {xs: { span: 24 },sm: { span: 5 }},wrapperCol: {xs: { span: 24 },sm: { span: 17 }}}">
          <a-form-item v-show="false" label="id">
            <a-row :gutter="[8]">
              <a-col :span="20">
                <a-input
                  v-decorator="['id']"
                />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="标题">
            <a-row :gutter="[8]">
              <a-col :span="20">
                <a-input
                  v-decorator="['title',{rules: [{ required: true, message: '标题不能为空' }]}]"
                  placeholder="请输入标题"
                />
              </a-col>
            </a-row>
          </a-form-item>
          上机说明
          <!--<WangEditor v-model="editorContent"></WangEditor>-->
            <div style="border: 1px solid #ccc;">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height: 400px; overflow-y: hidden;"
                v-model="html"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
              />
            </div>
        </a-form>
      </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'

// 引入wangeditor富文本 css
import '@wangeditor/editor/dist/css/style.css'
// 引入wangeditor富文本工具栏和编辑框
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import CreateForm from '@/views/modules/CreateForm'
import { Page, Remove, Save, GetById } from '@/api/notice/nodebindDesc'

const columns = [
  /*
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  */
  {
    title: '标题', dataIndex: 'title', checked: true
  },
  {
    title: '排序', dataIndex: 'sort', checked: true
  },
  {
    title: '发布时间', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' }, width: '150px', checked: true
  },
  {
    title: '修改时间', dataIndex: 'updateTime', scopedSlots: { customRender: 'updateTime' }, width: '150px', checked: false
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '70px',
    scopedSlots: { customRender: 'action' },
    checked: true
  }
]

// 表格拦数据 localStorage名称
const columnslocalStorage = 'NodebindDesc'

export default {
  name: 'NodebindDesc',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    Editor,
    Toolbar
  },
  // el 创建前
  beforeCreate () {
    // 创建表单
    this.form = this.$form.createForm(this)
    this.saveForm = this.$form.createForm(this)
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
        pageSizeOptions: ['10', '30', '50', '70', '100', '150', '200'],
        showTotal: total => `共 ${total} 条数据`
      },
      // 表格栏数据对象
      columnsData: [],
      // 筛选列对象,data=数据,visible=是否显示筛选列(如果不显示，使用columns显示全部表格数据),model=菜单是否显示
      screenColumns: { data: [], visible: true, model: false },
      // 筛选列设置
      screeVisible: false,
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
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      moment,
      // Modal
      visible: false,
      model: null,
      // 添加或编辑model标题
      title: '',
      saveVisible: false,
      editor: null,
      html: '',
      toolbarConfig: { },
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default', // or 'simple'
    }
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
  created () {
    // 初始化表格列数据
    this.initColumnsData()
  },
  computed: {
    // 表格选择功能的配置
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
        // 设置起始和结束时间
        this.queryParam = { }
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
    /**
     * 批量删除
     */
    remove (record) {
      const self = this
      this.$confirm({
        title: '您确定要删除?',
        content: h => <div style="color:red;">正在删除: {record.title}</div>,
        onOk () {
          return new Promise((resolve) => {
            Remove({ id : record.id }).then((response) => {
              if (response.code === 0) {
                self.$message.success(response.message)
                // 刷新表格
                self.$refs.table.refresh()
              } else {
                self.$message.error(response.message)
              }
            }).catch(err => {
              self.$message.error(err + '')
            }).finally(() => {
              resolve()
            })
          })
        },
        class: 'test'
      })
    },
    // 取消保存操作
    handleSaveCancel () {
      this.saveVisible = false
    },
    // 保存操作
    handleSaveOk () {
      this.saveForm.validateFields((errors, values) => {
        if (!errors) {
          values.content = this.html
          Save(values).then(res => {
            if (res.code === 0) {
              this.saveVisible = false
              // 刷新表格
              this.$refs.table.refresh()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    async onSave (id) {
      if (id !== undefined) {
        this.title = '编辑';
        // 按id查询上机说明
        const res = await GetById({ id: id })
        setTimeout(() => {
          this.saveForm.setFieldsValue({ 'id': res.result.id })
          this.saveForm.setFieldsValue({ 'title': res.result.title })
          this.html = res.result.content
        }, 100)
      } else{
        this.title = '添加上机说明';
        // 清理表单数据
        this.saveForm.resetFields()
        this.html = ''
      }
      this.saveVisible = true
    },
    onCreated (editor) {
      this.editor = Object.seal(editor)// 一定要用 Object.seal() ，否则会报错
    },
    beforeDestroy () {
      const editor = this.editor
      if (editor == null) return
      editor.destroy()// 组件销毁时，及时销毁编辑器
    }
  }
}
</script>