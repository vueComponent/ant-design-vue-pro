<template>
  <div>
    <a-form layout="inline" :form="form" @submit="handleSubmit">
      <a-row :gutter="24">
        <a-col :span="2">
          <a-button type="primary" @click="onRefresh">刷新</a-button>
        </a-col>
        <a-col :span="3">
          <a-form-item label="编辑人">
            <a-input v-decorator="['owner']"/>
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item label="板块">
            <a-select v-decorator="['plate']">
              <a-select-option value="0">济事</a-select-option>
              <a-select-option value="1">济人</a-select-option>
              <a-select-option value="2">同德</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item label="主题">
            <a-select v-decorator="['labelId']">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="21">求职信息</a-select-option>
              <a-select-option value="19">一起造梦</a-select-option>
              <a-select-option value="22">学习天地</a-select-option>
              <a-select-option value="18">学术科研</a-select-option>
              <a-select-option value="20">其他</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item>
            <a-date-picker v-decorator="['startTime']"/>
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item>
            <a-date-picker v-decorator="['endTime']"/>
          </a-form-item>
        </a-col>
        <a-col :span="1">
          <a-button type="primary" html-type="submit">筛选</a-button>
        </a-col>
        <a-col :span="1" :offset="1">
          <a-button type="primary" @click="onReset">重置</a-button>
        </a-col>
      </a-row>
    </a-form>

    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      @change="handleTableChange"
      :loading="loading"
    >
      <span slot="operations" slot-scope='status,record'>
        <a @click='onModify(record)'>修改 </a>
        <a-popconfirm
          v-if="!record.deleted"
          title="是否删除？"
          @confirm="onDeleteConfirm(record)"
        >
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script>
import { adminLogicDeletePosting, getAdminPostingWithPage } from '@/api/dynamic'

const columns = [
  {
    title: '编辑人',
    dataIndex: 'owner'
  },
  {
    title: '板块',
    dataIndex: 'plane',
    key: 'plane'
  },
  {
    title: '主题',
    dataIndex: 'labelContent',
    key: 'labelContent'
  },
  {
    title: '保存时间',
    dataIndex: 'updateTime'
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true
  },
  {
    title: '主要内容',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    scopedSlots: { customRender: 'operations' }
  }
]

const data = [
  {
    key: '1',
    editor: '胡彦斌',
    plane: '济人',
    theme: '校园活动',
    saveTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }, {
    key: '2',
    editor: '胡彦斌',
    plane: '济人',
    theme: '求职之路',
    saveTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }, {
    key: '3',
    editor: '胡彦斌',
    plane: '济事',
    theme: '校园活动',
    saveTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }, {
    key: '4',
    editor: '胡彦斌',
    plane: '济事',
    theme: '生活指南',
    saveTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }, {
    key: '5',
    editor: '胡彦斌',
    plane: '同德',
    theme: '学习天地',
    saveTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }, {
    key: '6',
    editor: '胡彦斌',
    plane: '同德',
    theme: '学习天地',
    saveTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }
]

export default {
  name: 'DraftBox',
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
        getAdminPostingWithPage({
          pageNo: this.pagination.current,
          released: false,
          censored: false,
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
     * 删除
     * 
     */
    onDeleteConfirm (item) {
      adminLogicDeletePosting(item.id).then(res => {
        if (res.success) {
          this.$message.success('删除成功')
          this.getData()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    /**
     * 修改
     * @param record
     */
    onModify(record) {
      this.$router.push({
        name: 'editManagement',
        params: {
          postingId: record.id
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
