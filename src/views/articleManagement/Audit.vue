<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :form="form" @submit="handleSubmit">
          <a-row :gutter='64'>
            <a-col :span='8'>
              <div>
                <a-form-item label='开始日期' :colon='false'>
                  <a-date-picker style='width: 100%;' v-decorator='["beginTime"]'/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span='8'>
              <div>
                <a-form-item label='结束日期' :colon='false'>
                  <a-date-picker style='width: 100%;' v-decorator='["endTime"]'/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span='8'>
              <div>
                <a-form-item label='操作人员' :colon='false'>
                  <a-input v-decorator='["operator"]'/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span='12'>
              <br/>
              <a-button type='primary'>刷新</a-button>
            </a-col>
            <a-col :span='12'>
              <br/>
              <span style='float: right'>
                <a-button type='primary' style='margin-left: 50px;' html-type='submit'>筛选</a-button>
                <a-button style='margin-left: 20px;'>重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <br/>

      <a-table :columns='columns' :data-source='data'>
      </a-table>
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'

const columns = [
  {
    title: '操作人员',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '开始日期',
    dataIndex: 'beginTime',
    key: 'beginTime'
  },
  {
    title: '结束日期',
    dataIndex: 'endTime',
    key: 'endTime'
  },
  {
    title: '审核文章数量',
    dataIndex: 'auditNumber',
    key: 'auditNumber'
  }
]

const data = [
  {
    key: '1',
    name: '张恒',
    beginTime: '2015-10-02',
    endTime: '2015-10-02',
    auditNumber: 50
  },
  {
    key: '2',
    name: '郑爽',
    beginTime: '2015-10-02',
    endTime: '2015-10-02',
    auditNumber: 67
  }
]

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
      data
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'search' })
  },
  methods: {
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
