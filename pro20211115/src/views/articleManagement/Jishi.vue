/* eslint-disable handle-callback-err */
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
                  <a-select placeholder="请选择" v-decorator="[&quot;labelId&quot;,{initialValue:&quot;&quot;}]">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="21">求职信息</a-select-option>
                    <a-select-option value="19">一起造梦</a-select-option>
                    <a-select-option value="22">学习天地</a-select-option>
                    <a-select-option value="18">学术科研</a-select-option>
                    <a-select-option value="20">其他</a-select-option>
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
            <a-col :span="12">
              <br/>
              <a-button type="primary" @click='onRefresh'>刷新</a-button>
            </a-col>
            <a-col :span="12">
              <br/>
              <span style="float: right">
                <a-button type="primary" style="margin-left: 50px;" html-type="submit">筛选</a-button>
                <a-button style="margin-left: 20px;" @click='onReset'>重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <br/>

      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        @change="handleTableChange"
        :loading='loading'
      >
        <span slot="status" slot-scope="status,record">
          <span>{{record.censored ? '被屏蔽' : (record.released ? '已发布' : '未发布')}}</span>
        </span>
        <span slot="operations" slot-scope="status,record">
          <a @click='onDetail(record)'>详情 </a>
          <a-popconfirm
            v-if="record.censored && !record.released"
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
      <posting-detail ref='postingDetail'></posting-detail>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'

import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'

import {
  adminGetPostingList,
  adminCensorJishi,
  adminCheckJishi
} from '@/api/dynamic' // 引入后台接口
import PostingDetail from '@/views/articleManagement/PostingDetail'

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
    dataIndex: 'brief',
    key: 'brief',
    ellipsis: true
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

export default {
  name: 'Jishi',
  components: {
    PostingDetail,
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
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
    /**
     * 获取列表数据
     * 
     */
    getData () {
      // eslint-disable-next-line handle-callback-err
      this.form.validateFields((err, value) => {
        this.loading = true
        value.startTime = value.startTime ? value.startTime.format('YYYY-MM-DD HH:mm:ss') : null
        value.endTime = value.endTime ? value.endTime.format('YYYY-MM-DD HH:mm:ss') : null
        adminGetPostingList({
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
      this.$refs.postingDetail.open(item)
    },
    /**
     * 删除
     * 
     */
    onDeleteConfirm (item) {
      adminCensorJishi(item.id).then(res => {
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
      adminCheckJishi(item.id).then(res => {
        if (res.success) {
          this.$message.success('审核成功')
          this.getData()
        } else {
          this.$message.error('审核失败')
        }
      })
    }
  }
}
</script>
