<template>
  <a-drawer title="网络配置" :visible="visible" @close="onClose" width="900px">
    <div style="margin-bottom: 10px">
      <h4>网卡信息:</h4>
      <div v-for="item in eths" :key="item.name">
        {{ item.name }} | {{ item.ip }} | {{ item.speed }} | {{ item.speedMax }} |
        {{ item.statusName }}
      </div>
    </div>

    <!-- 批量解析区域 -->
    <div class="batch-parse">
      <h4>批量解析:</h4>
      <a-textarea
        :rows="4"
        placeholder="一条一行，字段间使用空格分隔"
        v-model="batchText"
      />
      <a-button type="primary" @click="handleBatchParse">批量解析</a-button>
    </div>
    <!--增加下拉菜单按eths集合选择管理网-->
    <div v-if="supportPreDialTset.managerEth" class="batch-parse">
      <a-form-model-item label="选择管理网">
        <a-select v-model="managerEth" style="width: 100%" placeholder="选择管理网">
          <a-select-option v-for="nic in eths" :key="nic.name" :value="nic.name">
            {{ nic.name }}
            <span v-if="nic.ip"> ({{ nic.ip }})</span>
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </div>
    <!-- 配置表格 -->
    <a-table
      :columns="columns"
      :dataSource="lineAccounts"
      :rowKey="(record, index) => index"
      size="small"
      :pagination="false"
    >
      <template
        v-for="col in editableColumns"
        :slot="col"
        slot-scope="text, record, index"
      >
        <template v-if="col === 'vlanId'">
          <a-input
            style="width: 100%"
            :value="text"
            @change="(e) => handleChange(e, index, col)"
          />
        </template>

        <template v-else-if="col === 'eth'">
          <a-select
            :value="text"
            @change="(e) => handleChange(e, index, col)"
            style="width: 100%"
          >
            <a-select-option v-for="nic in eths" :key="nic.name" :value="nic.name">
              {{ nic.name }}
              <span v-if="nic.ip"> ({{ nic.ip }})</span>
            </a-select-option>
          </a-select>
        </template>
        <template v-else-if="col === 'dialStatus'">
          <span v-if="text === 'SUCCESS'" style="font-weight: 600; color: #00b350">
            {{ record.statusName }}
          </span>
          <span v-else-if="text === undefined" style="color: dimgray">--</span>
          <span v-else style="color: red"> {{ record.statusName }}</span>
        </template>
        <template v-else-if="col === 'speed'">
          <div
            v-if="record.actualBwReach === true"
            style="color: #00b900; font-size: 12px"
          >
            <div>达标</div>
            <div>{{ record.bandwidth + "M / " + record.actualBw + "M" }}</div>
            <div>
              {{
                record.actualBwPercentage + "% > " + record.bandwidthPressureRate + "%"
              }}
            </div>
          </div>
          <div
            v-else-if="record.actualBwReach === false"
            style="color: #ff0000; font-size: 12px"
          >
            <div>不达标</div>
            <div>{{ record.bandwidth + "M / " + record.actualBw + "M" }}</div>
            <div>
              {{ record.actualBwPercentage + "%>" + record.bandwidthPressureRate + "%" }}
            </div>
          </div>
          <div v-else>--</div>
        </template>
        <template v-else-if="col === 'packetLoss'">
          <div
            v-if="record.packetLossReach === true"
            style="color: #00b900; font-size: 12px"
          >
            <div>达标</div>
            <div>
              {{ record.packetLoss.toFixed(2) + "<=" + record.packetLossRate + "%" }}
            </div>
          </div>
          <div
            v-else-if="record.packetLossReach === false"
            style="color: #ff0000; font-size: 12px"
          >
            <div>不达标</div>
            <div>
              {{ record.packetLoss.toFixed(2) + "<=" + record.packetLossRate + "%" }}
            </div>
          </div>
          <div v-else>--</div>
        </template>
        <template v-else>
          <a-input
            :value="text"
            @change="(e) => handleChange(e.target.value, index, col)"
          />
        </template>
      </template>

      <template slot="operation" slot-scope="text, record, index">
        <a @click="handleDelete(index)"><a-icon type="delete" /></a>
      </template>
    </a-table>

    <a-button type="dashed" @click="handleAdd" style="width: 100%; margin-top: 10px">
      添加一条
    </a-button>
    <div style="height: 50px"></div>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button :style="{ marginRight: '8px' }" @click="getLineAccount" :loading="syncLineLoading">
        同步信息
      </a-button>
      <a-button
        v-if="supportPreDialTset.dialTset"
        :style="{ marginRight: '8px' }"
        :loading="dialTestLoading"
        @click="onDialTest"
      >
        {{ dialTestLoading ? '拨号中...' : '拨号测试'}}
      </a-button>
      <a-button
        v-if="supportPreDialTset.networkTset"
        :style="{ marginRight: '8px' }"
        :loading="netTsetStatus === 'RUNNING'"
        @click="startNetworkPressure"
      >
        {{ netTsetStatus === 'RUNNING' ? '正在测速' : '网络测速'}}
      </a-button>
      <a-button :style="{ marginRight: '8px' }" @click="onClose"> 取消 </a-button>
      <a-button @click="handleOk" type="primary" :loading="submitLoading">确定上机</a-button>
    </div>
  </a-drawer>
