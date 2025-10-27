<template>
  <page-header-wrapper :title="false">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model
        ref="refForm"
        :model="formData"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="title" label="网站标题" prop="title">
          <a-input v-model="formData.title" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="网站名称" prop="name">
          <a-input v-model="formData.name" />
        </a-form-model-item>
        <a-form-model-item
          ref="logo"
          label="首页logo"
          prop="logo"
          extra="图片尺寸170*48，小于1m,不上传logo直接显示网站名称"
        >
          <a-upload
            name="file"
            class="avatar-uploader"
            :show-upload-list="false"
            list-type="picture-card"
            action="/main/web/basic/uploadLogo"
            @change="uploadhandleChange"
          >
            <img
              v-if="data && data.logo !== null && data.logo.length !== 0"
              :src="data.logo"
              alt="avatar"
              width="200px"
              height="50px"
            />
            <div v-else>
              <a-icon :type="'plus'" />
              <div>上传</div>
            </div>
          </a-upload>
          <a-popconfirm title="确定删除?" @confirm="confirmRemoveLogo">
            <a
              type="danger"
              v-if="data && data.logo !== null && data.logo.length !== 0"
              style="float: left"
            >
              <a-icon type="delete" />删除</a
            >
          </a-popconfirm>
        </a-form-model-item>
        <a-form-model-item
          label="首页背景图片"
          extra="登录页面背景图片，建议尺寸1920*1080，小于3m"
        >
          <a-upload
            name="file"
            class="avatar-uploader"
            :show-upload-list="false"
            list-type="picture-card"
            action="/main/web/basic/uploadBackgroundImg"
            @change="uploadhandleChange"
          >
            <img
              v-if="
                data && data.backgroundImg !== null && data.backgroundImg.length !== 0
              "
              :src="data.backgroundImg"
              alt="avatar"
              width="200px"
              height="90px"
            />
            <div v-else>
              <a-icon :type="'plus'" />
              <div>上传</div>
            </div>
          </a-upload>
          <a-popconfirm title="确定删除?" @confirm="confirmRemoveBackgroundImg">
            <a
              type="danger"
              v-if="
                data && data.backgroundImg !== null && data.backgroundImg.length !== 0
              "
              style="float: left"
            >
              <a-icon type="delete" />删除</a
            >
          </a-popconfirm>
        </a-form-model-item>
        <a-form-model-item label="用户协议" prop="agreementsContent">
          <a-textarea
            v-model="formData.agreementsContent"
            :rows="8"
            placeholder="请输入用户协议,支持html标签"
          />
        </a-form-model-item>
        <a-form-model-item label="用户协议生效日期" prop="agreementsEffectiveDate">
          <a-date-picker v-model="formData.agreementsEffectiveDate" style="width: 100%" />
        </a-form-model-item>
        <a-form-model-item label="隐私政策" prop="privacyPoliciesContent">
          <a-textarea
            v-model="formData.privacyPoliciesContent"
            :rows="8"
            placeholder="请输入隐私政策,支持html标签"
          />
        </a-form-model-item>
        <a-form-model-item label="隐私政策生效日期" prop="privacyPoliciesEffectiveDate">
          <a-date-picker
            v-model="formData.privacyPoliciesEffectiveDate"
            style="width: 100%"
          />
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
import {
  Get,
  Save,
  RemoveLogo,
  RemoveBackgroundImg,
  GetUserAgreements,
  GetUserPrivacyPolicies,
} from "@/api/web/basic";
import moment from "moment";
export default {
  name: "WebBasic",
  data() {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      formData: {
        title: "",
        name: "",
        agreementsContent: "",
        agreementsEffectiveDate: null,
        privacyPoliciesContent: "",
        privacyPoliciesEffectiveDate: null,
      },
      // 自有域名表单验证规则
      rules: {
        title: [{ required: true, message: "网址标题不能为空", trigger: "blur" }],
        name: [{ required: true, message: "网址名称不能为空", trigger: "blur" }],
        agreementsContent: [
          { required: true, message: "用户协议内容不能为空", trigger: "blur" },
        ],
        agreementsEffectiveDate: [
          { required: true, message: "用户协议生效日期不能为空", trigger: "change" },
        ],
        privacyPoliciesContent: [
          { required: true, message: "隐私政策内容不能为空", trigger: "blur" },
        ],
        privacyPoliciesEffectiveDate: [
          { required: true, message: "隐私政策生效日期不能为空", trigger: "change" },
        ],
      },
      data: null,
    };
  },
  created() {
    this.get();
    this.getUserAgreements();
    this.getUserPrivacyPolicies();
  },
  methods: {
    get() {
      Get().then((res) => {
        if (res.code === 0 && res.result !== null) {
          this.formData = { ...this.formData, ...res.result };
          this.data = res.result;
        }
      });
    },
    /**
     * 获取用户协议
     */
    async getUserAgreements() {
      const res = await GetUserAgreements();
      if (res.code === 0) {
        this.formData.agreementsContent = res.result.content;
        this.formData.agreementsEffectiveDate = res.result.effectiveDate
          ? moment(res.result.effectiveDate, "YYYY-MM-DD")
          : null;
      }
    },
    /**
     * 获取隐私政策
     */
    async getUserPrivacyPolicies() {
      const res = await GetUserPrivacyPolicies();
      if (res.code === 0) {
        this.formData.privacyPoliciesContent = res.result.content;
        this.formData.privacyPoliciesEffectiveDate = res.result.effectiveDate
          ? moment(res.result.effectiveDate, "YYYY-MM-DD")
          : null;
      }
    },
    // 点击提交
    onSubmit() {
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          // alert(JSON.stringify(this.subDomainData));
          const res = await Save(this.formData);
          if (res.code === 0) {
            this.get();
            this.getUserAgreements();
            this.getUserPrivacyPolicies();
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
    // 删除logo
    confirmRemoveLogo() {
      RemoveLogo().then((res) => {
        if (res.code === 0) {
          this.$message.success("操作成功");
          this.get();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 删除背景图片
    confirmRemoveBackgroundImg() {
      RemoveBackgroundImg().then((res) => {
        if (res.code === 0) {
          this.$message.success("操作成功");
          this.get();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 上传回调
    uploadhandleChange(re) {
      if (re.file.response.code === 0) {
        this.$message.success("上传成功");
        this.get();
      } else {
        this.$message.error(re.file.response.message);
      }
    },
  },
};
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 200px;
  height: 50px;
  margin-bottom: -20px;
}
.background-img-uploader > .ant-upload {
  width: 200px;
  height: 80px;
  margin-bottom: -20px;
}
.ant-upload-select-picture-card i {
  font-size: 20px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
