<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout='inline' :form='form' @submit='handleSubmit'>
          <a-row :gutter='24'>
            <a-col :span='2'>
              <a-button type='primary'>刷新</a-button>
            </a-col>
            <a-col :span='3'>
              <a-form-item label='反馈ID'>
                <a-input v-decorator='["id"]'/>
              </a-form-item>
            </a-col>
            <a-col :span='3'>
              <a-form-item label='UID'>
                <a-input v-decorator='["uid"]'/>
              </a-form-item>
            </a-col>
            <a-col :span='3'>
              <a-form-item label='处理人'>
                <a-input v-decorator='["handler"]'/>
              </a-form-item>
            </a-col>
            <a-col :span='3'>
              <a-form-item label='状态'>
                <a-select v-decorator='["status"]'>
                  <a-select-option value='0'>已处理</a-select-option>
                  <a-select-option value='1'>待处理</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span='3'>
              <a-form-item>
                <a-date-picker v-decorator='["beginTime"]'/>
              </a-form-item>
            </a-col>
            <a-col :span='3'>
              <a-form-item>
                <a-date-picker v-decorator='["endTime"]'/>
              </a-form-item>
            </a-col>
            <a-col :span='1'>
              <a-button type='primary' html-type='submit'>筛选</a-button>
            </a-col>
            <a-col :span='1' :offset='1'>
              <a-button type='primary'>重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table :columns='columns' :data-source='data'>
        <span slot='star' slot-scope='star'>
          <a>查看  </a>
          <a>删除  </a>
          <a-icon v-if='star' type='star' theme='filled' style='color: gold'/>
          <a-icon v-else type='star' theme='outlined'/>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>

const columns = [
  {
    title: '反馈ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'UID',
    dataIndex: 'uid',
    key: 'uid'
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName'
  },
  {
    title: '反馈时间',
    dataIndex: 'feedbackTime',
    key: 'feedbackTime'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    key: 'handler'
  },
  {
    title: '处理时间',
    dataIndex: 'handleTime',
    key: 'handleTime'
  },
  {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    scopedSlots: { customRender: 'star' }
  }
]

const data = [
  {
    key: '1',
    id: '000',
    uid: 'ABC',
    nickName: '胡彦斌',
    feedbackTime: '2017-10-01 12:00',
    status: '已处理',
    handler: '胡彦斌',
    handleTime: '2017-10-01 12:00',
    operations: false
  }, {
    key: '2',
    id: '000',
    uid: 'ABC',
    nickName: '胡彦斌',
    feedbackTime: '2017-10-01 12:00',
    status: '已处理',
    handler: '胡彦斌',
    handleTime: '2017-10-01 12:00',
    operations: false
  }, {
    key: '3',
    id: '000',
    uid: 'ABC',
    nickName: '胡彦斌',
    feedbackTime: '2017-10-01 12:00',
    status: '已处理',
    handler: '胡彦斌',
    handleTime: '2017-10-01 12:00',
    operations: false
  }, {
    key: '4',
    id: '000',
    uid: 'ABC',
    nickName: '胡彦斌',
    feedbackTime: '2017-10-01 12:00',
    status: '已处理',
    handler: '胡彦斌',
    handleTime: '2017-10-01 12:00',
    operations: false
  }, {
    key: '5',
    id: '000',
    uid: 'ABC',
    nickName: '胡彦斌',
    feedbackTime: '2017-10-01 12:00',
    status: '未处理',
    handler: '',
    handleTime: '',
    operations: true
  }, {
    key: '6',
    id: '000',
    uid: 'ABC',
    nickName: '胡彦斌',
    feedbackTime: '2017-10-01 12:00',
    status: '未处理',
    handler: '',
    handleTime: '',
    operations: false
  }
]

export default {
  name: 'Feedback',
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

<style scoped>

</style>
