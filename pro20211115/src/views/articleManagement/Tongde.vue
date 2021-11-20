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
                  <a-input placeholder="请输入" v-decorator="[&quot;userId&quot;]"/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                <a-form-item label="招领类型" :colon="false">
                  <a-select placeholder="请选择" v-decorator="[&quot;type&quot;,{initialValue:&quot;0&quot;}]">
                    <a-select-option value="0">物品遗失</a-select-option>
                    <a-select-option value="1">失物寻主</a-select-option>
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
                  <a-input v-decorator="[&quot;userNickName&quot;]"/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <br/><br/>
              <a-button type="primary" @click="onRefresh">刷新</a-button>
            </a-col>
            <a-col :span="8">
              <div>
                <a-form-item label="标签" :colon="false">
                  <a-select placeholder="请选择" v-decorator="[&quot;tag&quot;]">
                    <a-select-option value="0">水杯</a-select-option>
                    <a-select-option value="1">雨伞</a-select-option>
                    <a-select-option value="2">证件</a-select-option>
                    <a-select-option value="3">耳机</a-select-option>
                    <a-select-option value="4">钥匙</a-select-option>
                    <a-select-option value="5">钱包</a-select-option>
                    <a-select-option value="6">数码</a-select-option>
                    <a-select-option value="7">衣物</a-select-option>
                    <a-select-option value="8">眼镜</a-select-option>
                    <a-select-option value="9">文具</a-select-option>
                    <a-select-option value="10">书籍</a-select-option>
                    <a-select-option value="11">其他</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <br/><br/>
              <span style="float: right">
                <a-button type="primary" style="margin-left: 50px;" html-type="submit">筛选</a-button>
                <a-button style="margin-left: 20px;" @click="onReset">重置</a-button>
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
        :loading="loading"
      >
        <span slot="tags" slot-scope="tags">
          <a-tag v-for="tag in tags" :key="tag">#{{ tag }}</a-tag>
        </span>
        <span slot="status" slot-scope="status,record">
          {{record.censored ? '被屏蔽' : '正常'}}
        </span>
        <span slot="operations" slot-scope="status,record">
          <a @click="onDetail(record)">详情 </a>
          <a-popconfirm
            v-if="status==&quot;未审核&quot;"
            title="是否审核？"
            @confirm="onCheckConfirm(record)"
          >
            <a>审核 </a>
          </a-popconfirm>
          <a-popconfirm
            v-if="!record.deleted"
            title="是否删除？"
            @confirm="onDeleteConfirm(record)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <!--      <step-by-step-modal ref="modal" @ok="handleOk"/>-->
      <tongde-detail ref="tongdeDetail"></tongde-detail>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'

import { adminGetLostFoundList, adminDeleteCensorTongde, adminCheckTongde } from '@/api/dynamic' // 引入后台接口
import TongdeDetail from '@/views/articleManagement/TongdeDetail'

const columns = [
  {
    title: '失物id',
    dataIndex: 'id',
    key: 'id'
  }, {
    title: '用户id',
    dataIndex: 'userId',
    key: 'userId'
  }, {
    title: '发布时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true
  }, {
    title: '失物名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '标签',
    dataIndex: 'labelList',
    key: 'labelList',
    scopedSlots: { customRender: 'tags' }
  }, {
    title: '帖子状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  }, {
    title: '操作人员',
    dataIndex: 'userNickName',
    key: 'userNickName'
  }, {
    title: '招领类型',
    dataIndex: 'typeText',
    key: 'typeText'
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
//     sid: '20010408',
//     uid: '999876',
//     createTime: '2017-10-01 12:00',
//     name: '油纸伞',
//     tags: ['雨伞'],
//     status: '未审核',
//     operator: '卞之琳',
//     type: '物品遗失',
//     // operation: ['详情', '审核', '删除']
//     operation: '未审核'
//   }, {
//     key: '2',
//     sid: '20010408',
//     uid: '999876',
//     createTime: '2017-10-01 12:00',
//     name: '钱包',
//     tags: ['钱包', '证件'],
//     status: '已审核',
//     operator: '周杰伦',
//     type: '失物寻主',
//     operation: '已审核'
//   }, {
//     key: '3',
//     sid: '20010408',
//     uid: '999876',
//     createTime: '2017-10-01 12:00',
//     name: '琵琶',
//     tags: ['其他'],
//     status: '已删除',
//     operator: '白居易',
//     type: '物品遗失',
//     operation: '已删除'
//   }
// ]

export default {
  name: 'Tongde',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal,
    TongdeDetail
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
  mounted () {
    this.getData()
  },
  methods: {
    /**
     * 获取列表数据
     * 
     */
    getData () {
      this.form.validateFields((err, value) => {
        this.loading = true
        value.startTime = value.startTime ? value.startTime.format('YYYY-MM-DD HH:mm:ss') : null
        value.endTime = value.endTime ? value.endTime.format('YYYY-MM-DD HH:mm:ss') : null
        adminGetLostFoundList({
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
        }).catch(err => {
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
      this.$refs.tongdeDetail.open(item)
    },
    /**
     * 删除
     * 
     */
    onDeleteConfirm (item) {
      adminDeleteCensorTongde(item.id).then(res => {
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
      adminCheckTongde(item.id).then(res => {
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
