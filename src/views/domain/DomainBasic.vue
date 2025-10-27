<template>
  <page-header-wrapper :title="false">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          label="泛域名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'wildcardDomain',
              {rules: [{ required: true, message: '域名不能为空' }]}
            ]"
            placeholder="请输入域名" />
          <div>格式：xxx.cn，域名解析里配置泛域名才能分站才能使用二级域名</div>
        </a-form-item>
        <a-form-item
          label="服务器IP"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'ip',
            ]"
            placeholder="请输入服务器IP"
          />
          <div>服务器IP用于自有域名解析使用</div>
        </a-form-item>
        <a-form-item
          label="保留二级域名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-textarea
            v-decorator="[
              'reserve',
            ]"
            placeholder="保留二级域名，不填不填不限制"
          />
          <div>保留二级域名，多个使用英文逗号隔开例如：www,email,不填不限制</div>
        </a-form-item>
        <a-form-item
          label="二级域名长度"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            placeholder="二级域名最小长度，0或空不限制"
            v-decorator="[
              'minLength',
            ]" />
        </a-form-item>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">保存设置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Get, Save } from '@/api/domain/basic'
export default {
  name: 'DomainBasic',
  data () {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      form: this.$form.createForm(this),
      data: {},
    }
  },
  created () {
    this.get()
  },
  methods: {
    get () {
      Get().then(res => {
        if (res.code === 0 && res.result !== null) {
          const set = {
            'wildcardDomain': res.result.wildcardDomain,
            'ip': res.result.ip,
            'reserve': res.result.reserve,
            'minLength': res.result.minLength
          }
          this.form.setFieldsValue(set)
        }
      })
    },
    // 保存设置
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          Save(values).then(response => {
            if (response.code === 0) {
              this.get()
              this.$message.success('操作成功')
            } else {
              this.$message.error(response.message)
            }
          }).catch(error => {
            this.$message.error(error + '')
          })
        }
      })
    }
  }
}
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 200px;
  height: 50px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
