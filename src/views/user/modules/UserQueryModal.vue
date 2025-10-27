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
      <a-form v-if="model !== null" :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.user_id > 0" label="用户ID">
          <a-input v-decorator="['userId', { initialValue: model.user_id }]" disabled />
        </a-form-item>
        <a-form-item label="查询设置">
          <a-radio-group v-decorator="['mode', { initialValue: model.mode || 0}]">
            <a-radio v-for="i in [{ label: '使用全局查询', value: 0 }, { label: '使用用户查询', value: 1 }, { label: '关闭查询功能', value: 2 }]" :key="i.label" :value="i.value">
              {{ i.label }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="模式">
          <a-radio-group v-decorator="['type', { initialValue: model.type || 'QUERY_LIMIT'}]" @change="onMode">
            <a-radio v-for="i in [{ label: '限制次数', value: 'QUERY_LIMIT' }, { label: '按次查询', value: 'BALANCE_NUMBER' }, { label: '按时间间隔', value: 'INTERVAL_TIME' }, { label: '按次扣费', value: 'UNIT_PRICE' }]" :key="i.label" :value="i.value">
              {{ i.label }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-show="isShow === 'QUERY_LIMIT'" label="限制次数">
          <a-row :gutter="8" >
            <a-col :span="24">
              <a-input v-decorator="['queryLimit', { initialValue: model.query_limit}]" />
            </a-col>
          </a-row>
          <a-row :gutter="8" >
            充值成功后重置设置的查询次数，0不限制查询次数
          </a-row>
        </a-form-item>
        <a-form-item v-show="isShow === 'BALANCE_NUMBER'" label="按次查询">
          <a-row :gutter="8" >
            <a-col :span="16">
              <a-input v-decorator="['balanceNumber', { initialValue: ''}]" placeholder="充值次数" />
            </a-col>
            <a-col :span="8">
              <span style="color: #FF0000;">剩余次数：{{ model.balance_number || 0 }}</span>
            </a-col>
          </a-row>
          <a-row :gutter="8" >
            按次查询，成功查询一次扣除一次
          </a-row>
        </a-form-item>
        <a-form-item v-show="isShow === 'INTERVAL_TIME'" label="按时间间隔">
          <a-row :gutter="8" >
            <a-col :span="6">
              <a-input v-decorator="['intervalTime', { initialValue: model.interval_time}]" />
            </a-col>
            <a-col :span="8">
              <a-date-picker style="width: 100%" v-decorator="['expireTime', { initialValue: ''}]" />
            </a-col>
            <a-col :span="10">
              <span style="color: #FF0000;">到期时间：{{ model.expireTimeStr }}</span>
            </a-col>
          </a-row>
          <a-row :gutter="8" >
            按时间间隔查询，单位为秒，必须设置过期时间，过期后就不能查询了
          </a-row>
        </a-form-item>
        <a-form-item v-show="isShow === 'UNIT_PRICE'" label="按次扣费">
          <a-row :gutter="8" >
            <a-col :span="24">
              <a-input v-decorator="['unitPrice', { initialValue: model.unit_price}]" />
            </a-col>
          </a-row>
          <a-row :gutter="8" >
            每成功查询一笔直接从账户余额里扣除相应金额，支持3位小数
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
      isShow: ''
    }
  },
  created () {
    // console.log('custom modal created')

    // 防止表单未注册
    // fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      // alert(JSON.stringify(this.model))
      this.isShow = this.model.type || 'QUERY_LIMIT'
      // this.model && this.form.setFieldsValue(pick(this.model, fields))
      this.model && this.form.setFieldsValue(pick(this.model))
    })
  },
  methods: {
    moment,
    onMode (value) {
      // alert(JSON.stringify(value))
      this.isShow = value.target.value
    }
  }
}
</script>
