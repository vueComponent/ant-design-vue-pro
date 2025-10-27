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
        <a-form-model-item ref="taxRate" label="税率" prop="taxRate">
          <a-input v-model="formData.taxRate" placeholder="请输入税率，个人提现扣除税率，对企业无效" />
        </a-form-model-item>
        <a-form-model-item ref="week" label="每周提现时间" prop="week">
          <a-radio-group v-model="formData.week">
            <a-radio
              v-for="item in [
                { label: '周一', value: 'MONDAY' },
                { label: '周二', value: 'TUESDAY' },
                { label: '周三', value: 'WEDNESDAY' },
                { label: '周四', value: 'THURSDAY' },
                { label: '周五', value: 'FRIDAY' },
                { label: '周六', value: 'SATURDAY' },
                { label: '周日', value: 'SUNDAY' },
              ]"
              :value="item.value"
            >
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="开始时间" prop="startTime">
          <a-select v-model="formData.startTime" placeholder="请选择">
            <a-select-option v-for="item in startTimeOptions" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="结束时间" prop="endTime">
          <a-select v-model="formData.endTime" placeholder="请选择">
            <a-select-option v-for="item in endTimeOptions" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="minAmount" label="最小提现金额" prop="minAmount">
          <a-input v-model="formData.minAmount" placeholder="请输入最小提现金额" />
        </a-form-model-item>
        <a-form-model-item ref="maxAmount" label="最大提现金额" prop="maxAmount">
          <a-input v-model="formData.maxAmount" placeholder="请输入最大提现金额，为空不限制" />
        </a-form-model-item>
        <a-form-model-item ref="notes" label="提现说明" prop="notes">
          <a-textarea v-model="formData.notes" :rows="8" placeholder="请输入提现说明,支持html标签" />
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
import { Get, Save } from "@/api/withdrawal/config";
import { multi, div } from '@/utils/operationUtil'
export default {
  name: "WithdrawalConfig",
  data() {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      formData: {
        taxRate: "",
        week: "MONDAY",
        startTime: undefined,
        endTime: undefined,
        // 最小提现金额
        minAmount: undefined,
        // 最大提现金额
        maxAmount: undefined,
        // 提现说明
        notes: "",
      },
      // 自有域名表单验证规则
      rules: {
        taxRate: [{ required: true, message: "不能为空", trigger: "blur" }],
        week: [{ required: true, message: "不能为空", trigger: "blur" }],
        startTime: [{ required: true, message: "不能为空", trigger: "blur" }],
        endTime: [{ required: true, message: "不能为空", trigger: "blur" }],
        minAmount: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.get();
  },
  computed: {
    startTimeOptions() {
      const options = [];
      for (let i = 0; i < 24; i++) {
        // 使用 padStart 保证两位数格式，例如 09:00 而不是 9:00
        const hour = i.toString().padStart(2, "0");
        options.push({ label: `${hour}:00`, value: i });
      }
      return options;
    },
    endTimeOptions() {
      const options = [];
      for (let i = 0; i < 24; i++) {
        // 使用 padStart 保证两位数格式，例如 09:00 而不是 9:00
        const hour = i.toString().padStart(2, "0");
        options.push({ label: `${hour}:00`, value: i });
      }
      return options;
    },
  },
  methods: {
    get() {
      Get().then((res) => {
        if (res.code === 0 && res.result !== null) {
          res.result.taxRate = multi(res.result.taxRate, 100)
          this.formData = res.result;
        }
      });
    },
    // 点击提交
    onSubmit() {
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          // 税率除100
          this.formData.taxRate = div(this.formData.taxRate, 100, 4)
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
