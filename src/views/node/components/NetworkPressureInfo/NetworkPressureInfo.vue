<template>
  <div>
    <!-- 压测时间行 -->
    <div style="color: #505050">
      最近压测时间：{{
        (networkPressureData !== null && networkPressureData.time) || "--"
      }}
      <a-divider type="vertical" />
      <span v-if="networkPressureData != null && networkPressureData.status">
        <span v-if="networkPressureData.status !== 'DONE'" style="color: #848484">
          压测中......
        </span>
      </span>
      <a-popconfirm
        title="请勿再高峰期压测影响收益，确定要执行线路压测？"
        ok-text="确定"
        cancel-text="取消"
        @confirm="$emit('pressure')"
      >
        <a>线路压测</a>
      </a-popconfirm>
    </div>
    <!-- 上报带宽行 -->
    <!--
    <div v-if="networkPressureData" style="margin-top: 20px; color: #505050">
      上报带宽：{{
        networkPressureData.usbw +
        "Mbps * " +
        networkPressureData.bwNum +
        " = " +
        networkPressureData.usbw * networkPressureData.bwNum +
        "Mbps"
      }}
    </div>
    -->
    <!-- 压测结论 -->
    <!--
    <div v-if="discontentLine > 0" style="margin: 10px 0">
      <span style="color: red">{{ discontentLine }} 条线路不满足</span>
      业务方要求已红色标记，请调整网络后重新压测
    </div>
    -->
    <!-- 总压测情况 -->
    <div v-if="networkPressureData != null && networkPressureData.detail">
      <div style="margin: 10px 0">总压测情况</div>
      <a-table
        :columns="summaryColumns"
        :data-source="[networkPressureData.detail]"
        :pagination="false"
      >
      </a-table>
    </div>

    <!-- 线路压测情况 -->
    <div v-if="networkPressureData != null && networkPressureData.detail.lines">
      <div style="margin: 10px 0">
        线路压测情况 
        <a-checkbox style="margin-left: 20px" v-model="isReach">
          仅展示不达标
        </a-checkbox>
        <span v-if="discontentLine > 0" style="margin-left: 10px" class="color-red">有 {{ discontentLine }} 条线路不达标</span>
      </div>
      <a-table :columns="lineColumns" :data-source="filteredLines" :pagination="false">
          <span slot="lineInfo" slot-scope="text, record">
            <div v-if="record.lineName">{{ record.lineName }}</div>
            <div v-if="record.ip">{{ record.ip }}</div>
            <div v-if="record.username">{{ record.username }}</div>
          </span>
          <span slot="actualBwPercentage" slot-scope="text, record">
            <span v-if="record.actualBwPercentage !== undefined" :class="record.actualBwReach ? 'color-green' : 'color-red'">{{ record.actualBwPercentage }}% {{ networkPressureData.standard.bandwidthPressureRateName }}%</span>
            <span v-else>--</span>
          </span>
          <span slot="packetLoss" slot-scope="text, record">
            <span v-if="record.packetLoss !== undefined" :class="record.packetLossReach ? 'color-green' : 'color-red'">{{ record.packetLoss }}% {{ networkPressureData.standard.packetLossRateName }}%</span>
            <span v-else>--</span>
          </span>
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    networkPressureData: {
      type: Object,
      default: () => null,
    },
  },

  data() {
    return {
      summaryColumns: [
        { title: "线路总数", dataIndex: "bwNum" },
        {
          title: "总带宽(Mbps)",
          dataIndex: "bandwidth",
        },
        {
          title: "压测带宽(Mbps)",
          dataIndex: "actualBw",
        },
        {
          title: "达标率(%)",
          dataIndex: "actualBwPercentage",
          customRender: (text) => (text !== undefined ? text + "%" : "--"),
        },
        {
          title: "丢包率(%)",
          dataIndex: "packetLoss",
          customRender: (text) => (text !== undefined ? text + "%" : "--"),
        },
        {
          title: "重传率(%)",
          dataIndex: "retransferRate",
          customRender: (text) => (text !== undefined ? text + "%" : "--"),
        },
        {
          title: "总带宽时RTT(ms)",
          dataIndex: "rtt",
          customRender: (text) => (text !== undefined ? text + "ms" : "--"),
        },
      ],
      lineColumns: [
        {
          title: "线路",
          dataIndex: "lineInfo",
          scopedSlots: { customRender: "lineInfo" },
        },
        {
          title: "带宽(Mbps)",
          dataIndex: "bandwidth",
        },
        {
          title: "压测带宽(Mbps)",
          dataIndex: "actualBw",
        },
        {
          title: "达标率(%)",
          dataIndex: "actualBwPercentage",
          scopedSlots: { customRender: "actualBwPercentage" },
        },
        {
          title: "丢包率(%)",
          dataIndex: "packetLoss",
          scopedSlots: { customRender: "packetLoss" },
        },
        {
          title: "重传率(%)",
          dataIndex: "retransferRate",
          customRender: (text) => (text !== undefined ? text + "%" : "--"),
        },
        {
          title: "总带宽时RTT(ms)",
          dataIndex: "rtt",
          customRender: (text) => (text !== undefined ? text + "ms" : "--"),
        },
      ],
      isReach: true
    };
  },
  computed: {
    //  计算不满足的线路数
    discontentLine() {
      if (this.networkPressureData == null) {
        return 0;
      }
      let count = 0;
      this.networkPressureData.detail.lines.forEach((line) => {
        if (!line.actualBwReach || !line.packetLossReach) {
          count++;
        }
      });
      return count;
    },
    // 通过选择仅展示不达标，过滤networkPressureData.detail.lines数据
    filteredLines() {
      if (this.networkPressureData == null) {
        return [];
      }
      return this.networkPressureData.detail.lines.filter((line) => {
        if (this.isReach) {
          // 不达标：任意一个指标未达标就保留
          return !line.actualBwReach || !line.packetLossReach;
        } else {
          // 返回全部包括不达标线路
          return true;
        }
      });
    }
  },
  methods: {
  },
  // 监听传入的数据是否有变化，有变化isReach设置true
  watch: {
    networkPressureData() {
      this.isReach = true;
    }
  }
};
</script>

<style scoped>
.color-red {
  color: red;
}

.color-green {
  color: green;
}
.details-row {
  margin: 12px 0;
  padding: 8px;
}

.details-row-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.details-row-content {
  color: rgba(0, 0, 0, 0.65);
}
</style>
