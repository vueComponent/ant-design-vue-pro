<template>
  <a-modal
    v-if="model !== null"
    :title="model.title || ''"
    :width="model.width || 640"
    :visible="visible"
    :confirmLoading="loading || false"
    :dialog-style="{ top: '30px' }"
    okText="确定"
    cancelText="取消"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <!--<a-form-item v-show="model && model.id > 0" label="用户ID">-->
        <!-- 一般用于更新条件或主键,默认不显示 -->
        <a-form-item v-if="model && model.where && model.where.decorator" v-show="!model.where.notVshow || false" :label="model.where.label">
          <a-row :gutter="[8]">
            <a-col :span="model.where.col || 24">
              <!-- 不可修改文本框 --> 
              <a-input v-decorator="model.where.decorator" disabled />
            </a-col>
          </a-row>
        </a-form-item>
        <!-- 遍历表单数据 -->
        <a-form-item v-for="(data, index) in (model.data || [])" v-if="!data.notVif" v-show="!data.notVshow" :key="index" :label="data.label" :help="data.help || ''">
          <a-row :gutter="[8]">
            <a-col v-for="(item, idx) in data.item" :key="idx" :span="item.col || 24">
              <!-- input radio -->
              <!--<a-input v-if="item2.formType ==='input' && item2.type === 'radio'" type="radio" :name="item2.name" v-decorator="item2.decorator" :checked="radioChecked[index+idx]"/> -->
              <!-- input框 -->
              <a-input v-if="item.formType ==='input'" :type="item.type || 'text'" v-decorator="item.decorator" :placeholder="item.placeholder" />
              <!-- textarea多行表格 -->
              <a-textarea v-if="item.formType ==='textarea'" v-decorator="item.decorator" :placeholder="item.placeholder" :auto-size="{ minRows: 4, maxRows: 6 }" />
              <!-- 文本 -->
              <div v-if="item.formType ==='text'" v-html="item.value"></div>
              <!-- checkbox多选 
              <a-checkbox v-if="item.formType ==='checkbox'" v-decorator="item.decorator">
                {{ item.label }}
              </a-checkbox>
              -->
              <!-- checkbox-group多选组 -->
              <a-checkbox-group v-if="item.formType ==='checkbox-group'" v-decorator="item.decorator" :options="item.options" />
              <!-- select下拉选择 -->
              <a-select :mode="item.mode" v-if="item.formType ==='select'" v-decorator="item.decorator" placeholder="请选择">
                <a-select-option v-for="i in item.options" :key="i.value" :value="i.value">
                  <span v-html="i.label"></span>
                </a-select-option>
              </a-select>
              <!-- radio-group单选组 -->
              <a-radio-group v-if="item.formType ==='radio-group'" v-decorator="item.decorator">
                <a-radio v-for="i in item.options" :key="i.label" :value="i.value">
                  {{ i.label }}
                </a-radio>
              </a-radio-group>
              <!-- 级联选择器 -->
              <a-cascader v-if="item.formType ==='cascader'" :options="item.options" :placeholder="item.placeholder" v-decorator="item.decorator"/>
              <!-- 日期选择器 -->
              <a-date-picker v-if="item.formType ==='DatePpicker'" :placeholder="item.placeholder" v-decorator="item.decorator" />
              <!-- switch开关 -->
              <div v-if="item.formType ==='switch'">
                <a-switch v-decorator="item.decorator" checked-children="开" un-checked-children="关" :checked="switchChecked[index + idx]" @change="onSwitchChange(index + idx, $event)"/>
              </div>
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
  // 标题默认空
  title: 'title',
  // 宽度默认640
  width: 640,
  // 更新条件对象
  where:{
    // 是否显示
    isShow: false,
    // 表单 label
    label: '用户ID'
    // 栏栅宽度最大24
    col: 12,
    // 用于和表单进行双向绑定,initialValue初始值
    decorator: ['id', { initialValue: 0 }],
  },
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
          decorator: ['description', { rules: [{ required: true, min: 5, message: '请输入至少五个字符的规则描述！' }] }],
          placeholder: '请输入xxx'
        },
        {
          //switch类型，一组form-item基本上只有一个
          formType: 'switch',
          // 栏栅宽度最大24
          col: 24,
          // 用于和表单进行双向绑定,initialValue初始值必须要传
          decorator: ['state',{ initialValue: true }]
        },
        {
          // checkbox-group类型一组多选框
          formType: 'checkbox-group',
          col: 24,
          // 值为数组类型，如[{ label: 名称, value: 值 },....]
          options: [{ label: '会员', value: '2' }, { label: '代理商', value: '1' }],
          // initialValue: 值为数组，如[0,1]有初始值的会被选中
          decorator: ['arrValue', { initialValue: ['1','2'] }],
        },
        {
          // select类型
          formType: 'select',
          col: 24,
          options: [{ label: '请选择', value: '' }, { label: '会员', value: '2' }, { label: '代理商', value: '1' }],
          decorator: ['userType', {initialValue: '2', rules: [{ required: true, message: '还未选择会员类型' }] }]
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
      // 设置所有switch值
      switchChecked: [],
      // radioChecked: []
    }
  },
  methods: {
    // 点击设置switch
    onSwitchChange (idx, checked) {
      // 按索引设置switch值
      this.switchChecked[idx] = checked
    }
  },
  created () {
    // 防止表单未注册
    /*
    fields.forEach(v => {
      this.form.getFieldDecorator(v)
    })
    */
    // 监听model弹出框状态
     this.$watch('model', () => {
      // alert(JSON.stringify(this.model))
      // 遍历switch并按索引设置值
      // model对象
      this.model.data.map((item, index) => {
        // 遍历集合
        item.item.map((i, idx) => {
          // 判断为switch控件
          if (i.formType === 'switch') {
            // 设置switch默认值值
            this.switchChecked[index + idx] = i.decorator[1].initialValue
          }
          //if (i.formType === 'input' && i.type === 'radio' && !i && i.checked === true) {
          //  this.radioChecked[index + idx] = i.checked
          //}
        })
      })
    //  this.model && this.form.setFieldsValue(pick(this.model), fields)
      this.model && this.form.setFieldsValue(pick(this.model))
    })
  }
}
</script>
