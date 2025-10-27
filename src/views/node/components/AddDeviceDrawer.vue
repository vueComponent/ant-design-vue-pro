<template>
  <a-drawer
    title="添加设备"
    width="720"
    :visible="visible"
    @close="onClose"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      layout="vertical"
    >
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-model-item label="节点ID" prop="deviceId">
            <a-input v-model="form.deviceId" placeholder="请输入节点ID" />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-model-item label="用户ID" prop="userId">
            <a-input v-model="form.userId" placeholder="请输入用户ID" />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-model-item label="节点名称" prop="nodeName">
            <a-input v-model="form.nodeName" placeholder="请输入节点名称" />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-model-item label="期望业务" prop="business">
            <a-select
              v-model="form.business"
              placeholder="请选择业务"
              @change="onBusinessChange"
            >
              <a-select-option
                v-for="item in businessData"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16" v-if="schedule.periodSchedule.length > 0">
        <a-col :span="24">
          <a-form-model-item label="调度时段" prop="periodSchedule">
            <a-radio-group v-model="form.periodSchedule">
              <a-radio
                v-for="item in schedule.periodSchedule"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-model-item label="地区" prop="area">
            <a-cascader
              v-model="form.area"
              :options="areaData"
              placeholder="请选择地区"
              @change="onChangeArea"
              :showSearch="{ filter }"
            />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16" v-if="schedule.transProvSchedule !== 0">
        <a-col :span="24">
          <a-form-model-item label="跨省调度">
            <a-radio-group
              v-model="form.transProvSchedule"
              :disabled="schedule.isShowTransProvScheduleText"
            >
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
            <span
              v-if="schedule.isShowTransProvScheduleText"
              style="color: coral; margin-left: 10px"
            >
              该业务必须支持跨省调度
            </span>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16" v-if="schedule.crossIspSchedule === 1">
        <a-col :span="24">
          <a-form-model-item label="异网调度">
            <a-radio-group v-model="form.crossIspSchedule" @change="onCrossIspSchedule">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-model-item label="运营商" prop="isp">
            <a-select v-model="form.isp" placeholder="请选择运营商" @change="onIsp">
              <a-select-option
                v-for="item in ispData"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row
        :gutter="16"
        v-if="schedule.crossIspSchedule === 1 && form.crossIspSchedule == 1"
      >
        <a-col :span="24">
          <a-form-model-item label="异网调度运营商" prop="crossIsp">
            <a-select v-model="form.crossIsp" placeholder="请选择异网运营商">
              <a-select-option
                v-for="item in crossIspData"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16" v-if="deviceType === 'X86'">
        <a-col :span="24">
          <a-form-model-item label="网络类型" prop="natType">
            <a-select v-model="form.natType" placeholder="请选择网络类型">
              <a-select-option
                v-for="item in natTypeData"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16" v-if="deviceType === 'X86'">
        <a-col :span="24">
          <a-form-model-item label="拨号方式" prop="dialMode">
            <a-select v-model="form.dialMode" placeholder="请选择拨号方式">
              <a-select-option
                v-for="item in dialModeData"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-model-item label="单条上行" prop="usbw">
            <a-input
              v-model="form.usbw"
              placeholder="请输入单条上行带宽"
              addonAfter="Mbps"
            />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16" v-if="deviceType === 'X86'">
        <a-col :span="24">
          <a-form-model-item label="线路数量" prop="bwNum">
            <a-input v-model="form.bwNum" placeholder="请输入线路数量" />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="16" v-if="schedule.ipv6Schedule == 1">
        <a-col :span="24">
          <a-form-model-item label="仅IPV6调度">
            <a-radio-group v-model="form.ipv6Schedule">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <div style="height: 30px;"></div>
    <div class="drawer-footer">
      <a-button @click="onClose" style="margin-right: 15px">取消</a-button>
      <a-button type="primary" @click="submit" :loading="loading">立即绑定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import {
  GetIsp,
  GetNatType,
  GetDialMode,
  Add,
} from "@/api/node/list";
import { List as AreaList } from "@/api/area";
import { List } from "@/api/business/list";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    deviceId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        deviceId: this.deviceId,
        userId: undefined,
        nodeName: "",
        area: null,
        provinceCode: "",
        cityCode: "",
        isp: undefined,
        crossIsp: undefined,
        business: undefined,
        businessId: undefined,
        natType: undefined,
        dialMode: undefined,
        usbw: undefined,
        bwNum: 1,
        crossIspSchedule: 0,
        transProvSchedule: 0,
        transProvRate: undefined,
        ipv6Schedule: 0,
        periodSchedule: "",
      },
      rules: {
        deviceId: [{ required: true, message: "请输入节点ID", trigger: "blur" }],
        userId: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
        business: [{ required: true, message: "请选择业务", trigger: "change" }],
        periodSchedule: [
          { required: true, message: "请选择调度时段", trigger: "change" },
        ],
        area: [{ required: true, message: "请选择地区", trigger: "change" }],
        isp: [{ required: true, message: "请选择运营商", trigger: "change" }],
        crossIsp: [{ required: true, message: "请选择异网运营商", trigger: "change" }],
        natType: [{ required: true, message: "请选择网络类型", trigger: "change" }],
        dialMode: [{ required: true, message: "请选择拨号方式", trigger: "change" }],
        usbw: [
          { required: true, message: "请输入单条上行带宽", trigger: "blur" },
          { validator: this.validateUsbw, trigger: "blur" },
        ],
        bwNum: [
          { required: true, message: "请输入线路数量", trigger: "blur" },
          {
            pattern: /^(?:[1-9]\d*|0?\.\d*[1-9]\d*)$/,
            message: "数量必须大于0",
            trigger: "blur",
          },
        ],
      },
      loading: false,
      usbw: 1,
      deviceType: "",
      minUsbw: null,

      // 数据选项
      ispData: [],
      areaData: [],
      businessData: [],
      natTypeData: [],
      dialModeData: [],
      crossIspData: [],

      // 调度配置
      schedule: {
        crossIspSchedule: 0,
        transProvSchedule: 0,
        ipv6Schedule: 0,
        isShowTransProvScheduleText: false,
        periodSchedule: [],
      },
    };
  },
  watch: {
    deviceId(newVal) {
      this.form.deviceId = newVal;
    },
  },
  mounted() {
    try {
      this.getIsp();
      this.areaList();
      this.getBusiness();
      this.getNatType();
      this.getDialMode();
    } catch (error) {
      console.error("初始化错误:", error);
    }
  },
  methods: {
    onClose() {
      this.$emit("close");
    },

    // 表单验证方法
    validateUsbw(rule, value, callback) {
      if (value < 1) {
        callback(`单条上行带宽不能小于等于${this.usbw}Mbps`);
        return;
      }

      const minUsbwFormat = this.minUsbw;
      if (!minUsbwFormat || minUsbwFormat === null) {
        callback();
        return;
      }
      // 先判断minUsbwFormat等于数字类型
      if (typeof minUsbwFormat === "number") {
         if (value < minUsbwFormat) {
          callback(`单条上行带宽不能小于等于${minUsbwFormat}Mbps`);
          return;
        }
      }

      const parts = minUsbwFormat.split("-");
      const min = Number(parts[0]);
      const step = parts.length > 1 ? Number(parts[1]) : null;

      if (isNaN(min)) {
        callback("Invalid validation rule");
        return;
      }

      let isValid = true;
      let errorMsg = "";

      if (value < min) {
        isValid = false;
        errorMsg = `必须大于等于 ${min}`;
      }

      if (step && !isNaN(step)) {
        if (value % step !== 0) {
          isValid = false;
          errorMsg += errorMsg ? `且必须是 ${step} 的倍数` : `必须是 ${step} 的倍数`;
        }
      }

      if (!isValid) {
        callback(errorMsg + "Mbps");
      } else {
        callback();
      }
    },

    // 地区相关方法
    async areaList() {
      const res = await AreaList();
      this.areaData = res.result;
    },

    onChangeArea(value) {
      this.form.provinceCode = value[0];
      this.form.cityCode = value[1];
    },

    // 运营商相关方法
    async getIsp() {
      const res = await GetIsp();
      this.ispData = res.result;
    },

    onIsp(value) {
      this.crossIspData = this.ispData.filter((item) => item.value !== value);
    },

    // 业务相关方法
    async getBusiness() {
      const res = await List();
      if(res.code === 0){
        this.businessData = res.result;
      }
    },

    onBusinessChange(value) {
      const item = this.businessData.find((item) => item.id === parseInt(value));

      if (item) {
        this.form.businessId = item.id;
        this.deviceType = item.deviceType;

        this.schedule.crossIspSchedule = item.crossIspSchedule;
        this.schedule.transProvSchedule = item.transProvSchedule;
        this.schedule.ipv6Schedule = item.ipv6Schedule;
        this.schedule.isShowTransProvScheduleText = item.transProvSchedule === 2;

        this.form.periodSchedule =
          item.periodSchedule.length > 0 ? item.periodSchedule[0].value : "";
        this.schedule.periodSchedule = item.periodSchedule;

        this.form.transProvSchedule =
          item.transProvSchedule === 2 ? 1 : item.transProvSchedule;
        // console.log(item.minUsbw);
        this.minUsbw = item.minUsbw;
      }
    },

    onCrossIspSchedule(e) {
      this.form.crossIspSchedule = parseInt(e.target.value);
    },

    // 网络类型
    async getNatType() {
      const res = await GetNatType();
      this.natTypeData = res.result;
    },

    // 拨号方式
    async getDialMode() {
      const res = await GetDialMode();
      this.dialModeData = res.result;
    },

    deviceIdHandler(deviceId) {
      const equalSignIndex = deviceId.indexOf("=");
      if (equalSignIndex === -1) {
        return deviceId;
      }
      return deviceId.substring(equalSignIndex + 1).split("&")[0];
    },

    // 提交表单
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;

          const formData = {
            ...this.form,
            businessId: this.form.businessId,
            provinceCode: this.form.provinceCode,
            cityCode: this.form.cityCode,
            transProvRate: parseInt(this.form.transProvSchedule) === 1 ? 100 : null,
          };

          try {
            const res = await Add(formData);
            if (res.code === 0) {
              this.$message.success("绑定成功");
              this.$emit("success", res.result);
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
    // 级联搜索过滤器
    filter(inputValue, path) {
      return path.some((option) => option.label.indexOf(inputValue) > -1);
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
  border-radius: 0 0 4px 4px;
}
</style>
