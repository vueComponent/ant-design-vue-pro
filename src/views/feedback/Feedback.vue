<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-button type="primary" @click="getListData">刷新</a-button>
            </a-col>
            <a-col :span="6">
              <a-form-item label="反馈ID">
                <a-input v-model="search.id"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="UID">
                <a-input v-model="search.uid"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="处理人">
                <a-input v-model="search.handler"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="状态">
                <a-select v-model="search.status">
                  <a-select-option value="0">已处理</a-select-option>
                  <a-select-option value="1">待处理</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-date-picker v-decorator="[&quot;beginTime&quot;]" v-model="search.createTime" @change="createTimeChanged"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-date-picker v-decorator="[&quot;endTime&quot;]" v-model="search.updateTime" @change="updateTimeChanged"/>
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-button type="primary" @click="getListData">筛选</a-button>
            </a-col>
            <a-col :span="3">
              <a-button type="primary" @click="reset">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table :columns="columns" :data-source="tableData">
        <span slot="status" slot-scope="status">
          <a-tag v-if="status == 0">
            已处理
          </a-tag>
          <a-tag v-if="status == 1">
            未处理
          </a-tag>
        </span>
        <span slot="star" slot-scope="star,record">
          <a @click="look(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="deleteFeedBack(record.id)">删除  </a>
          <!-- <a-icon v-if="star" type="star" theme="filled" style="color: gold"/> -->
          <a-icon v-if="record.status == 1" style="color:gold;" type="star" theme="outlined"/>
        </span>
      </a-table>
      <a-modal
        title="用户反馈："
        :visible="isVisible"
        @ok="handleOk"
        :confirm-loading="confirmLoading"
        @cancel="handleCancel"
        cancelText="返回"
        okText="已处理"
      >
        <p>{{ modalData.content }}</p>
      </a-modal>
    </a-card>

  </page-header-wrapper>
</template>

<script>
import { getFeedBack, deleteFeedBack, updateFeedBack } from '@/api/planet' // 引入后台接口
const columns = [
  {
    title: '反馈ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'UID',
    dataIndex: 'userId',
    key: 'userId'
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName' // 接口返回的不知道是个字段 待确认
  },
    {
    title: '反馈内容',
    dataIndex: 'content', 
    key: 'content'
  },
  {
    title: '反馈时间',
    dataIndex: 'createTime', // 反馈时间取得是createTime，如果接口不是请替换字段  待确认
    key: 'createTime'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    key: 'handler' // 处理人怎么显示？后台接口没有返回 待确认
  },
  {
    title: '处理时间',
    dataIndex: 'updateTime',
    key: 'updateTime' // 处理时间取的是updateTime，如果接口不是请替换该字段  待确认
  },
  {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    scopedSlots: { customRender: 'star' }
  }
]

// const data = [
//   {
//     key: '1',
//     id: '000',
//     uid: 'ABC',
//     nickName: '胡彦斌',
//     feedbackTime: '2017-10-01 12:00',
//     status: '已处理',
//     handler: '胡彦斌',
//     handleTime: '2017-10-01 12:00',
//     operations: false
//   }, {
//     key: '2',
//     id: '000',
//     uid: 'ABC',
//     nickName: '胡彦斌',
//     feedbackTime: '2017-10-01 12:00',
//     status: '已处理',
//     handler: '胡彦斌',
//     handleTime: '2017-10-01 12:00',
//     operations: false
//   }, {
//     key: '3',
//     id: '000',
//     uid: 'ABC',
//     nickName: '胡彦斌',
//     feedbackTime: '2017-10-01 12:00',
//     status: '已处理',
//     handler: '胡彦斌',
//     handleTime: '2017-10-01 12:00',
//     operations: false
//   }, {
//     key: '4',
//     id: '000',
//     uid: 'ABC',
//     nickName: '胡彦斌',
//     feedbackTime: '2017-10-01 12:00',
//     status: '已处理',
//     handler: '胡彦斌',
//     handleTime: '2017-10-01 12:00',
//     operations: false
//   }, {
//     key: '5',
//     id: '000',
//     uid: 'ABC',
//     nickName: '胡彦斌',
//     feedbackTime: '2017-10-01 12:00',
//     status: '未处理',
//     handler: '',
//     handleTime: '',
//     operations: true
//   }, {
//     key: '6',
//     id: '000',
//     uid: 'ABC',
//     nickName: '胡彦斌',
//     feedbackTime: '2017-10-01 12:00',
//     status: '未处理',
//     handler: '',
//     handleTime: '',
//     operations: false
//   }
// ]

export default {
  name: 'Feedback',
  data () {
    return {
      columns,
      // data,
      modalData: '',
      search: {
        id: '', // 反馈id
        status: '', // 状态
        createTime: '',
        update: '',
        handler: '',
        uId: '' // 用户id
      },
      confirmLoading: false,
      isVisible: false, // 查看弹框显示和关闭
      tableData: '' // 表格数据
    }
  },
  created () {
    // 获取表格数据，从后台接口拿到数据初始化数据
    this.getListData()
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'search' })
  },
  methods: {
    deleteFeedBack (id) {
      var that = this
      this.$confirm({
        title: '确认删除吗?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onCancel () {
           that.$message.info('已取消!')
        },
        onOk: () => {
          deleteFeedBack(id).then(res => {
          if (res.success) {
          that.$message.info('删除成功!')
          that.getListData() // 删除成功后，刷新列表
          } else {
            that.$message.info('删除失败!')
          }
       })
       }
     })
    },
    getListData () {
      // 获取从planet传来的用户id参数值
      getFeedBack(this.search).then(res => {
        this.tableData = res.data // 把从接口拿到的数据赋给表格数据变量
      })
    },
    reset () {
      this.search = {
        id: '', // 反馈id
        status: '', // 状态
        createTime: '',
        update: '',
        handler: '',
        uId: '' // 用户id
      }
    },
    updateTimeChanged (data, dateString) {
      this.search.createTime = dateString
    },
    createTimeChanged (data, dateString) {
      this.search.updateTime = dateString
    },
    look (record) {
      this.modalData = record
      this.isVisible = true
    },
    handleOk () {
        // 待确认  接口文档写的put，返回错误信息不支持put
        this.modalData.status = 0
        updateFeedBack(this.modalData).then(res => {
          if (res.success == true) {
           this.getListData()
           this.isVisible = false
          }
        })
    },
    // 点击cancelr
    handleCancel (e) {
      this.isVisible = false
      this.modalData = ''
    },
// updateFeedBack
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, value) => {
        console.log(err)
        console.log(value)
      })
    }
  }
}
</script>

<style scoped>

</style>
