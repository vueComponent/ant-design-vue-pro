<template>
  <a-card :bordered="false">
    <a-form :form="form1" :self-update="true" @submit="handleForm1Submit">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item label="仓库名">
            <a-input
              placeholder="请输入仓库名称"
              v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入仓库名称', whitespace: true}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
          <a-form-item
            label="仓库域名">
            <a-input
              addonBefore="http://"
              addonAfter=".com"
              placeholder="请输入"
              v-decorator="[
                'url',
                {rules: [{ required: true, message: '请输入仓库域名', whitespace: true}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
          <a-form-item
            label="仓库管理员">
            <a-select placeholder="请选择管理员" v-decorator="[ 'owner', {rules: [{ required: true, message: '请选择管理员'}]} ]">
              <a-select-option value="王同学">王同学</a-select-option>
              <a-select-option value="李同学">李同学</a-select-option>
              <a-select-option value="黄同学">黄同学</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item
            label="审批人">
            <a-select placeholder="请选择审批员" v-decorator="[ 'approver', {rules: [{ required: true, message: '请选择审批员'}]} ]">
              <a-select-option value="王晓丽">王晓丽</a-select-option>
              <a-select-option value="李军">李军</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
          <a-form-item
            label="生效日期">
            <a-range-picker
              style="width: 100%"
              v-decorator="[
                'dateRange',
                {rules: [{ required: true, message: '请选择生效日期'}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
          <a-form-item
            label="仓库类型">
            <a-select
              placeholder="请选择仓库类型"
              v-decorator="[
                'type',
                {rules: [{ required: true, message: '请选择仓库类型'}]}
              ]" >
              <a-select-option value="公开">公开</a-select-option>
              <a-select-option value="私密">私密</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item v-if="showSubmit">
        <a-button htmlType="submit" >Submit</a-button>
      </a-form-item>
    </a-form>

    <a-form :form="form2" :self-update="true" @submit="handleForm2Submit">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item label="仓库名">
            <a-input
              placeholder="请输入仓库名称"
              v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入仓库名称', whitespace: true}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
          <a-form-item
            label="仓库域名">
            <a-input
              addonBefore="http://"
              addonAfter=".com"
              placeholder="请输入"
              v-decorator="[
                'url',
                {rules: [{ required: true, message: '请输入仓库域名', whitespace: true}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
          <a-form-item
            label="仓库管理员">
            <a-select placeholder="请选择管理员" v-decorator="[ 'owner', {rules: [{ required: true, message: '请选择管理员'}]} ]">
              <a-select-option value="王同学">王同学</a-select-option>
              <a-select-option value="李同学">李同学</a-select-option>
              <a-select-option value="黄同学">黄同学</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item
            label="审批人">
            <a-select placeholder="请选择审批员" v-decorator="[ 'approver', {rules: [{ required: true, message: '请选择审批员'}]} ]">
              <a-select-option value="王晓丽">王晓丽</a-select-option>
              <a-select-option value="李军">李军</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
          <a-form-item
            label="生效日期">
            <a-range-picker
              style="width: 100%"
              v-decorator="[
                'dateRange',
                {rules: [{ required: true, message: '请选择生效日期'}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
          <a-form-item
            label="仓库类型">
            <a-select
              placeholder="请选择仓库类型"
              v-decorator="[
                'type',
                {rules: [{ required: true, message: '请选择仓库类型'}]}
              ]" >
              <a-select-option value="公开">公开</a-select-option>
              <a-select-option value="私密">私密</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item v-if="showSubmit">
        <a-button htmlType="submit" >Submit</a-button>
      </a-form-item>
    </a-form>

    <a-form :form="form3" :self-update="true" @submit="handleForm2Submit">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item label="仓库名">
            <a-input
              placeholder="请输入仓库名称"
              v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入仓库名称', whitespace: true}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
          <a-form-item
            label="仓库域名">
            <a-input
              addonBefore="http://"
              addonAfter=".com"
              placeholder="请输入"
              v-decorator="[
                'url',
                {rules: [{ required: true, message: '请输入仓库域名', whitespace: true}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
          <a-form-item
            label="仓库管理员">
            <a-select placeholder="请选择管理员" v-decorator="[ 'owner', {rules: [{ required: true, message: '请选择管理员'}]} ]">
              <a-select-option value="王同学">王同学</a-select-option>
              <a-select-option value="李同学">李同学</a-select-option>
              <a-select-option value="黄同学">黄同学</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item
            label="审批人">
            <a-select placeholder="请选择审批员" v-decorator="[ 'approver', {rules: [{ required: true, message: '请选择审批员'}]} ]">
              <a-select-option value="王晓丽">王晓丽</a-select-option>
              <a-select-option value="李军">李军</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
          <a-form-item
            label="生效日期">
            <a-range-picker
              style="width: 100%"
              v-decorator="[
                'dateRange',
                {rules: [{ required: true, message: '请选择生效日期'}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
          <a-form-item
            label="仓库类型">
            <a-select
              placeholder="请选择仓库类型"
              v-decorator="[
                'type',
                {rules: [{ required: true, message: '请选择仓库类型'}]}
              ]" >
              <a-select-option value="公开">公开</a-select-option>
              <a-select-option value="私密">私密</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item v-if="showSubmit">
        <a-button htmlType="submit" >Submit</a-button>
      </a-form-item>
    </a-form>

    <a-form :form="form4" :self-update="true" @submit="handleForm2Submit">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item label="仓库名">
            <a-input
              placeholder="请输入仓库名称"
              v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入仓库名称', whitespace: true}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
          <a-form-item
            label="仓库域名">
            <a-input
              addonBefore="http://"
              addonAfter=".com"
              placeholder="请输入"
              v-decorator="[
                'url',
                {rules: [{ required: true, message: '请输入仓库域名', whitespace: true}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
          <a-form-item
            label="仓库管理员">
            <a-select placeholder="请选择管理员" v-decorator="[ 'owner', {rules: [{ required: true, message: '请选择管理员'}]} ]">
              <a-select-option value="王同学">王同学</a-select-option>
              <a-select-option value="李同学">李同学</a-select-option>
              <a-select-option value="黄同学">黄同学</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item
            label="审批人">
            <a-select placeholder="请选择审批员" v-decorator="[ 'approver', {rules: [{ required: true, message: '请选择审批员'}]} ]">
              <a-select-option value="王晓丽">王晓丽</a-select-option>
              <a-select-option value="李军">李军</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
          <a-form-item
            label="生效日期">
            <a-range-picker
              style="width: 100%"
              v-decorator="[
                'dateRange',
                {rules: [{ required: true, message: '请选择生效日期'}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
          <a-form-item
            label="仓库类型">
            <a-select
              placeholder="请选择仓库类型"
              v-decorator="[
                'type',
                {rules: [{ required: true, message: '请选择仓库类型'}]}
              ]" >
              <a-select-option value="公开">公开</a-select-option>
              <a-select-option value="私密">私密</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item v-if="showSubmit">
        <a-button htmlType="submit" >Submit</a-button>
      </a-form-item>
    </a-form>

    <a-form :form="form5" :self-update="true" @submit="handleForm2Submit">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item label="仓库名">
            <a-input
              placeholder="请输入仓库名称"
              v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入仓库名称', whitespace: true}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
          <a-form-item
            label="仓库域名">
            <a-input
              addonBefore="http://"
              addonAfter=".com"
              placeholder="请输入"
              v-decorator="[
                'url',
                {rules: [{ required: true, message: '请输入仓库域名', whitespace: true}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
          <a-form-item
            label="仓库管理员">
            <a-select placeholder="请选择管理员" v-decorator="[ 'owner', {rules: [{ required: true, message: '请选择管理员'}]} ]">
              <a-select-option value="王同学">王同学</a-select-option>
              <a-select-option value="李同学">李同学</a-select-option>
              <a-select-option value="黄同学">黄同学</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item
            label="审批人">
            <a-select placeholder="请选择审批员" v-decorator="[ 'approver', {rules: [{ required: true, message: '请选择审批员'}]} ]">
              <a-select-option value="王晓丽">王晓丽</a-select-option>
              <a-select-option value="李军">李军</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
          <a-form-item
            label="生效日期">
            <a-range-picker
              style="width: 100%"
              v-decorator="[
                'dateRange',
                {rules: [{ required: true, message: '请选择生效日期'}]}
              ]" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
          <a-form-item
            label="仓库类型">
            <a-select
              placeholder="请选择仓库类型"
              v-decorator="[
                'type',
                {rules: [{ required: true, message: '请选择仓库类型'}]}
              ]" >
              <a-select-option value="公开">公开</a-select-option>
              <a-select-option value="私密">私密</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item v-if="showSubmit">
        <a-button htmlType="submit" >Submit</a-button>
      </a-form-item>
    </a-form>

    <a-divider />

    <a-table
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      :loading="tableLoading"
    >
      <template v-for="(col, i) in ['name', 'workId', 'department']" :slot="col" slot-scope="text, record">
        <a-input
          :key="col"
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          :placeholder="columns[i].title"
          @change="e => handleChange(e.target.value, record.key, col)"
        />
        <template v-else>{{ text }}</template>
      </template>
      <template slot="operation" slot-scope="text, record">
        <template v-if="record.editable">
          <span v-if="record.isNew">
            <a @click="saveRow(record)">添加</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="saveRow(record)">保存</a>
            <a-divider type="vertical" />
            <a @click="cancel(record.key)">取消</a>
          </span>
        </template>
        <span v-else>
          <a @click="toggle(record.key)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
    <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">新增成员</a-button>

  </a-card>
</template>

<script>
const columns = [
  {
    title: '成员姓名',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '工号',
    dataIndex: 'workId',
    key: 'workId',
    width: '20%',
    scopedSlots: { customRender: 'workId' }
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    key: 'department',
    width: '40%',
    scopedSlots: { customRender: 'department' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'BigForm',
  data () {
    return {
      showSubmit: true,
      form1: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      form3: this.$form.createForm(this),
      form4: this.$form.createForm(this),
      form5: this.$form.createForm(this),
      tableLoading: false,
      columns,
      data: [{
        key: '1',
        name: '小明',
        workId: '001',
        editable: false,
        department: '行政部'
      },
        {
          key: '2',
          name: '李莉',
          workId: '002',
          editable: false,
          department: 'IT部'
        },
        {
          key: '3',
          name: '王小帅',
          workId: '003',
          editable: false,
          department: '财务部'
        }]
    }
  },
  mounted () {
    // 加 10 个表单行
    new Array(10).fill(0).forEach(() => {
      this.newMember()
    })
  },
  methods: {
    handleForm1Submit (e) {
      e.preventDefault()
      this.form1.validateFields()
    },
    handleForm2Submit (e) {
      e.preventDefault()
      this.form2.validateFields()
    },

    handleChange (value, key, column) {
      const target = this.data.find(item => key === item.key)
      if (target) {
        target[column] = value
      }
    },

    toggle (record) {

    },
    saveRow (record) {

    },
    cancel (key) {

    },
    remove (key) {
      this.data = this.data.filter(item => item.key !== key)
    },

    newMember () {
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        name: '',
        workId: '',
        department: '',
        editable: true,
        isNew: true
      })
    }
  }
}
</script>

<style scoped>

</style>
