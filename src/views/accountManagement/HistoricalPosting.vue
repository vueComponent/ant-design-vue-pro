<template>
  <page-header-wrapper>
    <a-card :bordered="false">
  <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-row :gutter="24">
            <a-col :span="6" style="margin-bottom:20px;">
              <a-button type="primary" @click="getListData">刷新</a-button>
            </a-col>
            <!-- <a-col :span="6">
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
            </a-col> -->
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
                <a-date-picker style="width: 100%" @change="createTimeChanged" v-model="search.createTime"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-date-picker style="width: 100%" @change="updateTimeChanged" v-model="search.updateTime"/>
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
        <template slot="labelId" slot-scope="labelId">
          <span v-if="labelId == 21">求职信息</span>
          <span v-if="labelId == 22">学习天地</span>
          <span v-if="labelId == 23">校园活动</span>
          <span v-if="labelId == 24">生活指南</span>
          <span v-if="labelId == 25">其他</span>
        </template>
        <span slot="star" slot-scope="star,record">
          <a @click="look(record)">查看详情</a>
        </span>
      </a-table>
      <group-detail ref='groupDetail'></group-detail>
    </a-card>

  </page-header-wrapper>
</template>

<script>
import { getOrganizationPostingList } from '@/api/planet' // 引入后台接口
import GroupDetail from '@/views/articleManagement/GroupDetail'
const columns = [
  {
    title: '帖子ID',
    dataIndex: 'id',
    width: 90,
    key: 'id'
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
    {
    title: '文章标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '所属板块',
    dataIndex: 'labelId', 
    scopedSlots: { customRender: 'labelId' }
  },
  {
    title: '帖子状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '审核人员',
     width:120,
    dataIndex: 'adminId',
    key: 'adminId' 
  },
  {
    title: '操作',
    dataIndex: 'operations',
    width:90,
    key: 'operations',
    scopedSlots: { customRender: 'star' }
  }
]
export default {
  name: 'HistoricalPosting',
  components: {
    GroupDetail
  },
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
      getOrganizationPostingList(this.$route.query.id,this.search).then(res => {
        this.tableData = res.data.records // 把从接口拿到的数据赋给表格数据变量
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
      this.search.updateTime = dateString + ' '+ '00:00:00'
    },
    createTimeChanged (data, dateString) {
      // this.search.updateTime = dateString
      this.search.createTime = dateString + ' '+ '00:00:00'
    },
    look (record) {
      this.modalData = record
      this.$refs.groupDetail.open(record)
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
    // 点击cancel
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
