<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :form="form" @submit="handleSubmit">
          <a-row :gutter="64">
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
      </a-table>
<!--      <step-by-step-modal ref="modal" @ok="handleOk"/>-->
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'
import {
  countCheckedByAdminWithPage
} from '@/api/dynamic' // 引入后台接口

const columns = [
  {
    title: '操作人员',
    dataIndex: 'adminName',
    key: 'adminName'
  },
  {
    title: '济人文章数量',
    dataIndex: 'jiren',
    key: 'jiren'
  },
  {
    title: '济事文章数量',
    dataIndex: 'jishi',
    key: 'jishi'
  },
  {
    title: '同德文章数量',
    dataIndex: 'tongde',
    key: 'tongde'
  },
  {
    title: '审核文章数量',
    dataIndex: 'total',
    key: 'total'
  }
]

// const data = [
//   {
//     key: '1',
//     name: '张恒',
//     beginTime: '2015-10-02',
//     endTime: '2015-10-02',
//     auditNumber: 50
//   },
//   {
//     key: '2',
//     name: '郑爽',
//     beginTime: '2015-10-02',
//     endTime: '2015-10-02',
//     auditNumber: 67
//   }
// ]

export default {
  name: 'Audit',
  components: {
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
        countCheckedByAdminWithPage({
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
    }
  }
}
</script>
