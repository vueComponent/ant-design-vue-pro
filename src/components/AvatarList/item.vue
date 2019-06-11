<template>
  <a-tooltip :title="tips">
    <a-avatar :size="size" :src="src" :style="!src && excessItemsStyle">
      <slot></slot>
    </a-avatar>
  </a-tooltip>
</template>

<script>
export default {
  name: "AvatarListItem",
  props: {
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
      size: this.$parent.size,
      excessItemsStyle: this.$parent.excessItemsStyle
    };
  },
  watch: {
    "$parent.size"(val) {
      this.size = val;
    },
    "$parent.excessItemsStyle"(val) {
      this.excessItemsStyle = val;
    }
  }
};
</script>
