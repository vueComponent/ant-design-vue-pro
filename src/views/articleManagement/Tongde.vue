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
                <a-form-item label='招领类型' :colon='false'>
                  <a-select placeholder="请选择" v-decorator='["type",{initialValue:"0"}]'>
                    <a-select-option value="0">物品遗失</a-select-option>
                    <a-select-option value="1">失物寻主</a-select-option>
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
            <a-col :span='8'>
              <br/><br/>
              <a-button type='primary'>刷新</a-button>
            </a-col>
            <a-col :span='8'>
              <div>
                <a-form-item label='标签' :colon='false'>
                  <a-select placeholder='请选择' v-decorator='["tag"]'>
                    <a-select-option value='0'>水杯</a-select-option>
                    <a-select-option value='1'>雨伞</a-select-option>
                    <a-select-option value='2'>证件</a-select-option>
                    <a-select-option value='3'>耳机</a-select-option>
                    <a-select-option value='4'>钥匙</a-select-option>
                    <a-select-option value='5'>钱包</a-select-option>
                    <a-select-option value='6'>数码</a-select-option>
                    <a-select-option value='7'>衣物</a-select-option>
                    <a-select-option value='8'>眼镜</a-select-option>
                    <a-select-option value='9'>文具</a-select-option>
                    <a-select-option value='10'>书籍</a-select-option>
                    <a-select-option value='11'>其他</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </a-col>
            <a-col :span='8'>
              <br/><br/>
              <span style='float: right'>
                <a-button type='primary' style='margin-left: 50px;' html-type='submit'>筛选</a-button>
                <a-button style='margin-left: 20px;'>重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table :columns='columns' :data-source='data'>
        <span slot='tags' slot-scope='tags'>
          <a-tag v-for='tag in tags' :key='tag'>#{{tag}}</a-tag>
        </span>
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
    title: '失物id',
    dataIndex: 'sid',
    key: 'sid'
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
    title: '失物名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
    scopedSlots: { customRender: 'tags' }
  }, {
    title: '帖子状态',
    dataIndex: 'status',
    key: 'status'
  }, {
    title: '操作人员',
    dataIndex: 'operator',
    key: 'operator'
  }, {
    title: '招领类型',
    dataIndex: 'type',
    key: 'type'
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
    sid: '20010408',
    uid: '999876',
    createTime: '2017-10-01 12:00',
    name: '油纸伞',
    tags: ['雨伞'],
    status: '未审核',
    operator: '卞之琳',
    type: '物品遗失',
    // operation: ['详情', '审核', '删除']
    operation: '未审核'
  }, {
    key: '2',
    sid: '20010408',
    uid: '999876',
    createTime: '2017-10-01 12:00',
    name: '钱包',
    tags: ['钱包', '证件'],
    status: '已审核',
    operator: '周杰伦',
    type: '失物寻主',
    operation: '已审核'
  }, {
    key: '3',
    sid: '20010408',
    uid: '999876',
    createTime: '2017-10-01 12:00',
    name: '琵琶',
    tags: ['其他'],
    status: '已删除',
    operator: '白居易',
    type: '物品遗失',
    operation: '已删除'
  }
]

export default {
  name: 'Tongde',
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
