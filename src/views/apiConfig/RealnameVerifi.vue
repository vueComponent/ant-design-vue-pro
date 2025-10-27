<template>
  <page-header-wrapper>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card title="实名认证" :total="realNameData.appKey || '--'">
          <template slot="footer">
            <!--气泡卡片显示认证信息-->
            <a-popover placement="right">
              <template slot="content">
                <p style="margin-top: 10px">
                  1. 接口地址<br />
                  <a href="https://market.aliyun.com/detail/cmapi00037887?spm=5176.29867242_210807074.0.0.6ca93e7e3AiPxc#sku=yuncode31887000023" target="_blank">https://market.aliyun.com/apimarket/detail/cmapi00059971#sku=yuncode53971000012</a>
                  <br />
                  2. 购买成功后点击接口文档下方的获取认证，获取接口密钥<br />
                </p>
              </template>
              <template slot="title">
                <span>手机三要素-手机三要素-手机三要素-运营商实名认证接口使用说明</span>
              </template>
              使用说明 <a-icon type="info-circle-o" />
            </a-popover>
            <span style="float: right">
              <a @click="onEditRealName"><a-icon type="edit" />编辑</a>
            </span>
          </template>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card title="银行卡归属" :total="bankBinData.appKey || '--'">
          <template slot="footer">
            <!--气泡卡片显示认证信息-->
            <a-popover placement="right">
              <template slot="content">
                <p style="margin-top: 10px">
                  1. 使用阿里云银行卡归属地查询接口先购买查询套餐<br />
                  <a href="https://market.aliyun.com/apimarket/detail/cmapi00059971#sku=yuncode53971000012" target="_blank">https://market.aliyun.com/apimarket/detail/cmapi00059971#sku=yuncode53971000012</a>
                  <br />
                  2. 购买成功后点击接口文档下方的获取认证，获取接口密钥<br />
                </p>
              </template>
              <template slot="title">
                <span>银行卡归属接口使用说明</span>
              </template>
              使用说明 <a-icon type="info-circle-o" />
            </a-popover>
            <span style="float: right">
              <a @click="onEditBankbin"><a-icon type="edit" />编辑</a>
            </span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card title="银行卡四要素认证" :total="bankCardVerifyData.appKey || '--'">
          <template slot="footer">
            <!--气泡卡片显示认证信息-->
            <a-popover placement="right">
              <template slot="content">
                <p style="margin-top: 10px">
                  1. 使用阿里云提供的银行卡四要素认证，购买套餐后获取到接口密钥（注意该接口需要企业认证）<br />
                  <a href="https://market.aliyun.com/apimarket/detail/cmapi00037886#sku=yuncode3188600002" target="_blank">https://market.aliyun.com/apimarket/detail/cmapi00037886#sku=yuncode3188600002</a>
                </p>
              </template>
              <template slot="title">
                <span>银行卡四要素认证接口使用说明</span>
              </template>
              使用说明 <a-icon type="info-circle-o" />
            </a-popover>
            <span style="float: right"
              ><a @click="onEditBankCardVerify"><a-icon type="edit" />编辑</a>
            </span>
          </template>
        </chart-card>
      </a-col>
    </a-row>
    <!-- 弹窗 -->
    <create-form
      ref="createModal"
      :visible="visible"
      :model="model"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </page-header-wrapper>
</template>

