<template>
  <a-drawer title="编辑上游配置" :visible="visible" :width="720" @close="handleClose">
    <a-form :form="form" layout="vertical">
      <!-- 固定字段 -->
      <a-form-item label="ID" v-show="false">
        <a-input v-decorator="['id']" disabled />
      </a-form-item>

      <a-form-item label="名称">
        <a-input
          v-decorator="['name', { rules: [{ required: true, message: '请输入名称' }] }]"
          placeholder="请输入名称"
        />
      </a-form-item>

      <a-form-item label="上游公司">
        <a-input :value="record.companyName" disabled />
      </a-form-item>

      <a-form-item label="进制">
        <a-input-number
          v-decorator="[
            'radix',
            {
              initialValue: 1024,
              rules: [{ required: true, message: '请输入进制' }],
            },
          ]"
          :min="1"
          style="width: 100%"
        />
      </a-form-item>

      <!-- 动态配置项 -->
      <div v-for="(config, index) in dynamicConfigs" :key="index">
        <a-form-item :label="config.title">
          <!-- 文本输入框 -->
          <a-input
            v-if="config.type === 'text'"
            v-decorator="[
              `configs.${config.name}`,
              {
                initialValue: config.defaultValue,
                rules: [{ required: config.required, message: `请输入${config.title}` }],
              },
            ]"
            :placeholder="`请输入${config.title}`"
          />

          <!-- 密码输入框 -->
          <a-input-password
            v-else-if="config.type === 'password'"
            v-decorator="[
              `configs.${config.name}`,
              {
                initialValue: config.defaultValue,
                rules: [{ required: config.required, message: `请输入${config.title}` }],
              },
            ]"
            :placeholder="`请输入${config.title}`"
          />

          <!-- 下拉选择框 -->
          <a-select
            v-else-if="config.type === 'select'"
            v-decorator="[
              `configs.${config.name}`,
              {
                initialValue: config.defaultValue,
                rules: [{ required: config.required, message: `请选择${config.title}` }],
              },
            ]"
            :placeholder="`请选择${config.title}`"
          >
            <a-select-option
              v-for="option in config.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <a-form-item label="备注">
          <a-textarea v-decorator="['remark']" placeholder="请输入备注" :rows="4" />
        </a-form-item>
    </a-form>

    <div class="drawer-footer">
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" @click="handleSubmit" :loading="loading"> 提交 </a-button>
    </div>
  </a-drawer>
</template>

<script>
import { UpdateConfig } from '@/api/upstream/apiConfig'

export default {
  props: {
    visible: Boolean,
    record: Object, // 传入的配置数据
    ruleData: {
      type: Array,
      default: () => ([])
    }
  },

  data() {
    return {
      loading: false,
      dynamicConfigs: [], // 动态生成的配置项
      form: this.$form.createForm(this),
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.initForm();
        });
      }
    },
    // 监听record变化，确保数据更新时重新加载
    record: {
      deep: true,
      handler() {
        if (this.visible) {
          this.prepareDynamicConfigs();
        }
      },
    },
  },

  methods: {
    // 初始化表单
    initForm() {
      // 重置表单状态
      this.form.resetFields();

      // 准备动态配置项
      this.prepareDynamicConfigs();
    },

    // 准备动态配置项（确保显示所有规则配置项）
    prepareDynamicConfigs() {
      // 1. 根据companyCode查找匹配的规则
      const companyCode = this.record.companyCode;
      if (!companyCode) {
        this.dynamicConfigs = [];
        return;
      }

      console.log(JSON.stringify(this.record));

      const companyRule = (this.ruleData || []).find(
        (item) => item.code === companyCode
      );

      if (!companyRule) {
        console.warn(`未找到公司编码为 ${companyCode} 的规则`);
        this.dynamicConfigs = [];
        return;
      }
      // console.log(JSON.stringify(companyRule));
      // 2. 确保处理空值情况
      const recordConfigs = this.record.configs || {};

      // 3. 创建动态配置项数组（显示所有规则配置项）
      this.dynamicConfigs = (companyRule.configs || []).map((config) => {
        // 优先使用配置列中的值
        const recordValue = recordConfigs[config.name];

        // 如果配置列中有值则使用，否则使用规则默认值
        const value =
          recordValue !== undefined && recordValue !== null
            ? recordValue
            : config.defaultValue;

        return {
          ...config,
          defaultValue: value,
        };
      });

      // 4. 设置表单初始值
      this.setInitialFormValues();
    },

    // 设置表单初始值
    setInitialFormValues() {
      const formValues = {
        id: this.record.id,
        name: this.record.name,
        radix: this.record.radix || 1024,
        remark: this.record.remark,
      };

      // 添加动态配置项的值
      const configValues = {};
      this.dynamicConfigs.forEach((config) => {
        configValues[`configs.${config.name}`] = config.defaultValue;
      });

      // 合并所有值
      this.form.setFieldsValue({
        ...formValues,
        ...configValues,
      });
    },

    // 提交表单
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (err) return;

        this.loading = true;

        // 构建提交数据
        const submitData = {
          id: values.id,
          name: values.name,
          radix: values.radix,
          remark: values.remark,
          configs: values.configs,
        };

        // 提交更新逻辑
        console.log("提交数据:", JSON.stringify(submitData));
        // 这里实际调用API更新
        UpdateConfig(submitData).then((res) => {
          if (res.code === 0) {
           this.$message.success('更新成功');
           this.$emit('refresh');
           this.handleClose();
          } else {
            this.$message.error(res.message);
          }
        }).finally(() => {
           this.loading = false;
        });

        // 模拟提交
        /*
        setTimeout(() => {
          this.loading = false;
          this.$message.success("更新成功");
          this.$emit("refresh");
          this.handleClose();
        }, 800);
        */
      });
    },

    // 关闭抽屉
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.drawer-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
  border-top: 1px solid #e9e9e9;
}
</style>
