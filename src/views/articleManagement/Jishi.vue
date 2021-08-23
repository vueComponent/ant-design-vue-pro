<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :form="form" @submit="handleSubmit">
          <a-row :gutter="64">
            <a-col :span="8">
              <div>
                <a-form-item label='帖子id' :colon='false'>
                  <a-input placeholder='请输入' v-decorator='["tid"]'/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                <a-form-item label='用户id' :colon='false'>
                  <a-input placeholder='请输入' v-decorator='["uid"]'/>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span="8">
              <div>
                <a-form-item label='所属板块' :colon='false'>
                  <a-select placeholder="请选择" v-decorator='["plate",{initialValue:"0"}]'>
                    <a-select-option value="0">求职信息</a-select-option>
                    <a-select-option value="1">学习天地</a-select-option>
                    <a-select-option value="2">校园活动</a-select-option>
                    <a-select-option value="3">生活指南</a-select-option>
                    <a-select-option value='4'>其他</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </a-col>
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
        <span slot='operations' slot-scope='status'>
          <a>详情 </a>
          <a v-if='status=="未审核"'>审核 </a>
          <a v-if='status!="已删除"'>删除</a>
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

const columns = [
  {
    title: '帖子id',
    dataIndex: 'pid',
    key: 'pid'
  }, {
    title: '用户id',
    dataIndex: 'uid',
    key: 'uid'
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
    title: '帖子状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  }, {
    title: '操作人员',
    dataIndex: 'operator',
    key: 'operator'
  }, {
    title: '所属板块',
    dataIndex: 'plate',
    key: 'plate'
  }, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operations' }
  }
]

const data = [
  {
    key: '1',
    pid: '20010408',
    uid: '999876',
    createTime: '2017-10-01 12:00',
    title: '断章',
    content: '你站在桥上看风景，看风景的人在楼上看你',
    status: '未审核',
    operator: '卞之琳',
    plate: '新生板块',
    // operation: ['详情', '审核', '删除']
    operation: '未审核'
  }, {
    key: '2',
    pid: '20010408',
    uid: '999876',
    createTime: '2017-10-01 12:00',
    title: '稻香',
    content: '还记得你说家是唯一的城堡。',
    status: '已审核',
    operator: '周杰伦',
    plate: '新生板块',
    operation: '已审核'
  }, {
    key: '3',
    pid: '20010408',
    uid: '999876',
    createTime: '2017-10-01 12:00',
    title: '琵琶行',
    content: '同是天涯沦落人，相逢何必曾相识。',
    status: '已删除',
    operator: '白居易',
    plate: '新生板块',
    operation: '已删除'
  }
]

export default {
  name: 'Jishi',
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
