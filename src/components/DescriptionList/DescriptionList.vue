<template>
  <div :class="genCls([layout, size])">
    <div v-if="title || $slots.title" :class="genCls('title')">
      <slot name="title">{{ title }}</slot>
    </div>
    <ARow :gutter="gutter" :column="column">
      <slot></slot>
    </ARow>
  </div>
</template>

<script>
import PropTypes from "ant-design-vue/lib/_util/vue-types";
import { Row } from "ant-design-vue";
import { useBEM } from "@/utils/bem";
const prefixCls = "antd-vue-components__description-list";
const genCls = useBEM(prefixCls);
export default {
  name: "description-list",
  components: {
    ARow: Row
  },
  props: {
    title: PropTypes.string,
    col: PropTypes.number.def(3),
    layout: PropTypes.string.def("horizontal"),
    gutter: PropTypes.number.def(32),
    size: PropTypes.string.def("")
  },
  computed: {
    clsString() {
      return `${prefixCls} ${genCls([this.layout, this.size])}`;
    },
    column() {
      return this.col > 4 ? 4 : this.col;
    }
  },
  methods: {
    genCls
  }
};
</script>

<style lang="less" src="./index.less"></style>
