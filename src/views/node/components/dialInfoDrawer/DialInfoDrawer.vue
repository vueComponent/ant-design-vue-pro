<template>
  <a-drawer
    :width="1024"
    title="拨号信息"
    placement="right"
    :visible="open"
    :footerStyle="{ textAlign: 'right' }"
    @close="close"
  >
    <div slot="extra">
      <a @click="close" style="color: #3b3a3a; font-size: 22px; font-weight: 400">✕</a>
    </div>
    <a-spin :spinning="spinning">
      <a-card
        v-if="linesConvergeData && linesConvergeData.lineStat"
        style="text-align: center"
      >
        <a-row :gutter="16" style="font-weight: 700">
          <a-col :span="6" style="font-size: 18px">
            {{ linesConvergeData.lineStat.total }}
          </a-col>
          <a-col :span="6" style="color: #4cd964; font-size: 18px">
            <div>{{ linesConvergeData.lineStat.dialSucceedCount }}</div>
          </a-col>
          <a-col :span="6" style="color: #dd524d; font-size: 18px">
            <div>{{ linesConvergeData.lineStat.dialFailedCount }}</div>
          </a-col>
          <a-col :span="6" style="color: #007aff; font-size: 18px">
            <div>{{ linesConvergeData.lineStat.connectedCount }}</div>
          </a-col>
        </a-row>
        <a-row style="margin-top: 10px; color: #696969" :gutter="16">
          <a-col :span="6">
            <div>拨号</div>
          </a-col>
          <a-col :span="6">
            <div>已拨通</div>
          </a-col>
          <a-col :span="6">
            <div>未拨通</div>
          </a-col>
          <a-col :span="6">
            <div>已联网</div>
          </a-col>
        </a-row>
      </a-card>
      <a-table :dataSource="linesConvergeData && linesConvergeData.details" :pagination="false" size="middle">
        <a-table-column title="vlan_id" width="180">
          <template slot-scope="record">
            {{ record.vlanId }}
          </template>
        </a-table-column>
        <a-table-column title="拨号信息" width="280">
          <template slot-scope="record">
            <div v-if="record.username">账号：{{ record.username }}</div>
            <div v-if="record.password">密码：{{ record.password }}</div>
            <div v-if="!record.username && record.ip" class="info-item">
              IP: {{ record.ip }}
            </div>
            <div v-if="!record.username && record.mask" class="info-item">
              子网掩码: {{ record.mask }}
            </div>
            <div v-if="!record.username && record.gateway" class="info-item">
              网关: {{ record.gateway }}
            </div>
            <div class="info-item">网卡: {{ record.eth || "-" }}</div>
          </template>
        </a-table-column>
        <a-table-column title="拨号结果">
          <template slot-scope="record">
            <div>
              <span :class="getStatusClass(record.status)">{{
                getStatusText(record.status)
              }}</span>
              --
              <span :class="getConnectClass(record.connectStatus)">{{
                getConnectText(record.connectStatus)
              }}</span>
            </div>
            <div>IPv4：{{ record.ip }}</div>
            <div>IPv6：{{ record.ipv6 }}</div>
            <div v-if="record.ipv6Gateway" class="info-item">
              IPv6网关: {{ record.ipv6Gateway }}
            </div>
            <div v-if="record.upSpeed" class="status-item">
              上行速率:
              {{ record.upSpeed !== undefined ? `${record.upSpeed} Mbps` : "-" }}
            </div>
            <div v-if="record.downSpeed" class="status-item">
              下行速率:
              {{ record.downSpeed !== undefined ? `${record.downSpeed} Mbps` : "-" }}
            </div>
            <div v-if="record.tcpUpSpeedTest" class="status-item">
              上行测速:
              {{
                record.tcpUpSpeedTest !== undefined
                  ? `${record.tcpUpSpeedTest} Mbps`
                  : "-"
              }}
            </div>
            <div v-if="record.ipPacketLoss" class="status-item">
              IPv4丢包率:
              {{ record.ipPacketLoss !== undefined ? `${record.ipPacketLoss}%` : "-" }}
            </div>
            <div v-if="record.ipv6PacketLoss" class="status-item">
              IPv6丢包率:
              {{
                record.ipv6PacketLoss !== undefined ? `${record.ipv6PacketLoss}%` : "-"
              }}
            </div>
            <div v-if="record.icmpTimeDelay" class="status-item">
              ICMP时延: {{ record.icmpTimeDelay }} ms
            </div>
            <div v-if="record.isEthPublic" class="status-item">
              是否公网: {{ record.isEthPublic === 1 ? "公网" : "内网" }}
            </div>
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
    <div style="height: 50px"></div>
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
        <a :style="{ marginRight: '8px' }" @click="copyDialInfo">
          复制拨号信息
        </a>
        <a-button :style="{ marginRight: '8px' }" @click="getLinesConverge">
          刷新
        </a-button>
        <a-button type="primary" @click="handleModifyLineClick">
          调整线路
        </a-button>
      </div>
  </a-drawer>
