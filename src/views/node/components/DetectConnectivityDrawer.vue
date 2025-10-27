<template>
  <a-drawer
    :title="title"
    :width="900"
    :visible="visible"
    @close="onClose"
    :bodyStyle="{ paddingBottom: '80px' }"
  >
    <!-- 其他渠道 -->
    <div v-if="isSuccess === null">
      <div class="show-success">
        <a-icon
          type="check-circle"
          theme="filled"
          style="color: #f4601b; font-size: 24px"
        />
        <span>已绑定待提交</span>
      </div>
    </div>
    <div v-else-if="isSuccess === false">
      <div class="error-msg">
        {{ errorMsg }}
      </div>
    </div>
    <div v-else-if="isSuccess === true">
      <a-card :bordered="false" style="margin-bottom: 16px">
        <a-row v-if="data.host" class="details-row">
          <a-col :span="8">
            <div class="details-row-label">IP</div>
          </a-col>
          <a-col :span="16">
            <div class="details-row-content right">
              {{ data.host }}
            </div>
          </a-col>
        </a-row>
        <a-row v-if="data.port" class="details-row">
          <a-col :span="8">
            <div class="details-row-label">端口</div>
          </a-col>
          <a-col :span="16">
            <div class="details-row-content right">
              {{ data.port }}
            </div>
          </a-col>
        </a-row>
        <a-row v-if="data.area && data.ispName" class="details-row">
          <a-col :span="8">
            <div class="details-row-label">地区/运营商</div>
          </a-col>
          <a-col :span="16">
            <div class="details-row-content right">
              {{ `${data.area} / ${data.ispName}` }}
            </div>
          </a-col>
        </a-row>
        <a-row v-if="data.cpuCores" class="details-row">
          <a-col :span="8">
            <div class="details-row-label">CPU核数</div>
          </a-col>
          <a-col :span="16">
            <div class="details-row-content right">
              {{ data.cpuCores }}
            </div>
          </a-col>
        </a-row>
        <a-row v-if="data.cpuThreads" class="details-row">
          <a-col :span="8">
            <div class="details-row-label">CPU线程数</div>
          </a-col>
          <a-col :span="16">
            <div class="details-row-content right">
              {{ data.cpuThreads }}
            </div>
          </a-col>
        </a-row>
        <a-row v-if="data.memorySize" class="details-row">
          <a-col :span="8">
            <div class="details-row-label">内存</div>
          </a-col>
          <a-col :span="16">
            <div class="details-row-content right">
              {{ `${data.memorySize}G` }}
            </div>
          </a-col>
        </a-row>
        <a-row v-if="data.diskSize" class="details-row">
          <a-col :span="8">
            <div class="details-row-label">硬盘容量</div>
          </a-col>
          <a-col :span="16">
            <div class="details-row-content right">
              {{ `${data.diskSize}T` }}
            </div>
          </a-col>
        </a-row>
        <a-row v-if="data.natTypeName" class="details-row">
          <a-col :span="8">
            <div class="details-row-label">NAT类型</div>
          </a-col>
          <a-col :span="16">
            <div class="details-row-content right">
              {{ data.natTypeName }}
            </div>
          </a-col>
        </a-row>
      </a-card>
     
      <div style="padding-bottom: 10px; font-weight: 500">网卡信息</div>
      <a-table
        :columns="ethColumns"
        :data-source="data.ethMsg"
        :pagination="false"
        :row-key="(record) => record.name"
      > 
        <span slot="statusName" slot-scope="text, record">
          <div v-if="record.status === 'UP'" style="color:#1aa4ff">{{ text }}</div>
          <div v-else-if="record.status === 'DOWN'" style="color: red">{{ text }}</div>
		  <div v-else-if="record.status === 'UNKNOWN'">{{ text }}</div>
		  <div v-else>--</div>
        </span>
      </a-table>
    </div>

    <div class="drawer-footer">
      <a-button v-if="isSuccess === false" @click="getDetectConnectivity" style="margin-right: 15px"> 测试连接 </a-button>
      <!--<a-button v-if="supportPreDialTsetData.networkTset" @click="onNetworkPressure" style="margin-right: 15px">网络测速</a-button>-->
      <a-button type="primary" @click="onDial" :loading="loading">{{ dialMode === "DHCP_NET" && isDhcpConfigData === false ? "提交上机" : "网络配置" }}</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { DetectConnectivity, SupportPreDialTset, DialSubmit, IsDhcpNeedConfig } from "@/api/node/list";


