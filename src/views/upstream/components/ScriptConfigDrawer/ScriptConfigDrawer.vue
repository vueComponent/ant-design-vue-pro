<template>
  <a-drawer :title="drawerTitle" :width="720" :visible="visible" @close="onClose">
    <a-form :form="form" layout="vertical">
      <!-- 上游编号 -->
      <a-form-item label="上游编号">
        <a-input :value="upstreamId" disabled />
      </a-form-item>

      <!-- 脚本选择区域 -->
      <a-form-item
        v-for="item in scriptTypes"
        :key="item.value"
        :label="item.label"
        :required="item.required"
      >
        <a-select
          v-decorator="[item.field]"
          placeholder="请选择脚本"
          @change="handleScriptChange"
        >
          <a-select-option
            v-for="script in filteredScripts(item.value)"
            :key="script.id"
            :value="script.id"
          >
            {{ script.name }} ({{ script.typeName }})
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <div class="drawer-footer">
      <a-button @click="onClose">取消</a-button>
      <a-button type="primary" @click="handleSubmit" :loading="loading"> 保存 </a-button>
    </div>
  </a-drawer>
</template>

<script>
import { List as GetScriptList } from "@/api/business/script";
import { Save, GetByUpstreamId } from "@/api/upstream/script";

export default {
  name: "ScriptConfigDrawer",
  data() {
    return {
      visible: false,
      loading: false,
      upstreamId: "",
      upstreamName: "",
      scriptList: [],
      form: this.$form.createForm(this),

      // 脚本类型配置
      scriptTypes: [
        {
          label: "环境部署脚本",
          value: "ENV_DEPLOY",
          field: "envDeploy",
          required: false,
        },
        {
          label: "业务部署脚本",
          value: "BIZ_DEPLOY",
          field: "bizDeploy",
          required: false,
        },
        {
          label: "获取业务编号脚本",
          value: "GET_BIZ_NO",
          field: "bizNumber",
          required: false,
        },
        {
          label: "业务卸载脚本",
          value: "BIZ_UNINSTALL",
          field: "bizUninstall",
          required: false,
        },
        {
          label: "环境卸载脚本",
          value: "ENV_UNINSTALL",
          field: "envUninstall",
          required: false,
        },
      ],
    };
  },
  computed: {
    drawerTitle() {
      return `上游脚本绑定 - ${this.upstreamName}`;
    },
  },
  methods: {
    // 打开抽屉
    open(upstreamId, upstreamName, bindings = {}) {
      this.upstreamId = upstreamId;
      this.upstreamName = upstreamName;
      this.visible = true;

      // 加载脚本列表
      this.fetchScripts().then(() => {
        this.$nextTick(() => {
          // 初始化表单值（回显）
          const formValues = {};
          this.scriptTypes.forEach((item) => {
            formValues[item.field] = bindings[item.field] || undefined;
          });
          this.form.setFieldsValue(formValues);
        });
      });
    },

    // 获取脚本列表
    async fetchScripts() {
      try {
        const res = await GetScriptList();
        this.scriptList = res.result;
      } catch (error) {
        this.$message.error("获取脚本列表失败");
      }
    },

    // 按类型过滤脚本
    filteredScripts(type) {
      return this.scriptList.filter((script) => script.type === type);
    },

    // 关闭抽屉
    onClose() {
      this.visible = false;
      this.form.resetFields();
    },

    // 提交表单
    handleSubmit() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true;
          try {
            // 添加上游ID
            const params = {
              upstreamId: this.upstreamId,
              ...values,
            };

            const res = await Save(params);
            if (res.code === 0) {
              this.$message.success("绑定成功");
              this.$emit("success");
              this.onClose();
            } else {
              this.$message.error(res.message);
            }
          } catch (error) {
            this.$message.error("绑定失败");
          } finally {
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.drawer-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
}
</style>
