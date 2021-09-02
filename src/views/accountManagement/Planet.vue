<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-row :gutter="4">
            <a-col :span="4">
              <a-button type="primary" style="margin-left: 8px;" @click="refresh">刷新</a-button>
            </a-col>
            <a-col :span="3">
              <a-form-item label="uid">
                <a-input placeholder="" v-decorator="['uid']"/>
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item label="账号状态">
                <a-select placeholder="请选择" v-decorator="['accountStatus',{initialValue:'0'}]">
                  <a-select-option value="0">已删除账号</a-select-option>
                  <a-select-option value="1">禁言账号</a-select-option>
                  <a-select-option value="2">已注销账号</a-select-option>
                  <a-select-option value="3">普通账号</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item>
                <a-date-picker style="width: 100%" v-decorator="['beginTime']"/>
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

      <a-table :columns="columns" :data-source="data">
        <span slot="personalTags" slot-scope="tags">
          <a-tag v-for="tag in tags" :key="tag">{{ tag }}</a-tag>
        </span>
        <span slot="interestTags" slot-scope="tags">
          <a-tag v-for="tag in tags" :key="tag">{{ tag }}</a-tag>
        </span>
        <span slot="historicalTeam" slot-scope="text">
          <a>{{ text }}</a>
        </span>
        <span slot="operations" slot-scope="operations">
          <a v-for="operation in operations" :key="operation">{{ operation }} </a>
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
    title: 'uid',
    dataIndex: 'uid',
    key: 'uid'
  }, {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName'
  }, {
    title: '年级',
    dataIndex: 'grade',
    key: 'grade',
    sorter: true
  }, {
    title: '学历',
    dataIndex: 'background',
    key: 'background',
    filters: [
      { text: '本科', value: 'undergraduate' },
      { text: '硕士', value: 'master' },
      { text: '博士', value: 'doctor' }
    ]
  }, {
    title: '个人标签',
    dataIndex: 'personalTags',
    key: 'personalTags',
    scopedSlots: { customRender: 'personalTags' }
  }, {
    title: '兴趣标签',
    dataIndex: 'interestTags',
    key: 'interestTags',
    scopedSlots: { customRender: 'interestTags' }
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '历史组队',
    dataIndex: 'historicalTeam',
    key: 'historicalTeam',
    scopedSlots: { customRender: 'historicalTeam' }
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
    uid: '10086',
    nickName: '中国移动',
    grade: '大五',
    background: '本科',
    personalTags: ['好学小白', '领导者'],
    interestTags: ['口才', '设计', '才艺'],
    createTime: '1202-01-01 10:24',
    historicalTeam: '查看',
    operation: ['禁言', '操作记录']
  }, {
    key: '2',
    uid: '10086',
    nickName: '中国移动',
    grade: '大五',
    background: '本科',
    personalTags: ['好学小白', '领导者'],
    interestTags: ['口才', '设计', '才艺'],
    createTime: '1202-01-01 10:24',
    historicalTeam: '查看',
    operation: ['解除禁言', '操作记录']
  }, {
    key: '3',
    uid: '10086',
    nickName: '中国移动',
    grade: '大五',
    background: '本科',
    personalTags: ['好学小白', '领导者'],
    interestTags: ['口才', '设计', '才艺'],
    createTime: '1202-01-01 10:24',
    historicalTeam: '查看',
    operation: ['操作记录']
  }
]

export default {
  name: 'Planet',
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
