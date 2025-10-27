<template>
  <a-descriptions :title="title" :column="column" v-if="showContainer">
    <template v-for="(item, index) in filteredItems">
      <a-descriptions-item :label="item.label" :key="index">
        <slot v-if="item.slotName" :name="item.slotName" :value="getValue(item)"></slot>
        <template v-else>
          {{ formatValue(item) }}
        </template>
      </a-descriptions-item>
    </template>
  </a-descriptions>
</template>

<script>
export default {
  name: "DescriptionCard",
  props: {
    title: {
      type: String,
      default: "设备规格",
    },
    column: {
      type: [Number, Object],  // 允许 Number 或 Object
      default: 2,
    },
    dataSource: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
      validator: (value) =>
        value.every((item) => 
          item.label && 
          item.key && 
          (item.formatter === undefined || typeof item.formatter === 'function')
        ),
    },
    autoHide: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    showContainer() {
      if (!this.autoHide) return true;
      return this.dataSource && Object.keys(this.dataSource).length > 0;
    },
    filteredItems() {
      return this.items.filter((item) => {
        const value = this.dataSource[item.key];
        return value !== undefined && value !== null && value !== "";
      });
    },
  },
  methods: {
    getValue(item) {
      return this.dataSource[item.key];
    },
    formatValue(item) {
      const value = this.dataSource[item.key];
      return value;
    },
  },
};
</script>