</template>

<script>
import {
  SupportPreDialTset,
  DialSubmit,
  DialTest,
  SendBeforeBindNetworkPressure,
  GetNetworkPressure,
} from "@/api/node/list";
import { SaveLine, GetLineAccount } from "@/api/line";
export default {
  name: "NetworkConfigDrawer",
  props: {
    visible: Boolean,
    id: {
      type: Number,
      default: 0,
    },
    dialMode: {
      type: String,
      default: "SERVER_DIAL",
    },
    eths: {
      // 网卡信息格式: [{name: 'eth0', mac: 'bc24:11:ee:b9:e0', bandwidth: '-1Mbps'}, ...]
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      // dialMode: "SERVER_DIAL",
      batchText: "",
      defaultConfig: {
        pppoe: { vlanId: "", username: "", password: "", eth: "" },
        staticNet: { vlanId: "", ip: "", mask: "", gateway: "", eth: "" },
        dhcp: { vlanId: "", eth: "" },
      },
      // 保存线路账号信息集合
      lineAccounts: [],
      // 保存是否支持上机前拨号测试和网络压测对象
      supportPreDialTset: {},
      managerEth: undefined,
      // 网络压测状态
      netTsetStatus: "",
      // 是否要保存线路账号信息
      isSaveLineAccount: false,
      timer: null, // 使用 null 初始化定时器
      // 拨测加载中
      dialTestLoading: false,
      // 同步线路信息加载中
      syncLineLoading: false,
      // 保存线路信息加载中
      submitLoading: false,
    };
  },

  computed: {
    columns() {
      // 使用if
      if (this.dialMode === "SERVER_DIAL") {
        return [
            {
              title: "vlanId",
              dataIndex: "vlanId",
              scopedSlots: { customRender: "vlanId" },
              width: "70px",
            },
            {
              title: "拨号账号",
              dataIndex: "username",
              scopedSlots: { customRender: "username" },
              width: "140px",
            },
            {
              title: "拨号密码",
              dataIndex: "password",
              scopedSlots: { customRender: "password" },
              width: "100px",
            },
            {
              title: "网卡名称",
              dataIndex: "eth",
              scopedSlots: { customRender: "eth" },
              width: "90px",
            },
            {
              title: "拨号状态",
              dataIndex: "dialStatus",
              scopedSlots: { customRender: "dialStatus" },
              width: "80px",
            },
            {
              title: "测速速率/M",
              dataIndex: "speed",
              scopedSlots: { customRender: "speed" },
            },
            {
              title: "丢包率%",
              dataIndex: "packetLoss",
              scopedSlots: { customRender: "packetLoss" },
            },
            {
              title: "操作",
              scopedSlots: { customRender: "operation" },
              width: "50px",
            },
          ]
      } else if (this.dialMode === "STATIC_NET") {
        return [
            {
              title: "vlanId",
              dataIndex: "vlanId",
              scopedSlots: { customRender: "vlanId" },
              width: "70px",
            },
            {
              title: "IP地址",
              dataIndex: "ip",
              scopedSlots: { customRender: "ip" },
              width: "140px",
            },
            {
              title: "子网掩码",
              dataIndex: "mask",
              scopedSlots: { customRender: "mask" },
              width: "120px",
            },
            {
              title: "网关",
              dataIndex: "gateway",
              scopedSlots: { customRender: "gateway" },
              width: "120px",
            },
            {
              title: "网卡名称",
              dataIndex: "eth",
              scopedSlots: { customRender: "eth" },
              width: "90px",
            },
            {
              title: "拨号状态",
              dataIndex: "dialStatus",
              scopedSlots: { customRender: "dialStatus" },
              width: "80px",
            },
            {
              title: "测速速率/M",
              dataIndex: "speed",
              scopedSlots: { customRender: "speed" },
            },
            {
              title: "丢包率%",
              dataIndex: "packetLoss",
              scopedSlots: { customRender: "packetLoss" },
            },
            {
              title: "操作",
              scopedSlots: { customRender: "operation" },
              width: "50px",
            },
          ]
      } else {
        return [
            {
              title: "vlanId",
              dataIndex: "vlanId",
              scopedSlots: { customRender: "vlanId" },
              width: "70px",
            },
            {
              title: "网卡名称",
              dataIndex: "eth",
              scopedSlots: { customRender: "eth" },
            },
            {
              title: "拨号状态",
              dataIndex: "dialStatus",
              scopedSlots: { customRender: "dialStatus" },
              width: "80px",
            },
            {
              title: "测速速率/M",
              dataIndex: "speed",
              scopedSlots: { customRender: "speed" },
            },
            {
              title: "丢包率%",
              dataIndex: "packetLoss",
              scopedSlots: { customRender: "packetLoss" },
            },
            {
              title: "操作",
              scopedSlots: { customRender: "operation" },
              width: "50px",
            },
        ]
      }
    },

    editableColumns() {
      console.log(this.columns)
      return this.columns.slice(0, -1).map((col) => col.dataIndex);
    },
    // 添加正确的连接类型计算属性
    connectionType() {
      if (this.dialMode === "SERVER_DIAL") {
        return "PPPoE";
      } else if (this.dialMode === "STATIC_NET") {
        return "staticNet";
      } else if (this.dialMode === "DHCP") {
        return "dhcp";
      }
      return null
    },
  },

  methods: {
    // 表单数据修改
    handleChange(value, index, column) {
      // 获取input框的值
      console.log("handleChange", value)
      // this.lineAccounts = this.lineAccounts.map((item, i) =>i === index ? { ...item, [column]: value } : item);不支持input
      console.log("handleChange", value, index, column)
      this.lineAccounts = this.lineAccounts.map((item, i) =>

        i === index ? { ...item, [column]: value } : item
      );
      // 添加保存线路账号信息标记
      this.isSaveLineAccount = true;
    },
    // 添加
    handleAdd() {
      this.lineAccounts.push({ ...this.defaultConfig[this.connectionType] });
      // 添加保存线路账号信息标记
      this.isSaveLineAccount = true;
    },
    // 删除
    handleDelete(index) {
      this.lineAccounts = this.lineAccounts.filter((_, i) => i !== index);
      // 添加保存线路账号信息标记
      this.isSaveLineAccount = true;
    },
    // 批量解析
    handleBatchParse() {
      const lines = this.batchText.split("\n").filter((l) => l.trim());
      const isDialup = this.dialMode === "SERVER_DIAL";

      this.lineAccounts = lines.map((line) => {
        const parts = line.split(/\s+/);
        const defaultNic = this.eths[0]?.name || "";
        if(this.dialMode === "SERVER_DIAL"){
          return {
            vlanId: parts[0] || 0,
            username: parts[1] || "",
            password: parts[2] || "",
            eth: parts[3] || defaultNic,
          };
        }else if(this.dialMode === "STATIC_NET"){ 
          return {
            vlanId: parts[0] || 0,
            ip: parts[1] || "",
            mask: parts[2] || "",
            gateway: parts[3] || "",
            eth: parts[4] || defaultNic,
          };
        }else {
          return {
            vlanId: parts[0] || 0,
            eth: parts[4] || defaultNic,
          };
        }
      });
      // 添加保存线路账号信息标记
      this.isSaveLineAccount = true;
    },

    onClose() {
      this.$emit("close");
    },

    async handleOk() {
      if (this.supportPreDialTset.managerEth) {
        if (this.managerEth === undefined || this.managerEth.length === 0) {
          // 提示错误
          this.$message.error("请选择管理网卡！");
          return;
        }
      }

      // 判断拨号账号集合是否为空
      if (this.lineAccounts.length === 0) {
        this.$message.error("线路信息不能为空！");
        return;
      }
      this.submitLoading = true;
      // 如果有修改先保存线路信息
      //if (this.isSaveLineAccount) {
      const saveResult = await this.lineSave();
      if (!saveResult.success) {
        this.$message.error(saveResult.message);
        return;
      }
      //}

      // 提交数据
      const res = await DialSubmit(this.id);
      if (res.code === 0) {
        this.$message.success("操作成功");
        // 关闭弹窗
        this.onClose()
        this.$emit("success");
      } else {
        this.$message.error(res.message);
      }
      this.submitLoading = false;
    },
    // 拨号测试
    async onDialTest() {
      if (this.lineAccounts.length === 0) {
        this.$message.error("请先添加拨号线路");
        return;
      }

      const loading = this.$message.loading("拨号测试中...", 0);
      this.dialTestLoading = true;
      // console.log("onDialTest：", JSON.stringify(this.lineAccounts));
      try {
        // 如果有修改先保存线路信息
        if (!this.isSaveLineAccount) {
          const saveResult = await this.lineSave();
          if (!saveResult.success) {
            this.$message.error(saveResult.message);
            return;
          }
        }

        const res = await DialTest(this.id);
        if (res.code === 0) {
          // 创建新的数组确保响应性
          const newLineAccounts = [...this.lineAccounts];
          newLineAccounts.forEach((item) => {
            if (this.dialMode === "SERVER_DIAL") {
              const find = res.result.find((i) => i.username === item.username);
              if (find) {
                item.dialStatus = find.status;
                item.statusName = find.statusName;
              }
            } else {
              const find = res.result.find((i) => i.ip === item.ip);
              if (find) {
                item.dialStatus = find.status;
                item.statusName = find.statusName;
              }
            }
          });
          // 使用新数组替换旧数组
          this.lineAccounts = newLineAccounts;
          console.log("lineAccounts:", JSON.stringify(this.lineAccounts));
          this.$message.success("拨号测试完成");
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        this.$message.error("请求超时，请重试:" + e.message);
      } finally {
        this.dialTestLoading = false;
        loading();
      }
    },
    // 保存线路信息
    async lineSave() {
      if (!this.id) {
        return { success: false, message: "节点ID不能为空" };
      }

      try {
        const params = {
          id: this.id,
          managerEth: this.managerEth,
          details: this.lineAccounts,
        };

        const res = await SaveLine(params);
        if (res.code === 0) {
          this.isSaveLineAccount = false;
          return { success: true, message: "保存成功" };
        } else {
          return { success: false, message: res.message };
        }
      } catch (error) {
        return { success: false, message: "保存异常：" + error };
      }
    },
    // 添加重置表单方法
    resetForm() {
      this.dialMode = "SERVER_DIAL";
      this.lineAccounts = [];
      this.batchText = "";
    },
    // 获取是否支持上机前拨号测试和网络压测
    async getSupportPreDialTset() {
      const res = await SupportPreDialTset(this.id);
      if (res.code === 0 && res.result) {
        this.supportPreDialTset = res.result;
      }
    },
    // 获取线路账号信息
    async getLineAccount() {
      this.syncLineLoading = true;
      const res = await GetLineAccount(this.id);
      if (res.code === 0 && res.result) {
        // this.dialMode = res.result.type;
        this.lineAccounts = res.result.details;
      }
      this.syncLineLoading = false;
    },
    // 发起压测操作，设置压测状态为RUNNING
    async startNetworkPressure() {
      if (this.lineAccounts.length === 0) {
        this.$message.error("请先添加拨号线路");
        return;
      }
      const loading = this.$message.loading("网络测速中...", 0);
      try {
        const res = await SendBeforeBindNetworkPressure(this.id);
        if (res.code === 0) {
          this.netTsetStatus = "RUNNING";
          // 执行循环查询网络测速结果
          this.startTimer();
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        this.$message.error("请求超时，请重试:" + e.message);
      } finally {
        loading();
      }
    },
    // 启动定时器查询测速结果
    startTimer() {
      this.timer = setInterval(() => {
        this.queryDetectNetworkSpeed();
      }, 60000);
    },
    // 停止定时器（避免内存泄漏）
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    // 获取网络压测结果
    async queryDetectNetworkSpeed() {
      const res = await GetNetworkPressure(this.id);
      if (res.code === 0) {
        // 设置测速状态
        this.netTsetStatus = res.result.status;
        // 判断测速完成停止定时器
        if ("RUNNING" !== res.result.status) {
          // 清除定时器
          clearInterval(this.timer);
        }
        // 创建新的数组确保响应性
        const newLineAccounts = [...this.lineAccounts];
        newLineAccounts.forEach((item) => {
          if (this.dialMode === "SERVER_DIAL") {
            const find = res.result.detail.lines.find(
              (i) => i.username === item.username
            );
            if (find) {
              // 带宽压测标准值比例%
              item.bandwidthPressureRate = res.result.standard.bandwidthPressureRate;
              // 压测百分比
              item.actualBwPercentage = find.actualBwPercentage;
              // 带宽是否达标，返回布尔值
              item.actualBwReach = find.actualBwReach;
              // 建设带宽
              item.bandwidth = find.bandwidth;
              // 测速带宽
              item.actualBw = find.actualBw;
              // 丢包是否达标，返回布尔值
              item.packetLossReach = find.packetLossReach;
              // 丢包压测标准值比例%
              item.packetLossRate = res.result.standard.packetLossRate;
              // 丢包率
              item.packetLoss = find.packetLoss;
            }
          } else {
            const find = res.result.detail.lines.find((i) => i.ip === item.ip);
            if (find) {
              // 带宽压测标准值比例%
              item.bandwidthPressureRate = res.result.standard.bandwidthPressureRate;
              // 带宽是否达标，返回布尔值
              item.actualBwReach = find.actualBwReach;
              // 建设带宽
              item.bandwidth = find.bandwidth;
              // 测速带宽
              item.actualBw = find.actualBw;
              // 丢包是否达标，返回布尔值
              item.packetLossReach = find.packetLossReach;
              // 丢包压测标准值比例%
              item.packetLossRate = res.result.standard.packetLossRate;
              // 丢包率
              item.packetLoss = find.packetLoss;
            }
          }
        });
        // 使用新数组替换旧数组
        this.lineAccounts = newLineAccounts;
      } else {
        this.netTsetStatus = ''
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    },
  },

  watch: {
    // 监听visible变化，当对话框显示时回显数据
    visible(newVal) {
      if (newVal && this.id) {
        // this.getNetCard();
        this.getSupportPreDialTset();
        this.getLineAccount();

        console.log("回显数据：", JSON.stringify(this.lineAccounts));
        //this.dialMode = this.initialData.type;
        //this.lineAccounts = JSON.parse(JSON.stringify(this.initialData.configs));
        // 深拷贝配置列表，避免引用问题
        //this.lineAccounts = JSON.parse(JSON.stringify(this.initialData.data || []));
        // 清除批量解析文本
        this.batchText = "";
      } else {
        // 关闭对话框时重置数据
        this.resetForm();
      }
    },
    // 修正：监听dialMode变化而不是connectionType
    dialMode(newVal, oldVal) {
      // 当连接类型改变且已有配置时，清空配置列表
      if (newVal !== oldVal && this.lineAccounts.length > 0) {
        this.lineAccounts = [];
      }
    },
  },
  // 组件销毁时清除定时器（重要！）
  beforeDestroy() {
    this.stopTimer();
  },
};
</script>

<style scoped>
.batch-parse {
  margin-bottom: 20px;
}
.batch-parse >>> .ant-btn {
  margin-top: 10px;
}
</style>
