<template>
  <a-modal
    title="网络配置"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    width="900px"
  >
    <div style="margin-bottom: 10px;">
      <div v-for="item in nicList" :key="item.name">
      {{ item.name }}
      </div>
    </div>
    <!-- 连网方式选择 -->
    <a-select v-model="dialMode" style="width: 200px; margin-bottom: 20px">
      <a-select-option value="SERVER_DIAL">服务器拨号汇聚</a-select-option>
      <a-select-option value="STATIC_NET">服务器专线汇聚</a-select-option>
    </a-select>

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

    <!-- 配置表格 -->
    <a-table
      :columns="columns"
      :dataSource="configList"
      size="small"
      :pagination="false"
    >
      <template
        v-for="col in editableColumns"
        :slot="col"
        slot-scope="text, record, index"
      >
        <template v-if="col === 'vlanId'">
          <a-input-number
            :min="0"
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
            <a-select-option v-for="nic in nicList" :key="nic.name" :value="nic.name">
              {{ nic.name }} ({{ nic.mac }})
            </a-select-option>
          </a-select>
        </template>

        <template v-else>
          <a-input
            :value="text"
            @change="(e) => handleChange(e.target.value, index, col)"
          />
        </template>
      </template>

      <template slot="operation" slot-scope="text, record, index">
        <a-button type="danger" @click="handleDelete(index)">删除</a-button>
      </template>
    </a-table>

    <a-button type="dashed" @click="handleAdd" style="width: 100%; margin-top: 10px">
      添加一条
    </a-button>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    nicList: {
      // 网卡信息格式: [{name: 'eth0', mac: 'bc24:11:ee:b9:e0', bandwidth: '-1Mbps'}, ...]
      type: Array,
      default: () => [],
    },
    // 新增initialData属性用于接收回显数据
    initialData: {
      type: Object,
      default: () => null,
    }
  },

  data() {
    return {
      dialMode: "SERVER_DIAL",
      batchText: "",
      configList: [],
      defaultConfig: {
        dialup: { vlanId: "", username: "", password: "", bandwidth: "", eth: "" },
        dedicated: { vlanId: '', ip: "", mask: "", gateway: "", bandwidth: "", eth: "" },
      },
    };
  },

  computed: {
    columns() {
      return this.dialMode === "SERVER_DIAL"
        ? [
            {
              title: "VLAN_ID",
              dataIndex: "vlanId",
              scopedSlots: { customRender: "vlanId" },
            },
            {
              title: "拨号账号",
              dataIndex: "username",
              scopedSlots: { customRender: "username" },
            },
            {
              title: "拨号密码",
              dataIndex: "password",
              scopedSlots: { customRender: "password" },
            },
            {
              title: "带宽",
              dataIndex: "bandwidth",
              scopedSlots: { customRender: "bandwidth" },
            },
            { title: "网卡名称", dataIndex: "eth", scopedSlots: { customRender: "eth" } },
            { title: "操作", scopedSlots: { customRender: "operation" } },
          ]
        : [
            {
              title: "VLAN_ID",
              dataIndex: "vlanId",
              scopedSlots: { customRender: "vlanId" },
            },
            { title: "IP地址", dataIndex: "ip", scopedSlots: { customRender: "ip" } },
            {
              title: "子网掩码",
              dataIndex: "mask",
              scopedSlots: { customRender: "mask" },
            },
            {
              title: "网关",
              dataIndex: "gateway",
              scopedSlots: { customRender: "gateway" },
            },
            {
              title: "带宽",
              dataIndex: "bandwidth",
              scopedSlots: { customRender: "bandwidth" },
            },
            { title: "网卡名称", dataIndex: "eth", scopedSlots: { customRender: "eth" } },
            { title: "操作", scopedSlots: { customRender: "operation" } },
          ];
    },

    editableColumns() {
      return this.columns.slice(0, -1).map((col) => col.dataIndex);
    },
    // 添加正确的连接类型计算属性
    connectionType() {
      return this.dialMode === "SERVER_DIAL" ? "dialup" : "dedicated";
    }
  },

  methods: {
    handleChange(value, index, column) {
      this.configList = this.configList.map((item, i) =>
        i === index ? { ...item, [column]: value } : item
      );
    },

    handleAdd() {
      this.configList.push({ ...this.defaultConfig[this.connectionType] });
    },

    handleDelete(index) {
      this.configList = this.configList.filter((_, i) => i !== index);
    },

    handleBatchParse() {
      const lines = this.batchText.split("\n").filter((l) => l.trim());
      const isDialup = this.dialMode === "SERVER_DIAL";

      this.configList = lines.map((line) => {
        const parts = line.split(/\s+/);
        const defaultNic = this.nicList[0]?.name || "";

        return isDialup
          ? {
              vlanId: parseInt(parts[0]) || 0,
              username: parts[1] || "",
              password: parts[2] || "",
              bandwidth: parts[3] || "",
              eth: parts[4] || defaultNic,
            }
          : {
              vlanId: parseInt(parts[0]) || 0,
              ip: parts[1] || "",
              mask: parts[2] || "",
              gateway: parts[3] || "",
              bandwidth: parts[4] || "",
              eth: parts[5] || defaultNic,
            };
      });
    },

    handleCancel() {
      this.$emit("cancel");
    },

    handleOk() {
      const result = {
        dialMode: this.dialMode,
        configs: this.configList,
      };
      this.$emit("submit", result);
      this.handleCancel();
    },
    // 添加重置表单方法
    resetForm() {
      this.dialMode = "SERVER_DIAL";
      this.configList = [];
      this.batchText = "";
    },
  },

  watch: {
    // 监听visible变化，当对话框显示时回显数据
    visible(newVal) {
      if (newVal && this.initialData) {
        console.log("回显数据：", JSON.stringify(his.initialData));
        this.dialMode = this.initialData.type;
        // this.configList = JSON.parse(JSON.stringify(this.initialData.configs));
        // 深拷贝配置列表，避免引用问题
        this.configList = JSON.parse(JSON.stringify(this.initialData.data || []));
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
      if (newVal !== oldVal && this.configList.length > 0) {
        this.configList = [];
      }
    }
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
