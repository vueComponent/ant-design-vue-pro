<template>
  <a-tooltip :title="tips">
    <a-avatar :size="itemSize" :src="src" :style="excessItemsStyle">
      <slot></slot>
    </a-avatar>
  </a-tooltip>
</template>

<script>
export default {
  name: "AvatarListItem",
  props: {
    size: {
      type: [String, Number],
      default: ""
    },
    tips: {
      type: String,
      default: ""
    },
    src: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      itemSize: this.size || this.$parent.size || "default",
      excessItemsStyle: this.$parent.excessItemsStyle || null
    };
  },
  watch: {
    "$parent.size"(val) {
      this.itemSize = val;
    },
    "$parent.excessItemsStyle"(val) {
      this.excessItemsStyle = val;
    }
  }
};
</script>
