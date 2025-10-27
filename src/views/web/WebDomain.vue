<template>
  <page-header-wrapper :title="false">
    <a-card title="二级域名配置" :body-style="{ marginBottom: '20px' }" :bordered="false">
      <a-form-model
        ref="subDomainForm"
        :model="subDomainData"
        :rules="subDomainRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item v-if="false" ref="name" label="id" prop="name">
          <a-input v-model="subDomainData.id" />
        </a-form-model-item>
        <a-form-model-item ref="domain" label="二级域名" prop="domain">
          <a-input v-model="subDomainData.domain" :suffix="'.' + domain" />
        </a-form-model-item>
        <a-form-model-item label="启用">
          <a-radio-group v-model="subDomainData.userState">
            <a-radio :value="1"> 已启用 </a-radio>
            <a-radio :value="0"> 停用 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="subDomainData.status !== null" label="状态">
          <div style="font-weight: 600;">
            <span style="color:#52c41a;" v-if="subDomainData.status === 0">正常</span>
            <span style="color:#f5222d;" v-else-if="subDomainData.status === 1">禁用</span>
            <span style="color: #2a96dd;" v-else-if="subDomainData.status === 2">审核中</span>
            <span style="color:#f5222d;" v-else-if="subDomainData.status === 3">审核失败: {{ subDomainData.statusDesc }}</span>
            <span v-else>--</span>
          </div>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 7 }">
          <a-button style="margin-right: 10px;" type="primary" @click="subDomainSubmit"> 保存设置 </a-button>
          <a style="color:#2a96dd" v-if="subDomainData.domain.length > 0" target="_blank" :href="'http://' + subDomainData.domain + '.' + domain"> 打开网页 {{ subDomainData.domain + '.' + domain }}</a>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card title="自有域名配置" :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model
        ref="ownDomainForm"
        :model="ownDomainData"
        :rules="ownDomainRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item v-if="false" ref="name" label="id" prop="name">
          <a-input v-model="ownDomainData.id" />
        </a-form-model-item>
        <a-form-model-item ref="domain" label="自有域名" prop="domain" extra="输入完整域名格式：xxx.com，不带http://或https://">
          <a-input v-model="ownDomainData.domain" />
        </a-form-model-item>
        <a-form-model-item label="IP" extra="域名管理把域名解析到该IP地址">
          {{ ip }}
        </a-form-model-item>
        <a-form-model-item label="启用">
          <a-radio-group v-model="ownDomainData.userState">
            <a-radio :value="1"> 已启用 </a-radio>
            <a-radio :value="0"> 停用 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="ownDomainData.status !== null" label="状态">
          <div style="font-weight: 600;">
            <span style="color:#52c41a;" v-if="ownDomainData.status === 0">正常</span>
            <span style="color:#f5222d;" v-else-if="ownDomainData.status === 1">禁用</span>
            <span style="color: #2a96dd;" v-else-if="ownDomainData.status === 2">审核中</span>
            <span style="color:#f5222d;" v-else-if="ownDomainData.status === 3">审核失败: {{ ownDomainData.statusDesc }}</span>
            <span v-else>--</span>
          </div>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 7 }">
          <a-button style="margin-right: 10px;" type="primary" @click="ownDomainSubmit"> 保存设置 </a-button>
          <a style="color:#2a96dd" v-if="ownDomainData.domain.length > 0" target="_blank" :href="'http://' + ownDomainData.domain"> 打开网页 {{ ownDomainData.domain }}</a>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { Get } from "@/api/domain/basic";
import { Save, List } from "@/api/domain/domain";
export default {
  name: "WebDomain",
  data() {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      // 域名
      domain: "",
      ip: "",
      // 子域名对象数据
      subDomainData: {
        id: "",
        domain: "",
        // 0: 二级域名
        own: 0,
        userState: 1,
        status: null,
        statusDesc: ''
      },
      // 子域名表单验证规则
      subDomainRules: {
        domain: [
          { required: true, message: "二级域名不能为空", trigger: "blur" },
          // 正则校验只能输入小写字母和数字
          { pattern: /^[a-z0-9]+$/, message: "只能输入小写字母和数字" }
        ],
      },
      // 自有域名对象数据
      ownDomainData: {
        id: "",
        domain: "",
        // 1: 自有域名
        own: 1,
        userState: 1,
        status: null,
        statusDesc: ''
      },
      // 自有域名表单验证规则
      ownDomainRules: {
        domain: [
          { required: true, message: "域名不能为空", trigger: "blur" },
          // 正则校验网址是否合法
          { pattern: /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(?:\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$/, message: "域名格式不正确" },
        ],
      },
    };
  },
  created() {
    this.get();
    this.getList();
  },
  methods: {
    // 获取域名列表
    getList() {
      List().then((res) => {
        if (res.code === 0) {
          // this.domainList = res.result
          // 判断不为null，遍历自有域名类型并赋值
          if (res.result !== null) {
            for (const key in res.result) {
              if (res.result[key].own === 0) {
                this.subDomainData.id = res.result[key].id;
                this.subDomainData.domain = res.result[key].domain;
                this.subDomainData.userState = res.result[key].userState;
                this.subDomainData.status = res.result[key].status;
                this.subDomainData.statusDesc = res.result[key].statusDesc;
              } else {
                this.ownDomainData.id = res.result[key].id;
                this.ownDomainData.domain = res.result[key].domain;
                this.ownDomainData.userState = res.result[key].userState;
                this.ownDomainData.status = res.result[key].status;
                this.ownDomainData.statusDesc = res.result[key].statusDesc;
              }
            }
          }
        }
      });
    },
    // 获取基本信息
    get() {
      Get().then((res) => {
        if (res.code === 0 && res.result !== null) {
          this.domain = res.result.wildcardDomain;
          this.ip = res.result.ip;
        }
      });
    },
    // 子域名保存
    subDomainSubmit(){
      this.$refs.subDomainForm.validate(async valid => {
        if (valid) {
          // alert(JSON.stringify(this.subDomainData));
          const res = await Save(this.subDomainData)
          if (res.code === 0) {
            this.getList();
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
    // 自有域名保存
    ownDomainSubmit(){
      this.$refs.ownDomainForm.validate(async valid => {
        if (valid) {
          // alert(JSON.stringify(this.subDomainData));
          const res = await Save(this.ownDomainData)
          if (res.code === 0) {
            this.getList();
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