// 表格字段，checked是否显示
const ethColumns = [
  {
    title: "设备信息",
    dataIndex: "name",
  },
  {
    title: "IP",
    dataIndex: "ip",
  },
  {
    title: "速率",
    dataIndex: "speed",
  },
  {
    title: "最大速率",
    dataIndex: "speedMax",
  },
  {
    title: "状态",
    dataIndex: "statusName",
    scopedSlots: { customRender: "statusName" },
    width: "80px",
  },
];

export default {
  name: "NodeBindDrawer",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: 0,
    },
    dialMode: { 
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: "测试连接",
    },
  },
  data() {
    return {
      loading: false,
      data: {},
      errorMsg: "",
      isSuccess: undefined,
      supportPreDialTsetData: {
        dialTset: false,
        networkTset: false,
      },
      ethColumns,
      // 是否需要Dhcp配置
      isDhcpConfigData: false,
    };
  },
  watch: {
    visible(val) {
      if (val && this.id) {
        // 使用异步同时执行获取数据
        this.getSupportPreDialTset();
        this.getDetectConnectivity();
        this.getIsDhcpConfig();
        console.log("isDhcpConfigData", this.isDhcpConfigData);
      }
    },
  },
  methods: {
    onClose() {
      this.$emit("close");
    },
    onDeviceList() {
      this.$emit("device-list");
    },
    async getDetectConnectivity() {
      this.loading = true;
      try {
        const res = await DetectConnectivity(this.id);
        if (res.code === 0) {
          if (res.result !== null) {
            this.data = res.result;
            // this.dialMode = res.result.dialMode || "";
            this.isSuccess = true;
          } else {
            this.isSuccess = null;
          }
        } else {
          this.errorMsg = res.message || "检测失败，请稍后重试";
          this.isSuccess = false;
        }
      } catch (error) {
        this.isSuccess = false;
        this.errorMsg = "网络连接错误，请重试";
      } finally {
        this.loading = false;
      }
    },
    async onDial() {
      if (this.id === 0) {
        this.$message.warning("节点不能为空");
        return;
      }
      if (this.isSuccess === false) {
        this.$message.warning("连接错误无法提交");
        return;
      }

      if (!(this.dialMode === "DHCP_NET" && this.isDhcpConfigData === false)) {
        // 拨号操作
        this.$emit("dial", this.id, this.dialMode, this.data.ethMsg);
      } else {
        this.loading = true;
        try {
          const res = await DialSubmit(this.id);
          if (res.code === 0) {
            this.$emit("success");
            this.$message.success("操作成功");
          } else {
            this.$message.error("提交失败：" + res.message);
          }
        } catch (error) {
          this.$message.error("请求异常：" + error);
        } finally {
          this.loading = false;
        }
      }
    },
    async getSupportPreDialTset() {
      if (this.id !== 0) {
        const res = await SupportPreDialTset(this.id);
        if (res.code === 0 && res.result !== null) {
          this.supportPreDialTsetData.dialTset = res.result.dialTset;
          this.supportPreDialTsetData.networkTset = res.result.networkTset;
        }
      }
    },
    onNetworkPressure() {
      this.$emit("network-speed-test", this.id);
    },
    // 判断是否需要Dhcp配置
    async getIsDhcpConfig() {
      const res = await IsDhcpNeedConfig(this.id);
      if (res.code === 0) {
        this.isDhcpConfigData = res.result;
      } else {
        this.isDhcpConfigData = false;
      }
    },
  },
};
</script>

<style scoped>
.show-success {
  height: 60px;
  margin-top: 80px;
  text-align: center;
  font-size: 18px;
  font-weight: 900;
  color: #2f2f2f;
}

.error-msg {
  color: red;
  padding: 8px;
  font-size: 13px;
  background-color: #ffffff;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
}

.details-row-label {
  line-height: 26px;
  font-size: 13px;
  color: #7c7c7c;
}

.details-row-content {
  line-height: 30px;
  font-size: 13px;
  color: #181818;
}

.right {
  float: right;
}

.table {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.row {
  display: flex;
  line-height: 26px;
  padding: 2px;
  flex: 1;
  text-align: center;
}

.cell {
  flex: 1;
  padding: 8px;
  border: 1px solid #e8e8e8;
}

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

.but {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
}
</style>
