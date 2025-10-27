<template>
  <a-drawer
    :title="title"
    :width="960"
    :visible="visible"
    @close="handleClose"
    :destroyOnClose="true"
    :closable="true"
  >
    <a-form :form="form" layout="vertical">
      <a-form-item label="名称">
        <a-input
          v-decorator="[
            'name',
            {
              rules: [
                { required: true, message: '请输入脚本名称' },
                { max: 50, message: '名称长度不能超过50个字符' },
              ],
            },
          ]"
          placeholder="请输入脚本名称"
        />
      </a-form-item>

      <a-form-item label="脚本类型">
        <a-select
          v-decorator="[
            'type',
            { rules: [{ required: true, message: '请选择脚本类型' }] },
          ]"
          placeholder="请选择脚本类型"
        >
          <a-select-option
            v-for="type in scriptTypes"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="脚本内容">
        <div class="code-editor-container">
          <codemirror
            ref="editor"
            v-model="codeContent"
            :options="cmOptions"
          ></codemirror>
          <a-input
            v-decorator="[
              'content',
              {
                rules: [
                  { required: true, message: '请输入脚本内容' },
                  { validator: validateContent },
                ],
              },
            ]"
            type="hidden"
          />
        </div>
      </a-form-item>

      <a-form-item label="描述">
        <a-textarea
          v-decorator="['description', { max: 200 }]"
          :rows="3"
          placeholder="请输入脚本描述（可选）"
        />
      </a-form-item>
    </a-form>

    <div class="drawer-footer">
      <a-button style="margin-right: 15px" @click="handleClose">取消</a-button>
      <a-button type="primary" @click="handleSubmit" :loading="submitting">
        {{ submitText }}
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/shell/shell.js";

export default {
  name: "ScriptEditDrawer",
  components: {
    codemirror,
  },
  props: {
    // 控制抽屉显示
    visible: {
      type: Boolean,
      default: false,
    },
    // 编辑模式时传入的脚本数据
    scriptData: {
      type: Object,
      default: null,
    },
    // 提交按钮加载状态
    submitting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      codeContent: "",
      cmOptions: {
        tabSize: 4,
        mode: "text/x-sh",
        theme: "dracula",
        lineNumbers: true,
        line: true,
        lineWrapping: true, // 开启自动换行
        indentUnit: 4,
        smartIndent: true,
        autofocus: true,
        extraKeys: { "Ctrl-Space": "autocomplete" },
      },
      scriptTypes: [
        { value: "COMMON", label: "公共脚本" },
        { value: "ENV_DEPLOY", label: "环境部署" },
        { value: "BIZ_DEPLOY", label: "业务部署" },
        { value: "BIZ_DEPLOY_CHECK", label: "业务部署检查" },
        { value: "BIZ_OPERATION_CHECK", label: "业务运行检查" },
        { value: "BIZ_UNINSTALL", label: "业务卸载" },
        { value: "ENV_UNINSTALL", label: "环境卸载" },
        { value: "GET_BIZ_NO", label: "获取业务编号" },
        { value: "API_DEPLOY", label: "API调用部署" },
        { value: "NET_CONFIG", label: "网络配置" },
      ],
    };
  },
  computed: {
    // 标题动态显示
    title() {
      return this.scriptData ? "编辑脚本" : "新增脚本";
    },
    // 提交按钮文本
    submitText() {
      return this.submitting
        ? this.scriptData
          ? "更新中..."
          : "提交中..."
        : this.scriptData
        ? "更新"
        : "提交";
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.form.resetFields();
          if (this.scriptData) {
            // 编辑模式：填充数据
            this.form.setFieldsValue({
              name: this.scriptData.name,
              type: this.scriptData.type,
              content: this.scriptData.content,
              description: this.scriptData.description,
            });
            this.codeContent = this.scriptData.content;
          } else {
            // 新增模式：重置编辑器内容
            this.codeContent = "";
          }
        });
      }
    },
    // 同步代码内容到表单
    codeContent(val) {
      this.form.setFieldsValue({ content: val });
    },
  },
  methods: {
    // 验证脚本内容
    validateContent(rule, value, callback) {
      if (!value || !value.trim()) {
        callback(new Error("请输入脚本内容"));
      } else if (value.length > 5000) {
        callback(new Error("脚本内容长度不能超过5000个字符"));
      } else {
        callback();
      }
    },
    // 关闭抽屉
    handleClose() {
      this.$emit("close");
    },
    // 提交表单
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          // 提交的数据
          const formData = {
            ...values,
            // 编辑模式包含ID
            ...(this.scriptData && { id: this.scriptData.id }),
          };
          this.$emit("submit", formData);
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

.code-editor-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

/* 代码编辑器高度 */
::v-deep .CodeMirror {
  height: 300px;
  font-family: "Fira Code", "Source Code Pro", monospace;
  font-size: 14px;
}
</style>
