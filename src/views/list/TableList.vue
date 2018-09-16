<template>
  <a-card :bordered="false">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null : 'fold'">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item
                label="规则编号"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="使用状态"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select placeholder="请选择">
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="调用次数"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input-number style="width: 100%" placeholder="请输入"/>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="48" v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item
                label="更新日期"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-date-picker style="width: 100%" placeholder="请输入更新日期"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="使用状态"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择">
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="描述"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入"/>
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <span style="float: right; margin-top: 3px;">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? '收起' : '展开' }}
            <a-icon :type="advanced ? 'up' : 'down'"/>
          </a>
        </span>
      </a-form>
    </div>

    <s-table
      size="default"
      :columns="columns"
      :data="loadData"
      :showAlertInfo="true"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onChange }"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <a-modal
      title="操作"
      :width="800"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='规则编号'
          hasFeedback
          validateStatus='success'
        >
          <a-input placeholder='规则编号' v-model="mdl.no" id='no' />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='服务调用次数'
          hasFeedback
          validateStatus='success'
        >
          <a-input-number :min="1" id="callNo" v-model="mdl.callNo" style="width: 100%" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='状态'
          hasFeedback
          validateStatus='warning'
        >
          <a-select defaultValue='1' v-model="mdl.status">
            <a-select-option value='1'>Option 1</a-select-option>
            <a-select-option value='2'>Option 2</a-select-option>
            <a-select-option value='3'>Option 3</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='描述'
          hasFeedback
          help='请填写一段描述'
        >
          <a-textarea :rows="5" v-model="mdl.description" placeholder="..." id='description'/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='更新时间'
          hasFeedback
          validateStatus='error'
        >
          <a-date-picker
            style="width: 100%"
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select Time"
          />
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
  import STable from '@/components/table/'
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "TableList",
    components: {
      ATextarea,
      STable
    },
    data () {
      return {
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        form: null,
        mdl: {},

        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '规则编号',
            dataIndex: 'no'
          },
          {
            title: '描述',
            dataIndex: 'description'
          },
          {
            title: '服务调用次数',
            dataIndex: 'callNo',
            sorter: true,
            needTotal: true,
            customRender: (text) => text + ' 次'
          },
          {
            title: '状态',
            dataIndex: 'status',
            needTotal: true
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
            sorter: true
          },
          {
            table: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' },
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.get('/service', {
            params: Object.assign(parameter, this.queryParam)
          }).then(res => {
            return res.result
          })
        },

        selectedRowKeys: [],
        selectedRows: []
      }
    },
    methods: {
      handleEdit (record) {
        this.mdl = Object.assign({}, record)
        console.log(this.mdl)
        this.visible = true
      },
      handleOk () {

      },
      onChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
    },
    watch: {
      /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
    }
  }
</script>