<script>
import { GetBankBin, SaveBankBin } from "@/api/apiConfig/bankBin";
import { GetBankCardVerify, SaveBankCardVerify } from "@/api/apiConfig/bankCardVerify";
import { Detail as GetRealName, SaveOrUpdate as SaveRealName } from "@/api/apiConfig/apiRealName";
import { ChartCard, MiniArea, MiniBar, MiniProgress } from "@/components";
import CreateForm from "@/views/modules/CreateForm";
export default {
  name: "RealnameVerifi",
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    CreateForm,
  },
  data() {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      visible: false,
      model: null,
      bankBinData: {},
      bankCardVerifyData: {},
      realNameData: {},
    };
  },
  // el 创建前
  beforeCreate() {
    // 创建表单
    this.form = this.$form.createForm(this);
  },
  created() {
    this.getBankBin();
    this.getRealName();
    this.getBankCardVerify()
  },
  methods: {
    /**
     * 获取实名认证配置
     */
    async getRealName() {
      const res = await GetRealName();
      if (res.code === 0 && res.result !== null) {
        this.realNameData = res.result;
      }
    },
    /**
     * 获取银行卡四要素认证接口信息
     */
     async getBankCardVerify() {
      const res = await GetBankCardVerify();
      if (res.code === 0 && res.result !== null) {
        this.bankCardVerifyData = res.result;
      }
    },
    /**
     * 关闭编辑弹窗
     */
    handleCancel() {
      this.visible = false;
    },
    /**
     * 确认弹窗
     */
    handleOk() {
      const form = this.$refs.createModal.form;
      form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          if (values.modelName === "bankBin") {
            // 保存银行卡bin
            SaveBankBin(values)
              .then((response) => {
                if (response.code === 0) {
                  this.getBankBin();
                  this.visible = false;
                  this.$message.success("操作成功");
                } else {
                  this.$message.error(response.message);
                }
              })
              .catch((error) => {
                this.$message.error(error + "");
              });
          } else if(values.modelName === 'bankCardVerify'){
              // 保存银行卡四要素配置
              SaveBankCardVerify(values)
              .then((response) => {
                if (response.code === 0) {
                  this.getBankCardVerify();
                  this.visible = false;
                  this.$message.success("操作成功");
                } else {
                  this.$message.error(response.message);
                }
              })
              .catch((error) => {
                this.$message.error(error + "");
              }); 
          } else if(values.modelName === 'realName'){
              // 保存实名认证配置
              SaveRealName(values)
              .then((response) => {
                if (response.code === 0) {
                  this.getRealName();
                  this.visible = false;
                  this.$message.success("操作成功");
                } else {
                  this.$message.error(response.message);
                }
              })
              .catch((error) => {
                this.$message.error(error + "");
              }); 
          }
        }
      });
    },
    /**
     * 查询银行卡bin接口配置信息
     */
    async getBankBin() {
      const res = await GetBankBin();
      if (res.code === 0 && res.result !== null) {
        this.bankBinData = res.result;
      }
    },
    /**
     * 点击编辑银行卡bin接口
     */
    onEditBankbin() {
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "银行卡归属接口配置",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["modelName", { initialValue: "bankBin" }],
              },
            ],
          },
          {
            label: "AppKey",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入AppKey",
                decorator: [
                  "appKey",
                  {
                    initialValue: this.bankBinData.appKey,
                    rules: [{ required: true, message: "AppKey不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "AppSecret",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入AppSecret",
                decorator: [
                  "appSecret",
                  {
                    initialValue: this.bankBinData.appSecret,
                    rules: [{ required: true, message: "AppSecret不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "AppCode",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入AppCode",
                decorator: [
                  "appCode",
                  {
                    initialValue: this.bankBinData.appCode,
                    rules: [{ required: true, message: "AppCode不能为空" }],
                  },
                ],
              },
            ],
          },
        ],
      };
    },
    /**
     * 点击编辑银行卡bin接口
     */
     onEditBankCardVerify() {
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "银行卡四要素接口配置",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["modelName", { initialValue: "bankCardVerify" }],
              },
            ],
          },
          {
            label: "AppKey",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入AppKey",
                decorator: [
                  "appKey",
                  {
                    initialValue: this.bankCardVerifyData.appKey,
                    rules: [{ required: true, message: "AppKey不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "AppSecret",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入AppSecret",
                decorator: [
                  "appSecret",
                  {
                    initialValue: this.bankCardVerifyData.appSecret,
                    rules: [{ required: true, message: "AppSecret不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "AppCode",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入AppCode",
                decorator: [
                  "appCode",
                  {
                    initialValue: this.bankCardVerifyData.appCode,
                    rules: [{ required: true, message: "AppCode不能为空" }],
                  },
                ],
              },
            ],
          },
        ],
      };
    },
    onEditRealName() {
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "实名认证接口配置",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["modelName", { initialValue: "realName" }],
              },
            ],
          },
          {
            label: "AppKey",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入AppKey",
                decorator: [
                  "appKey",
                  {
                    initialValue: this.realNameData.appKey,
                    rules: [{ required: true, message: "AppKey不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "AppSecret",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入AppSecret",
                decorator: [
                  "appSecret",
                  {
                    initialValue: this.realNameData.appSecret,
                    rules: [{ required: true, message: "AppSecret不能为空" }],
                  },
                ],
              },
            ],
          },
          {
            label: "AppCode",
            item: [
              {
                formType: "input",
                col: 24,
                placeholder: "请输入AppCode",
                decorator: [
                  "appCode",
                  {
                    initialValue: this.realNameData.appCode,
                    rules: [{ required: true, message: "AppCode不能为空" }],
                  },
                ],
              },
            ],
          },
        ],
      };
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
@/api/apiConfig/bankBin
