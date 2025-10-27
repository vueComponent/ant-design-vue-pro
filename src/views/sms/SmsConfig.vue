<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-tooltip title="刷新页面">
        <a-icon
          type="reload"
          style="font-size: 24px;cursor: pointer;color: #151515;"
          @click="refresh"
        />
      </a-tooltip>
    </template>
    <template v-slot:content>
      1. 设置短信对接渠道
    </template>
    <div style="margin-bottom: 20px" class="table-page-search-wrapper">
      <a-card :body-style="{ padding: '20px 20px' }" :bordered="false">
        <a-form @submit="handleSubmit" layout="inline" :form="form">
          <a-row :gutter="24">
            <a-col :md="8" :sm="12">
              <a-form-item label="选择渠道">
                <a-select placeholder="请选择渠道" v-decorator="[
                    'smsApiConfigId',
                    { rules: [{ required: true, message: '网站标题不能为空' }] },
                  ]">
                  <a-select-option v-for="item in apiConfigData" :value="item.id">
                    {{ item.smsServiceName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="8" :sm="12">
              <a-form-item style="text-align: right">
               <a-button htmlType="submit" type="primary">保存设置</a-button>
               <router-link style="margin-left: 20px;" to="/apiConfig/sms">渠道配置</router-link>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </div>
  </page-header-wrapper>
</template>

<script>
import {  List } from "@/api/apiConfig/sms";
import { Save, GetConfig } from "@/api/sms/config";

export default {
  name: "SmsConfig",
  components: {
  },
  data() {
    return {
      apiConfigData: [],
      form: this.$form.createForm(this),
    };
  },
  created() {
    this.apiConfigList()
    this.getConfig()
  },
  computed: {},
  methods: {
    // 刷新
    refresh () {
      this.pageShow = false
      this.$nextTick(function () {
        this.pageShow = true
        this.apiConfigList()
        this.getConfig()
      })
    },
    // 获取短信配置列表
    async apiConfigList() {
      const res = await List();
      this.apiConfigData = res.result;
    },
    // 保存设置
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          Save(values).then(response => {
            if (response.code === 0) {
              this.$message.success('操作成功')
            } else {
              this.$message.error(response.message)
            }
          }).catch(error => {
            this.$message.error(error + '')
          })
        }
      })
    },
    // 获取配置
    getConfig () {
      GetConfig().then(response => {
        if (response.code === 0) {
          this.form.setFieldsValue(response.result)
        }
      })
    },
  },
};
</script>
<style lang="less" scoped>
.chart-card-header {
  position: relative;
  overflow: hidden;
  width: 100%;

  .meta {
    position: relative;
    overflow: hidden;
    width: 100%;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }
}

.chart-card-action {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}

.chart-card-footer {
  border-top: 1px solid #e8e8e8;
  padding-top: 9px;
  margin-top: 8px;

  > * {
    position: relative;
  }

  .field {
    float: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }
}

.chart-card-content {
  margin-bottom: 12px;
  position: relative;
  height: 46px;
  width: 100%;

  .content-fix {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}

.total {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  color: #000;
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 22px;
  line-height: 38px;
  height: 38px;
}
</style>
@/api/sms/config
