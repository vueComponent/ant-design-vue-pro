<template>
  <div>
    <a-form layout="inline" :form="form" @submit="handleSubmit">
      <a-row :gutter="24">
        <a-col :span="2">
          <a-button type="primary">刷新</a-button>
        </a-col>
        <a-col :span="3">
          <a-form-item label="动态ID">
            <a-input v-decorator="['id']"/>
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item label="发布人">
            <a-select v-decorator="['publisher']">
            </a-select>
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
            <a-select v-decorator="['theme']">
              <a-select-option value="0">求职信息</a-select-option>
              <a-select-option value="1">学习天地</a-select-option>
              <a-select-option value="2">校园活动</a-select-option>
              <a-select-option value="3">生活指南</a-select-option>
              <a-select-option value="4">竞赛</a-select-option>
              <a-select-option value="5">学术科研</a-select-option>
              <a-select-option value="6">一起造梦</a-select-option>
              <a-select-option value="7">其他</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item>
            <a-date-picker v-decorator="['beginTime']"/>
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
          <a-button type="primary">重置</a-button>
        </a-col>
      </a-row>
    </a-form>

    <a-table :columns="columns" :data-source="data">
      <span slot="operations">
        <a>恢复 </a>
        <a>修改 </a>
        <a>删除</a>
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '动态ID',
    dataIndex: 'ID',
    key: 'ID'
  },
  {
    title: '发布人',
    dataIndex: 'publisher',
    key: 'publisher'
  },
  {
    title: '板块',
    dataIndex: 'plane',
    key: 'plane'
  },
  {
    title: '主题',
    dataIndex: 'theme',
    key: 'theme'
  },
  {
    title: '发布时间',
    dataIndex: 'publishTime',
    key: 'publishTime'
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
    ID: '1234',
    publisher: '胡彦斌',
    plane: '济人',
    theme: '校园活动',
    publishTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }, {
    key: '2',
    ID: '1234',
    publisher: '胡彦斌',
    plane: '济人',
    theme: '求职之路',
    publishTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }, {
    key: '3',
    ID: '1234',
    publisher: '胡彦斌',
    plane: '济事',
    theme: '校园活动',
    publishTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }, {
    key: '4',
    ID: '1234',
    publisher: '胡彦斌',
    plane: '济事',
    theme: '生活指南',
    publishTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }, {
    key: '5',
    ID: '1234',
    publisher: '胡彦斌',
    plane: '同德',
    theme: '学习天地',
    publishTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }, {
    key: '6',
    ID: '1234',
    publisher: '胡彦斌',
    plane: '同德',
    theme: '学习天地',
    publishTime: '2017-10-01 12:00',
    title: '关于新学期的一些和新学期有关的',
    content: '同学们好，新学期来了，久学期过去了。'
  }
]

export default {
  name: 'GarbageBox',
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
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
