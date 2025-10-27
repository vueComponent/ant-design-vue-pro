<template>
  <page-header-wrapper v-if="pageShow">
    <template v-slot:extra>
      <a-tooltip title="刷新页面">
        <a-icon
          type="reload"
          style="font-size: 24px; cursor: pointer; color: #151515"
          @click="refresh"
        />
      </a-tooltip>
    </template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model
        ref="refForm"
        :model="formData"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="url" label="接口地址" prop="url">
          <a-input v-model="formData.url" placeholder="请输入接口地址" />
        </a-form-model-item>
        <a-form-model-item ref="username" label="用户名" prop="username">
          <a-input v-model="formData.username" placeholder="请输入用户名" />
        </a-form-model-item>
        <a-form-model-item ref="password" label="密码" prop="password">
          <a-input v-model="formData.password" placeholder="请输入密码" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 7 }">
          <a-button style="margin-right: 10px" type="primary" @click="onSubmit">
            保存设置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Get, Save } from "@/api/device/serviceApi";
export default {
  name: "DeviceServiceApi",
  data() {
    return {
      // 页面是否显示
      pageShow: true,
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      formData: {
        url: "",
        username: "",
        password: "",
      },
      // 自有域名表单验证规则
      rules: {
        url: [{ required: true, message: "不能为空", trigger: "blur" }],
        username: [{ required: true, message: "不能为空", trigger: "blur" }],
        password: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.get();
  },
  methods: {
    // 刷新
    refresh() {
      this.pageShow = false;
      this.$nextTick(function () {
        this.pageShow = true;
        this.get();
      });
    },
    async get() {
      const res = await Get()
      if (res.code === 0 && res.result !== null) {
        this.formData = res.result;
      }
    },
    // 点击提交
    onSubmit() {
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          const res = await Save(this.formData);
          if (res.code === 0) {
            this.get();
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
  },
};
</script>