</template>

<script>
import { GetLinesConverge } from "@/api/node/list";
import { copyToClipboard } from "@/utils/clipboardHelper";

export default {
  name: "DialInfoDrawer",
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      spinning: false,
      linesConvergeData: null,
    };
  },
  watch: {
    open(newVal) {
      if (newVal) {
        this.getLinesConverge();
      }
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },

    async copyDialInfo() {
      let res = "";
      if (this.linesConvergeData.details) {
        this.linesConvergeData.details.forEach((item) => {
          if (item.username) {
            res += `${item.vlanId} ${item.username} ${item.password} ${item.eth}\n`;
          } else {
            res += `${item.vlanId} ${item.ip} ${item.mask} ${item.gateway} ${item.eth}\n`;
          }
        });
        await this.copyInviteCode(res)
      } else {
        this.$message.error("没有数据");
      }
    },

    async getLinesConverge() {
      this.spinning = true;
      try {
        const { result } = await GetLinesConverge(this.id);
        this.linesConvergeData = result;
        // 打印
        console.log(this.linesConvergeData);
      } catch (error) {
        console.error("获取拨号信息失败:", error);
      } finally {
        this.spinning = false;
      }
    },

    getStatusText(status) {
      if (!status) return "未知";
      switch (status) {
        case 'SUCCEED': // SUCCEED
          return "已拨通";
        case 'FAILED': // FAILED
          return "未拨通";
        default:
          return "未知";
      }
    },

    getStatusClass(status) {
      if (!status) return "status-value";
      switch (status) {
        case 'SUCCEED': // SUCCEED
          return "status-value status-success";
        case 'FAILED': // FAILED
          return "status-value status-error";
        default:
          return "status-value status-unknown";
      }
    },

    getConnectText(status) {
      if (!status) return "未知";
      switch (status) {
        case 'SUCCEED': // SUCCEED
          return "已联网";
        case 'FAILED': // FAILED
          return "未联网";
        default:
          return "未知";
      }
    },

    getConnectClass(status) {
      if (!status) return "status-value";
      switch (status) {
        case 'SUCCEED': // SUCCEED
          return "status-value status-success";
        case 'FAILED': // FAILED
          return "status-value status-error";
        default:
          return "status-value status-unknown";
      }
    },
    /**
     * 复制邀请码
     * @param {*} text 邀请码
     */
     async copyInviteCode(text) {
      try {
        await copyToClipboard(text);
        this.$message.success("复制成功");
      } catch (error) {
        this.$message.error("复制失败！");
      }
    },
    // 调整线路
    handleModifyLineClick() {
      if (!this.linesConvergeData) {
        this.$message.error("没有数据");
        return;
      }
      // 调整线路
      this.$emit("modifyLineClick", this.id, this.linesConvergeData.dialMode);
    },
  },
};
</script>

<style scoped>
.info-item,
.status-item {
  margin-bottom: 8px;
  font-size: 12px;
  display: flex;
}

.status-value {
  font-weight: 500;
}

.status-success {
  color: #4cd964;
}

.status-error {
  color: #ff0800;
}

.status-unknown {
  color: #ff9800;
}
</style>
