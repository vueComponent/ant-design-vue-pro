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
      二级域名可以不设置备案号，顶级域名必须设置备案编号
    </template>
    <a-card :bordered="false">
      <!--
      <div class="table-operator">
        <a-button v-action:add type="primary" icon="plus" @click="handleAdd">新建111</a-button>
        <a-dropdown v-action:add v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            lock | unlock
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </div>
      -->
      <a-table :columns="columnsData.length === 0 ? columns : columnsData" :data-source="listData">
        <template slot="title">
          <div style="min-height:30px" class="table-operator">
            <a-button v-action:add type="primary" icon="plus" @click="addShow">添加</a-button>
            <a-dropdown style="float:right;" v-model="screeVisible">
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="(item, index) in screenColumns"
                  :key="index"
                  @click="saveColumnsLocalStorage(index, item)"
                >
                  <a-checkbox :checked="item.checked">{{ item.title }}</a-checkbox>
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 0px"><a-icon type="profile" /> 筛选列设置 <a-icon type="down" /> </a-button>
            </a-dropdown>
          </div>
        </template>
        <span slot="createTime" v-html="moment(text).format('YYYY-MM-DD HH:mm:ss')" slot-scope="text" />
        <span slot="updateTime" v-html="text !== null && text !== 0 ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'" slot-scope="text" />
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="editShow(record)" title="编辑">编辑</a>
            <a-divider type="vertical" />
            <a @click="remove(record)" title="删除">删除</a>
          </template>
        </span>
      </a-table>
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
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import CreateForm from '@/views/modules/CreateForm'
import CreateInfoModel from '@/views/modules/CreateInfoModel'
import { List, Remove, Save } from '@/api/web/beian'
const columns = [
  /*
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  */
  {
    title: '备案编号', dataIndex: 'icpNum', checked: true
  },
  {
    title: '网址', dataIndex: 'url', checked: true
  },
  {
    title: '添加时间', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' }, width: '170px', checked: true
  },
  {
    title: '修改时间', dataIndex: 'updateTime', scopedSlots: { customRender: 'updateTime' }, width: '170px', checked: false
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '110px',
    scopedSlots: { customRender: 'action' },
    checked: true
  }
]
// 表格拦数据 localStorage名称
const columnsLocalStorage = 'WebBeianColumns1'

export default {
  name: 'UserList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    CreateInfoModel
  },
  // el 创建前
  beforeCreate () {
    // 创建表单
    this.form = this.$form.createForm(this)
  },
  data () {
    this.columns = columns
    return {
      // 页面是否显示
      pageShow: true,
      /**
       * 表格
       */
      // 表格栏数据对象
      columnsData: [],
      // 筛选列设置数据对象，其他
      screenColumns: localStorage.getItem(columnsLocalStorage) === null ? columns : JSON.parse(localStorage.getItem(columnsLocalStorage)),
      // 筛选列设置
      screeVisible: false,
      moment,
      // 新增新增和编辑模板Modal
      visible: false,
      model: null,
      // 密钥配置modal
      configVisible: false,
      listData: [],
      imageUrl: '',
      isShow: true
    }
  },
  filters: {
  },
  created () {
    // 设置表格栏数据
    this.setColumnsData()
    this.list()
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
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
        this.list()
      })
    },
    // 设置表格栏数据对象
    setColumnsData () {
      var dataNew = []
      for (var i = 0; i < this.screenColumns.length; i++) {
          if (this.screenColumns[i].checked) {
            dataNew.push(this.screenColumns[i])
          }
      }
      this.columnsData = dataNew
    },
    // 保存表格栏数据对象到localStorage
    saveColumnsLocalStorage (index, item) {
      var staticData = item
      staticData.checked = !item.checked
      this.columns[index] = staticData
      var dataNew = []
      for (var i = 0; i < this.columns.length; i++) {
          if (this.columns[i].checked) {
            dataNew.push(this.columns[i])
          }
      }
      localStorage.setItem(columnsLocalStorage, JSON.stringify(this.columns))
      this.columnsData = dataNew
    },
    // 删除
    remove (record) {
      const self = this
      this.$confirm({
        title: '您确定要删除?',
        content: h => <div style="color:red;">正在删除： { record.icpNum }</div>,
        onOk () {
          return new Promise(resolve => {
            Remove({ id: record.id }).then((response) => {
              if (response.code === 0) {
                self.$message.success('操作成功')
                // 刷新表格
                self.list()
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
    /**
     * 添加
     */
    addShow () {
      this.visible = true
      this.model = {
        title: '添加备案或证书',
        decorator: ['id', { initialValue: '' }],
        data: [
          {
            label: '备案编号',
            item: [
              {
                formType: 'input',
                decorator: ['icpNum', { initialValue: '', rules: [{ required: true, message: '备案名称不能为空' }] }],
                placeholder: '请输入备案名称'
              }
            ]
          },
          {
            label: '备案网址',
            item: [
              {
                formType: 'input',
                decorator: ['url', { initialValue: '', rules: [
                  { required: true, message: '备案网址不能为空' },
                  // 正则网址校验
                  { pattern: /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/, message: '请输入正确的网址' }
                ] }],
                placeholder: '请输入备案网址，格式如：https://beian.miit.gov.cn/'
              }
            ]
          }
        ]
      }
    },
    /**
     * 编辑模板
     */
    editShow (record) {
      this.visible = true
      this.model = {
        title: '编辑',
        decorator: ['id', { initialValue: record.id }],
        data: [
          {
            label: '备案编号',
            item: [
              {
                formType: 'input',
                decorator: ['icpNum', { initialValue: record.icpNum, rules: [{ required: true, message: '备案编号不能为空' }] }],
                placeholder: '请输入备案编号'
              }
            ]
          },
          {
            label: '备案网址',
            item: [
              {
                formType: 'input',
                decorator: ['url', { initialValue: record.url, rules: [
                  { required: true, message: '备案网址不能为空' },
                  // 正则网址校验
                  { pattern: /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/, message: '请输入正确的网址' }
                ] }],
                placeholder: '请输入备案网址，格式如：https://beian.miit.gov.cn/'
              }
            ]
          }
        ]
      }
    },
    /**
     * 添加和编辑模板关闭
     */
    handleCancel () {
      const form = this.$refs.createModal.form
      form.resetFields()
      this.visible = false
    },
    /**
     * 添加和编辑模板提交表单
     */
    handleOk () {
      const form = this.$refs.createModal.form
      form.validateFields((errors, values) => {
        if (!errors) {
            // 编辑
            Save(values).then(response => {
            if (response.code === 0) {
              this.$message.success('操作成功')
              this.visible = false
              form.resetFields() // 清理表单数据（可不做）
              // 刷新表格
              this.list()
            } else {
              this.$message.error(response.message)
            }
            }).catch(error => {
            this.$message.error(error + '')
            })
        }
      })
    },
    /**
     * 按用户级别id获取全部指定模板
     */
    list () {
      // const requestParameters = Object.assign({}, this.queryParam)
      List().then(res => {
          if (res.code === 0) {
            this.listData = res.result
          }
      })
    }
  }
}
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 200px;
  height: 50px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
