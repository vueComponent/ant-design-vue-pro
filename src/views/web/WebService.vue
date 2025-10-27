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
            <a-button v-action:add type="primary" icon="plus" @click="addShow">添加客服</a-button>
            <a-button v-action:imgConfig type="primary" icon="plus" @click="erweimaShow">客服二维码设置</a-button>
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
        <span slot="is_show" slot-scope="text, record">
          <a-switch v-if="$auth('WebService.isShow') && text===0" checked-children="开" un-checked-children="关" @change="onChangeIsShow($event, record)" />
          <a-switch v-if="$auth('WebService.isShow') && text===1" checked-children="开" un-checked-children="关" default-checked @change="onChangeIsShow($event, record)" />
          <div v-if="$auth('WebService.isShow') === false" v-html="text===0 ? '关' : '开'"></div>
        </span>
        <span slot="img_url" slot-scope="text">
          <img :src="text" width="50" height="50"/>
        </span>
        <span slot="create_time" v-html="text > 0 ? timeStampToFormatDate(text) : '-'" slot-scope="text" />
        <span slot="modify_time" v-html="text > 0 ? timeStampToFormatDate(text) : '-'" slot-scope="text" />
        <span v-action:operation slot="action" slot-scope="text, record">
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
      <!--密钥配置model-->
      <a-modal
        :visible="configVisible"
        :width="640"
        title="客服二维码设置"
        okText="保存"
        cancel-text="取消"
        @cancel="handleConfigCancel"
        @ok="handleConfigOk"
      >
        <!--表单 并将表单的值绑定到this.from-->
        <a-form :form="form" v-bind="{labelCol: {xs: { span: 24 },sm: { span: 5 }},wrapperCol: {xs: { span: 24 },sm: { span: 17 }}}">
          <!--每一项元素-->
          <a-form-item label="显示二维码">
            <a-row :gutter="[8]">
              <a-col :span="24">
                <a-switch checked-children="开" un-checked-children="关" :checked="isShow" @change="imgModifyIsshowShow($event)" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="二维码说明">
            <a-row :gutter="[8]">
              <a-col :span="16">
                <a-input
                  v-decorator="['name',{rules: [{ required: true, message: '二维码说明不能为空' }]}]"
                  placeholder="请输入二维码说明"
                />
              </a-col>
              <a-col :span="8">
                <a-button type="primary" @click="imgSaveName">保存</a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="二维码上传">
            <a-row :gutter="[8]">
              <a-col :span="24">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :data="{id: 0}"
                  action="/main/web/service/imgConfig/uploadImg"
                  :showUploadList="false"
                  @change="uploadhandleChange"
                >
                  <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      上传
                    </div>
                  </div>
                </a-upload>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'

