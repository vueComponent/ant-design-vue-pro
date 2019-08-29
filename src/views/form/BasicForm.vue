<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item v-for="(item, index) in list" 
      :key="index" :label="item.sort + '.' + item.questionName" 
      :labelCol="{lg: {span: 7}, sm: {span: 7}}"
      :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-radio-group v-decorator="[item.basisElementCopyId+'', {rules: [{required: item.required > 0, message: '请选择一个'}]}]" v-model="item.basisElementId" :name="item.basisElementCopyId+''">
          <a-radio :value="1">公开</a-radio>
          <a-radio :value="2">部分公开</a-radio>
          <a-radio :value="3">不公开</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="标题"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: checkRe, message: '请输入标题' }]}
          ]"
          name="name"
          placeholder="给目标起个名字" />
      </a-form-item>
      <a-form-item
        label="起止日期"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-range-picker
          name="buildTime"
          style="width: 100%"
          v-decorator="[
            'buildTime',
            {rules: [{ required: true, message: '请选择起止日期' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="目标描述"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea
          rows="4"
          placeholder="请输入你阶段性工作目标"
          v-decorator="[
            'description',
            {rules: [{ required: true, message: '请输入目标描述' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="衡量标准"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea
          rows="4"
          placeholder="请输入衡量标准"
          v-decorator="[
            'type',
            {rules: [{ required: true, message: '请输入衡量标准' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="客户"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          placeholder="请描述你服务的客户，内部客户直接 @姓名／工号"
          v-decorator="[
            'customer',
            {rules: [{ required: true, message: '请描述你服务的客户' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="邀评人"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-input placeholder="请直接 @姓名／工号，最多可邀请 5 人" />
      </a-form-item>
      <a-form-item
        label="权重"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-input-number :min="0" :max="100" />
        <span> %</span>
      </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary">提交</a-button>
        <a-button style="margin-left: 8px">保存</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
export default {
  name: 'BaseForm',
  data () {
    return {
      description: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
      value: undefined,

      // form
      form: this.$form.createForm(this),
      list: [{"isReport":0,"answers":[{"basisAnswerId":56,"elementTextValue":"","elementNumValue":-1,"basisElementId":1001}],"simple":1,"type":1,"required":1,"childEleName":"","showType":0,"event":"","elementId":1001,"level":1,"questionName":"留全血:","sort":1,"isRadio":0,"isShow":0,"unit":"","basisElementCopyId":1001,"basisElementId":-1,"hasChild":-1,"isProgress":1,"logicValue":0,"isWrite":-1}]
    }
  },
  computed: {
    checkRe() {
      return function(e){
        console.log(e)
        return false
      }
    }
  },
  methods: {

    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    }
  }
}
</script>
