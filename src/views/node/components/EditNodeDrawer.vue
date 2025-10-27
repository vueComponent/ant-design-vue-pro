<template>
  <a-drawer
    :title="title"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form-model
      ref="form"
      :model="formData"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-model-item label="节点名称" prop="nodeName">
        <a-input v-model="formData.nodeName" placeholder="请输入节点名称" />
      </a-form-model-item>

      <a-form-model-item label="网络类型" prop="natType">
        <a-select v-model="formData.natType" placeholder="请选择网络类型">
          <a-select-option value="PUBLIC">公网</a-select-option>
          <a-select-option value="FULL">NAT1</a-select-option>
          <a-select-option value="RESTRICT">NAT2</a-select-option>
          <a-select-option value="PORT_RESTRICT">NAT3</a-select-option>
          <a-select-option value="SYMMETRIC">NAT4</a-select-option>
          <a-select-option value="IPV6">IPV6</a-select-option>
          <a-select-option value="UNKNOWN">未知</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="网络状态" prop="status">
        <a-select v-model="formData.status" placeholder="请选择网络状态">
          <a-select-option value="ONLINE">在线</a-select-option>
          <a-select-option value="OUTLINE">离线</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="服务阶段状态" prop="stage">
        <a-select v-model="formData.stage" placeholder="请选择服务阶段状态">
          <a-select-option value="SUBMITTED">已提交</a-select-option>
          <a-select-option value="SUBMITTED_SUCCESS">提交成功</a-select-option>
          <a-select-option value="BOUND">待审核</a-select-option>
          <a-select-option value="ACCEPTING">验收中</a-select-option>
          <a-select-option value="WAIT_AUDIT">交付中</a-select-option>
          <a-select-option value="AUDIT_FAILED">验收未通过</a-select-option>
          <a-select-option value="INSERVICE">服务中</a-select-option>
          <a-select-option value="OFFLINE">已下线</a-select-option>
          <a-select-option value="RETIRED">已清退</a-select-option>
          <a-select-option value="EXCEPTION">异常</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="拨号方式" prop="dialMode">
        <a-select v-model="formData.dialMode" placeholder="请选择拨号方式">
          <a-select-option value="SERVER_DIAL">服务器拨号</a-select-option>
          <a-select-option value="STATIC_NET">公网静态IP</a-select-option>
          <a-select-option value="DHCP_NET">DHCP</a-select-option>
        </a-select>
      </a-form-model-item>
      <!--选择业务-->
      <a-form-model-item label="业务类型" prop="businessId">
        <a-select v-model="formData.businessId" placeholder="请选择业务类型">
          <a-select-option v-for="item in businessOptions" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="线路数" prop="bwNum">
        <a-input-number
          v-model="formData.bwNum"
          :min="1"
          placeholder="请输入线路数"
          style="width: 100%"
        />
      </a-form-model-item>

      <a-form-model-item label="上报带宽" prop="usbw">
        <a-input-number
          v-model="formData.usbw"
          :min="1"
          placeholder="请输入上报带宽"
          style="width: 100%"
        />
      </a-form-model-item>

      <a-form-model-item label="运营商" prop="isp">
        <a-select v-model="formData.isp" placeholder="请选择运营商">
          <a-select-option value="MOBILE">移动</a-select-option>
          <a-select-option value="UNICOM">联通</a-select-option>
          <a-select-option value="TELECOM">电信</a-select-option>
          <a-select-option value="BROADNET">广电</a-select-option>
          <a-select-option value="OTHER">其他</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="区域" prop="area">
        <a-cascader
          v-model="formData.area"
          :options="areaOptions"
          placeholder="请选择区域"
          style="width: 100%"
        />
      </a-form-model-item>
      <!--跨省调度使用单选-->
      <a-form-model-item label="跨省调度" prop="transProvSchedule">
        <a-radio-group v-model="formData.transProvSchedule">
          <a-radio :value="1">是</a-radio>
          <a-radio :value="0">否</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <!--跨省调度比例，跨省调度单选为真有效-->
      <a-form-model-item v-if="formData.transProvSchedule === 1" label="跨省调度比例" prop="transProvRate">
        <a-input-number
          v-model="formData.transProvRate"
          :min="1"
          placeholder="请输入跨省调度比例"
          style="width: 100%"
        />
      </a-form-model-item>
      <!--仅IPV6调度使用单选-->
      <a-form-model-item label="仅IPV6调度" prop="ipv6Schedule">
        <a-radio-group v-model="formData.ipv6Schedule">
          <a-radio :value="1">是</a-radio>
          <a-radio :value="0">否</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <!--调度时段使用select-->
      <a-form-model-item label="调度时段" prop="periodSchedule">
        <a-select v-model="formData.periodSchedule" placeholder="请选择调度时段">
          <a-select-option value="ALL_DAY">全天</a-select-option>
          <a-select-option value="NOON_EVENING">午晚高峰</a-select-option>
          <a-select-option value="EVENING">晚高峰</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="onSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { Edit } from "@/api/node/list";