import CreateForm from '@/views/modules/CreateForm'
import CreateInfoModel from '@/views/modules/CreateInfoModel'
import { list, modifyIsShow, remove, add, edit, imgConfigGet, imgModifyIsshow, imgSaveName } from '@/api/web/webService'
import { timeStampToFormatDate } from '@/utils/timeUtil'
const columns = [
  /*
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  */
  {
    title: '客服名称', dataIndex: 'name', checked: true
  },
  {
    title: '类型', dataIndex: 'type', checked: true
  },
  {
    title: '号码', dataIndex: 'number', checked: true
  },
  {
    title: '排序', dataIndex: 'sort', checked: true
  },
  {
    title: '显示隐藏', dataIndex: 'is_show', scopedSlots: { customRender: 'is_show' }, checked: true
  },
  {
    title: '添加时间', dataIndex: 'create_time', scopedSlots: { customRender: 'create_time' }, width: '170px', checked: true
  },
  {
    title: '修改时间', dataIndex: 'modify_time', scopedSlots: { customRender: 'modify_time' }, width: '170px', checked: false
  },
  {
    title: '操作人', dataIndex: 'operatorName', checked: false
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
const columnsLocalStorage = 'WebServiceColumns5'

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
      timeStampToFormatDate,
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
        content: h => <div style="color:red;">正在删除：ID: { record.name }</div>,
        onOk () {
          return new Promise(resolve => {
            remove({ id: record.id }).then((response) => {
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
        title: '添加客服',
        decorator: ['id', { initialValue: 0 }],
        data: [
          {
            label: '类型',
            item: [
              {
                // select类型
                formType: 'select',
                value: [{ name: '电话', value: '0' }, { name: 'QQ号', value: '1' }, { name: '微信', value: '2' }],
                decorator: ['type', { rules: [{ required: true, message: '请选择类型' }] }],
                placeholder: '请选择类型'
              }
            ]
          },
          {
            label: '客服名称',
            item: [
              {
                formType: 'input',
                decorator: ['name', { initialValue: '', rules: [{ required: true, message: '客服名称不能为空' }] }],
                placeholder: '请输入客服名称'
              }
            ]
          },
          {
            label: '号码',
            item: [
              {
                formType: 'input',
                decorator: ['number', { initialValue: '', rules: [{ required: true, message: '号码不能为空' }] }],
                placeholder: '请输入号码'
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
        title: '编辑收款机构',
        decorator: ['id', { initialValue: record.id }],
        data: [
          {
            label: '客服名称',
            item: [
              {
                formType: 'input',
                decorator: ['name', { initialValue: record.name, rules: [{ required: true, message: '客服名称不能为空' }] }],
                placeholder: '请输入客服名称'
              }
            ]
          },
          {
            label: '号码',
            item: [
              {
                formType: 'input',
                decorator: ['number', { initialValue: record.number, rules: [{ required: true, message: '号码不能为空' }] }],
                placeholder: '请输入号码'
              }
            ]
          },
          {
            label: '排序',
            item: [
              {
                formType: 'input',
                decorator: ['sort', { initialValue: record.sort, rules: [{ required: true, message: '排序不能为空' }] }],
                placeholder: '请输入排序'
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
          if (values.id > 0) {
            // 编辑
            edit(values).then(response => {
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
          } else {
            // 添加
            add(values).then(response => {
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
        }
      })
    },
    // 修改显示状态
    onChangeIsShow (checked, record) {
      modifyIsShow({ id: record.id, isShow: checked }).then((response) => {
        if (response.code === 0) {
          this.$message.success('操作成功')
          this.list()
        } else {
          this.$message.error(response.message)
          }
      }).catch(err => {
        this.$message.error(err + '')
      })
    },
    // 修改二维码显示状态
    imgModifyIsshowShow (checked) {
      this.isShow = checked
      imgModifyIsshow({ isShow: checked }).then((response) => {
        if (response.code === 0) {
          this.$message.success('操作成功')
          this.list()
        } else {
          this.$message.error(response.message)
          }
      }).catch(err => {
        this.$message.error(err + '')
      })
    },
    /**
     * 按用户级别id获取全部指定模板
     */
    list () {
      // const requestParameters = Object.assign({}, this.queryParam)
      list().then(res => {
          if (res.code === 0) {
            this.listData = res.result
          }
      })
    },
    /**
     * 保存二维码
     */
    erweimaShow () {
      this.configVisible = true
      imgConfigGet().then(res => {
        if (res.code === 0 && res.result !== null) {
          this.isShow = res.result.is_show === 1
          const form = this.form
          this.imageUrl = res.result.path
          form.setFieldsValue({ 'name': res.result.name })
        }
      }).catch(error => {
        this.$message.error(error + '')
      })
    },
    /**
     * 生成密钥
     */
    imgSaveName () {
      // const name = this.form.getFieldValue('name')
      // alert(name)
      this.form.validateFields((errors, values) => {
        if (!errors) {
          imgSaveName(values).then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
            } else {
              this.$message.error(res.message)
            }
          }).catch(error => {
            this.$message.error(error + '')
          })
        }
      })
    },
    // 关闭密钥配置
    handleConfigCancel () {
      this.configVisible = false
    },
    // 提交保存密钥
    handleConfigOk () {
      this.configVisible = false
    },
    // 上传回调
    uploadhandleChange (re) {
      if (re.file.response.code === 0) {
        this.$message.success('上传成功')
        this.erweimaShow()
      } else {
        this.$message.error(re.file.response.message)
      }
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
