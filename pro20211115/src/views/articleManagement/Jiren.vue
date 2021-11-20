
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :form="form" @submit="handleSubmit">
          <a-row :gutter="64">
            <a-col :span="8">
              <div>
                <a-form-item label="帖子id" :colon="false">
                  <a-input placeholder="请输入" v-decorator="[&quot;id&quot;]"/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                <a-form-item label="用户id" :colon="false">
                  <a-input placeholder="请输入" v-decorator="[&quot;adminId&quot;]"/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                <a-form-item label="所属板块" :colon="false">
                  <a-select placeholder="请选择" v-decorator="[&quot;plate&quot;,{initialValue:&quot;0&quot;}]">
                    <a-select-option value="0">竞赛</a-select-option>
                    <a-select-option value="1">学术科研</a-select-option>
                    <a-select-option value="2">一起造梦</a-select-option>
                    <a-select-option value="3">其他</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                <a-form-item label="开始日期" :colon="false">
                  <a-date-picker style="width: 100%;" v-decorator="[&quot;startTime&quot;]"/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                <a-form-item label="结束日期" :colon="false">
                  <a-date-picker style="width: 100%;" v-decorator="[&quot;endTime&quot;]"/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                <a-form-item label="操作人员" :colon="false">
                  <a-input v-decorator="[&quot;adminName&quot;]"/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <br/><br/>
              <a-button type="primary" @click='onRefresh'>刷新</a-button>
            </a-col>
            <a-col :span="8">
              <div>
                <a-form-item label="组队状态" :colon="false">
                  <a-select placeholder="请选择" v-decorator="[&quot;teamStatus&quot;,{initialValue:&quot;0&quot;}]">
                    <a-select-option value="0">进行中</a-select-option>
                    <a-select-option value="1">已关闭</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <br/><br/>
              <span style="float: right">
                <a-button type="primary" style="margin-left: 50px;" html-type="submit">筛选</a-button>
                <a-button style="margin-left: 20px;" @click='onReset'>重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        @change="handleTableChange"
        :loading='loading'
      >
        <span slot="applyStatus" slot-scope="applyStatus">
          {{applyStatus | applyStatusFilter}}
        </span>
        <span slot="status" slot-scope="status,record">
          {{record.censored ? '被屏蔽' : '正常'}}
        </span>
        <span slot="operations" slot-scope="status,record">
          <a @click='onDetail(record)'>详情 </a>
          <a-popconfirm
            v-if="record.applyStatus==0 || record.applyStatus == 1"
            title='是否审核？'
            @confirm="onCheckConfirm(record)"
          >
            <a>审核 </a>
          </a-popconfirm>
          <a-popconfirm
            v-if="!record.deleted"
            title='是否删除？'
            @confirm="onDeleteConfirm(record)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <!--      <step-by-step-modal ref="modal" @ok="handleOk"/>-->
      <group-detail ref='groupDetail'></group-detail>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'
import request from '@/utils/request'
import {
  adminGetTeamList,
  adminDeleteCensorJiren,
  adminCheckJiren
} from '@/api/dynamic' // 引入后台接口
import GroupDetail from '@/views/articleManagement/GroupDetail'

const columns = [
  {
    title: '帖子id',
    dataIndex: 'id',
    key: 'id'
  }, {
    title: '用户id',
    dataIndex: 'adminId',
    key: 'adminId'
  }, {
    title: '发布时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true
  }, {
    title: '文章标题',
    dataIndex: 'title',
    key: 'title'
  }, {
    title: '文章详情',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true
  }, {
    title: '组队状态',
    dataIndex: 'applyStatus',
    scopedSlots: { customRender: 'applyStatus' }
  }, {
    title: '帖子状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  }, {
    title: '操作人员',
    dataIndex: 'adminName',
    key: 'adminName'
  }, {
    title: '所属板块',
    dataIndex: 'labelContent',
    key: 'labelContent'
  }, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operations' }
  }
]