import { AreaList } from "@/api/public";
// 引入业务集合
import { List as BusinessList } from "@/api/business/list";

export default {
  name: "EditNodeDrawer",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    record: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      title: "节点编辑",
      formData: {
        id: "",
        nodeName: "",
        natType: "",
        status: "",
        stage: "",
        dialMode: "",
        businessId: 0,
        bwNum: null,
        usbw: null,
        isp: "",
        area: [],
        transProvSchedule: 0,
        transProvRate: null,
        ipv6Schedule: 0,
        periodSchedule: "",
      },
      rules: {
        natType: [{ required: true, message: "请选择网络类型", trigger: "change" }],
        status: [{ required: true, message: "请选择网络状态", trigger: "change" }],
        stage: [{ required: true, message: "请选择服务阶段状态", trigger: "change" }],
        dialMode: [{ required: true, message: "请选择拨号方式", trigger: "change" }],
        bwNum: [{ required: true, message: "请输入线路数", trigger: "blur" }],
        businessId: [{ required: true, message: "请选择业务类型", trigger: "change" }],
        usbw: [{ required: true, message: "请输入上报带宽", trigger: "blur" }],
        isp: [{ required: true, message: "请选择运营商", trigger: "change" }],
        area: [{ required: true, message: "请选择区域", trigger: "change" }],
        transProvSchedule: [{ required: true, message: "请选择跨省调度", trigger: "change" }],
        transProvRate: [{ required: true, message: "请输入跨省调度比例", trigger: "blur" }],
        ipv6Schedule: [{ required: true, message: "请选择仅IPV6调度", trigger: "change" }],
        periodSchedule: [{ required: true, message: "请选择调度时段", trigger: "change" }],
      },
      areaOptions: [],
      businessOptions: [],
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.loadAreaOptions();
        this.initFormData();
        this.loadBusinessOptions();
      }
    },
  },
  methods: {
    async loadAreaOptions() {
      if (this.areaOptions.length === 0) {
        const { result } = await AreaList();
        this.areaOptions = result;
      }
    },
    /**
     * 加载业务集合
     */
    async loadBusinessOptions() {
      if (this.businessOptions.length === 0) {
        const { result } = await BusinessList();
        this.businessOptions = result;
      }
    },
    initFormData() {
      this.formData = {
        id: this.record.id,
        nodeName: this.record.nodeName,
        natType: this.record.natType,
        status: this.record.status,
        stage: this.record.stage,
        dialMode: this.record.dialMode,
        businessId: this.record.businessId,
        bwNum: this.record.bwNum,
        usbw: this.record.usbw,
        isp: this.record.isp,
        area: [this.record.provinceCode, this.record.cityCode],
        transProvSchedule: this.record.transProvSchedule,
        transProvRate: this.record.transProvRate,
        ipv6Schedule: this.record.ipv6Schedule,
        periodSchedule: this.record.periodSchedule,
      };
    },
    onClose() {
      this.$refs.form.resetFields();
      this.$emit("close");
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.handleEdit();
        }
      });
    },
    async handleEdit() {
      const params = {
        ...this.formData,
        provinceCode: this.formData.area[0],
        cityCode: this.formData.area[1],
      };

      const res = await Edit(params);
      if (res.code === 0) {
        this.$message.success("编辑成功");
        this.$emit("success");
        this.onClose();
      } else {
        this.$message.error(res.message);
      }
    },
  },
};
</script>
