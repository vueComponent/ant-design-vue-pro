<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        :label="$t('lang.formtitlelabel')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: $t('lang.formRequiredTitle') }]}
          ]"
          name="name"
          :placeholder="$t('lang.formtitleplaceholder')"
        />
      </a-form-item>
      <a-form-item
        :label="$t('lang.formdatelabel')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-range-picker
          name="buildTime"
          style="width: 100%"
          v-decorator="[
            'buildTime',
            {rules: [{ required: true, message: $t('lang.formRequiredSelectDate') }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        :label="$t('lang.formgoallabel')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-textarea
          rows="4"
          :placeholder="$t('lang.formgoalplaceholder')"
          v-decorator="[
            'description',
            {rules: [{ required: true, message: $t('lang.formRequiredGoalDescription') }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        :label="$t('lang.formstandardlabel')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-textarea
          rows="4"
          :placeholder="$t('lang.formstandardplaceholder')"
          v-decorator="[
            'type',
            {rules: [{ required: true, message: $t('lang.formstandardplaceholder') }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        :label="$t('lang.formclientlabel')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-input
          :placeholder="$t('lang.formclientplaceholder')"
          v-decorator="[
            'customer',
            {rules: [{ required: true, message: $t('lang.formRequiredDescribeCustomers') }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        :label="$t('lang.forminviteslabel')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input :placeholder="$t('lang.forminvitesplaceholder')"/>
      </a-form-item>
      <a-form-item
        :label="$t('lang.formweightlabel')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input-number :min="0" :max="100"/>
        <span>%</span>
      </a-form-item>
      <a-form-item
        :label="$t('lang.formpubliclabel')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
        :help="$t('lang.formpubliclabelhelp')"
      >
        <a-radio-group v-model="value">
          <a-radio :value="1">{{$t('lang.formpublicradiopublic')}}</a-radio>
          <a-radio :value="2">{{$t('lang.formpublicradiopartiallypublic')}}</a-radio>
          <a-radio :value="3">{{$t('lang.formpublicradioprivate')}}</a-radio>
        </a-radio-group>
        <a-form-item>
          <a-select mode="multiple" v-if="value === 2">
            <a-select-option value="4">{{$t('lang.formpublicUsersoptionA')}}</a-select-option>
            <a-select-option value="5">{{$t('lang.formpublicUsersoptionB')}}</a-select-option>
            <a-select-option value="6">{{$t('lang.formpublicUsersoptionC')}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
        <a-button htmlType="submit" type="primary">{{$t('lang.formsubmit')}}</a-button>
        <a-button style="margin-left: 8px">{{$t('lang.formsave')}}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
export default {
  name: 'BaseForm',
  data() {
    return {
      description: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
      value: 1,

      // form
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // handler
    handleSubmit(e) {
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
