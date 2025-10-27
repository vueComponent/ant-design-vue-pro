<template>
  <a-modal
    :title="model.title"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    okText="确定"
    cancelText="取消"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="用户ID">
          <a-input v-if="model !== null" v-decorator="['userId', { initialValue: model.id }]" disabled />
        </a-form-item>
        <a-form-item v-for="(item, index) in model.data" :key="index" :label="item.label">
          <a-row :gutter="[8]">
            <a-col v-for="(item2, idx) in item.item" :key="idx" :span="item2.col || 24">
              <!-- input radio -->
              <a-input v-if="item2.formType ==='input' && item2.type === 'radio'" type="radio" :name="item2.name" v-decorator="item2.decorator" :checked="radioChecked[index+idx]"/>
              <!-- input -->
              <a-input v-if="item2.formType ==='input' && item2.type !== 'radio'" :type="item2.type === null ? 'text' : item2.type" v-decorator="item2.decorator" :placeholder="item2.placeholder" />
              <!-- switch -->
              <div v-if="item2.formType ==='switch'">
                <a-switch v-decorator="item2.decorator" checked-children="开" un-checked-children="关" :checked="disabled[index+idx]" @change="onSwitchChange(index+idx, $event)"/>
              </div>
              <!-- checkbox -->
              <a-checkbox v-if="item2.formType ==='checkbox'" v-decorator="item2.decorator">
                {{ item2.name }}
              </a-checkbox>
              <!-- checkbox-group -->
              <a-checkbox-group v-if="item2.formType ==='checkbox-group'" v-decorator="item2.decorator" :options="item2.options" />
              <!-- select -->
              <a-select v-if="item2.formType ==='select'" v-decorator="item2.decorator" placeholder="请选择">
                <a-select-option v-for="i in item2.value" :key="i.name" :value="i.value">
                  {{ i.name }}
                </a-select-option>
              </a-select>
              <!-- radio-group -->
              <a-radio-group v-model="value" v-if="item2.formType ==='radio-group'" v-decorator="item2.decorator">
                <a-radio v-for="i in item2.options" :key="i.label" :value="i.value">
                  {{ i.label }}
                </a-radio>
              </a-radio-group>
              <div v-if="item2.formType ==='text'" v-html="item2.value"></div>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
/*
{
  // 主键id
  id: record.user_id,
  // 标题
  title: 'title',
  // 数据
  data: [
    {
      // 表单 label
      label: 'input',
      // 表单集合
      item: [
        {
          //表单类型input
          formType: 'input',
          // 栏栅宽度最大24
          col: 12,
          // input类型，如text，password等,type不设置默认text
          type: 'password',
          decorator: ['description', { rules: [{ required: true, min: 5, message: '请输入至少五个字符的规则描述！' }] }]
        },
        {
          //switch类型，一组form-item基本上只有一个
          formType: 'switch',
          // 栏栅宽度最大24
          col: 24,
          // switch 值,switch类型必须带这个值,布尔类型
          value: false,
          // 用于和表单进行双向绑定,initialValue初始值必须要传
          decorator: ['state',{ initialValue: true }]
        },
        {
          // checkbox-group类型一组多选框
          formType: 'checkbox-group',
          col: 24,
          // initialValue: 值为数组，如[0,1]有初始值的会被选中
          decorator: ['arrValue', { initialValue: value }],
          // 值为数组类型，如[{ label: 名称, value: 值 },....]
          options: options
        },
        {
          // select类型
          formType: 'select',
          col: 24,
          value: [{ name: '请选择', value: '' }, { name: '会员', value: '2' }, { name: '代理商', value: '1' }],
          decorator: ['userType', { rules: [{ required: true, message: '还未选择会员类型' }] }]
        },
        {
          // text文本
          formType: 'text',
          col: 24,
          //值
          value: '',
        }
      ]
    },
    {
      //可以设置多个表单
      ..........
    }
  ]
}
*/
import pick from 'lodash.pick'

// 表单字段
// const fields = ['userId']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      }
    }
    return {
      form: this.$form.createForm(this),
      // 设置switch类型值
      disabled: [],
      radioChecked: []
    }
  },
  methods: {
    // 点击设置switch
    onSwitchChange (idx, checked) {
      this.disabled[idx] = checked
    }
  },
  created () {
    // console.log('custom modal created')

    // 防止表单未注册
    // fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      // 遍历switch并按索引设置值
      this.model.data.map((item, index) => {
        item.item.map((i, idx) => {
          if (i.formType === 'switch') {
            this.disabled[index + idx] = i.value
          }
          if (i.formType === 'input' && i.type === 'radio' && !i && i.checked === true) {
            this.radioChecked[index + idx] = i.checked
          }
        })
      })
      // this.model && this.form.setFieldsValue(pick(this.model), fields)
      this.model && this.form.setFieldsValue(pick(this.model))
    })
  }
}
</script>
