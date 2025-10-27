<!-- 用户查询设置 -->
<template>
  <a-modal
    title="查询设置"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    okText="保存设置"
    cancelText="取消"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <!--
        <a-form-item v-show="model && model.user_id > 0" label="用户ID">
          <a-input v-decorator="['userId', { initialValue: model.user_id }]" disabled />
        </a-form-item>
        -->
        <a-form-item label="类型">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-select v-decorator="['financeType', { rules: [{ required: true, message: 'Please select your country!' }] }]">
                <a-select-option value="0">
                  充值
                </a-select-option>
                <a-select-option value="1">
                  调账
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-show="directionShow" label="方式">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-radio-group v-model="directionValue" v-decorator="['direction']">
                <a-radio v-for="i in [{label:'加', value:'IN'},{label:'减', value:'OUT'}]" :key="i.label" :value="i.value">
                  {{ i.label }}
                </a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="金额">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-input
                v-decorator="['key',{rules: [{ required: true, message: '密钥不能为空' }]}]"
                placeholder="请输入金额"
              />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="订单号">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-input
                v-decorator="['key',{rules: [{ required: true, message: '密钥不能为空' }]}]"
                placeholder="请输入充值订单号或凭证，没有可以不填"
              />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="备注信息">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-input v-decorator="['key',{rules: [{ required: true, message: '密钥不能为空' }]}]" placeholder="请输入备注信息，可以不填" />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="超级密码">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-input
                v-decorator="['key',{rules: [{ required: true, message: '密钥不能为空' }]}]"
                placeholder="请输入超级密码"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment' // 引入 moment
// 表单字段
// const fields = ['description', 'id']

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
    },
    data: {
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
      // 调账默认值
      directionValue: 'IN',
      // 调账方式是否显示
      directionShow: false
    }
  },
  created () {
    // console.log('custom modal created')

    // 防止表单未注册
    // fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      // alert(JSON.stringify(this.model))
      // this.isShow = this.model.type || 'QUERY_LIMIT'
      // this.model && this.form.setFieldsValue(pick(this.model, fields))
      this.model && this.form.setFieldsValue(pick(this.model))
    })
  },
  methods: {
    moment,
    onMode (value) {
      // alert(JSON.stringify(value))
      this.isShow = value.target.value
    },
    financeTypeChange (value) {
      alert(value)
      if (value === 1) {
        this.directionShow = true
        alert(1)
      } else {
        this.directionShow = true
        alert(0)
      }
    }
  }
}
</script>
