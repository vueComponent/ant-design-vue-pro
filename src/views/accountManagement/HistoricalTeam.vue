<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-row :gutter="4">
            <a-col :span="4">
              <a-button type="primary" style="margin-left: 8px;" @click="getListData">刷新</a-button>
            </a-col>
            <a-col :span="4" :offset="8">
              <a-form-item>
                <a-date-picker style="width: 100%" v-decorator="['beginTime']" @change="onChange"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item>
                <a-date-picker style="width: 100%" v-decorator="['endTime']"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" html-type="submit">筛选</a-button>
                <a-button type="primary" style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table :columns="columns" :data-source="tableData">
       
        <span slot="operations" slot-scope="star,record">
          <a @click="adminGetTeam(record.tid)">组队详情</a>
        </span>
      </a-table>

      <!--      <step-by-step-modal ref="modal" @ok="handleOk"/>-->
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'
import { adminGetTeamList ,getTeamByUserIdWithPage} from '@/api/planet' // 引入后台接口

const columns = [
  {
    title: '组队id',
    dataIndex: 'id',
    key: 'id'
  }, {
    title: '发布时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '组队标题',
    dataIndex: 'title',
    key: 'title'
  }, {
    title: '组队状态',
    dataIndex: 'status',
    key: 'status'
  }, {
    title: '帖子状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  // 字段不明
  //  {
  //   title: '组队进度',
  //   dataIndex: 'teamProgress',
  //   key: 'teamProgress'
  // }, 
  // {
  //   title: '所属板块',
  //   dataIndex: 'plate',
  //   key: 'plate'
  // }, 
  {
    title: '操作人员',
    dataIndex: 'lastOperation',
    key: 'lastOperation'
  }, 
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operations' }
  }
]

// const data = [
//   {
//     key: '1',
//     tid: '20010408',
//     createTime: '2017-10-01 12:00',
//     title: '断章',
//     teamStatus: '啥呀',
//     status: '未审核',
//     teamProgress: '1/5',
//     plate: '新生板块',
//     operator: '卞之琳',
//     // operation: ['详情', '审核', '删除']
//     operation: '组队详情'
//   }, {
//     key: '2',
//     tid: '20010408',
//     createTime: '2017-10-01 12:00',
//     title: '稻香',
//     teamStatus: '已关闭',
//     status: '已审核',
//     teamProgress: '5/5',
//     plate: '新生板块',
//     operator: '周杰伦',
//     operation: '已审核'
//   }, {
//     key: '3',
//     tid: '20010408',
//     createTime: '2017-10-01 12:00',
//     title: '琵琶行',
//     teamStatus: '啥呀',
//     status: '已删除',
//     teamProgress: '0/100',
//     plate: '新生板块',
//     operator: '白居易',
//     operation: '已删除'
//   }
// ]

export default {
  name: 'HistoricalTeam',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    return {
      columns,
      queryParams:{
       pageNo:1,
       pageSize: 10
      },
      tableData: [] // 存储列表数据
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
    onChange (date, dateString) {
      console.log(date, dateString, '日期')
    },
    adminGetTeam (id) {
      alert(id)
      // 获取组队详情
      getTeamByUserId(id).then(res => {
        console.log(res, '结果')
      })
    },
    // 方法：获取历史组队信息列表
    getListData () {
      // 获取从planet传来的用户id参数值
      const params = {
        userId: this.$route.query.uid,
        pageSize: 10,
        pageNum: 1
      }
      getTeamByUserIdWithPage(params).then(res => {
        this.tableData = res.data.records // 把从接口拿到的数据赋给表格数据变量
      })
    },
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