// const data = [
//   {
//     key: '1',
//     pid: '20010408',
//     uid: '999876',
//     createTime: '2017-10-01 12:00',
//     title: '断章',
//     content: '你站在桥上看风景，看风景的人在楼上看你',
//     teamStatus: '进行中',
//     status: '未审核',
//     operator: '卞之琳',
//     plate: '新生板块',
//     // operation: ['详情', '审核', '删除']
//     operation: '未审核'
//   }, {
//     key: '2',
//     pid: '20010408',
//     uid: '999876',
//     createTime: '2017-10-01 12:00',
//     title: '稻香',
//     content: '还记得你说家是唯一的城堡。',
//     teamStatus: '已关闭',
//     status: '已审核',
//     operator: '周杰伦',
//     plate: '新生板块',
//     operation: '已审核'
//   }, {
//     key: '3',
//     pid: '20010408',
//     uid: '999876',
//     createTime: '2017-10-01 12:00',
//     title: '琵琶行',
//     content: '同是天涯沦落人，相逢何必曾相识。',
//     teamStatus: '进行中',
//     status: '已删除',
//     operator: '白居易',
//     plate: '新生板块',
//     operation: '已删除'
//   }
// ]

export default {
  name: 'Jiren',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal,
    GroupDetail
  },
  data () {
    return {
      columns,
      data: [],
      loading: false,
      pagination: {
        current: 1,
        total: 0
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'search' })
  },
  created () {

  },
  mounted () {
    this.getData()
  },
  methods: {
    updateData () {
      request({
        url: '/team/adminGetTeamList',
        method: 'get'
      })
      .then(res => {
        console.log(res)
      })
      // this.$axios.get('http://101.132.130.199:8080/team/adminGetTeamList')
      //   .then(res => {
      //     console.log(res)
      //     const records = res.data.data.records
      //     const data = []
      //     for (const key in records) {
      //       const record = records[key]
      //       console.log(record)
      //       data.push({
      //         key: key,
      //         pid: record.id,
      //         uid: record.initiatorId,
      //         createTime: record.createTime,
      //         title: record.title,
      //         content: record.content,
      //         teamStatus: record.status,
      //         status: '审核中',
      //         operator: '卞之琳',
      //         plate: record.labelId
      //       })
      //     }
      //     this.data = data
      //   })
    },
    /**
     * 获取列表数据
     * 
     */
    getData () {
      this.form.validateFields((err, value) => {
        this.loading = true
        value.startTime = value.startTime ? value.startTime.format('YYYY-MM-DD HH:mm:ss') : null
        value.endTime = value.endTime ? value.endTime.format('YYYY-MM-DD HH:mm:ss') : null
        adminGetTeamList({
          pageNo: this.pagination.current,
          ...value
        }).then(res => {
          this.loading = false
          if (res.success) {
            const { data } = res
            this.data = data.records || []
            this.pagination.total = data.total
          } else {
            this.$message.error(res.msg || '获取数据失败')
          }
        }).catch(() => {
          this.loading = false
        })
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.pagination.current = 1
      this.getData()
    },
    /**
     * 重置
     * 
     */
    onReset () {
      this.form.resetFields()
    },
    /**
     * 刷新
     * 
     */
    onRefresh () {
      this.getData()
    },
    /**
     * 切页
     * @param pagination
     * 
     */
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.getData()
    },
    /**
     * 详情
     * 
     */
    onDetail (item) {
      this.$refs.groupDetail.open(item)
    },
    /**
     * 删除
     * 
     */
    onDeleteConfirm (item) {
      adminDeleteCensorJiren(item.id).then(res => {
        if (res.success) {
          this.$message.success('删除成功')
          this.getData()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    /**
     * 审核
     * 
     */
    onCheckConfirm (item) {
      adminCheckJiren(item.id).then(res => {
        if (res.success) {
          this.$message.success('审核成功')
          this.getData()
        } else {
          this.$message.error('审核失败')
        }
      })
    }
  },
  filters: {
    applyStatusFilter(status) {
      if(status == 0 || status == 1){
        return '待处理'
      }
      if(status == 2){
        return '待结束'
      }
      if(status == 3 || status == 4){
        return '已关闭'
      }
      return ''
    }
  }
}
</script>
