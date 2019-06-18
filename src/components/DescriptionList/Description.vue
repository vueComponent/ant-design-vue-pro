<template>
  <ACol v-bind="columnConfig">
    <div v-if="term || $slots.term" :class="genCls('term')">
      <slot name="term">{{ term }}</slot>
    </div>
    <div :class="genCls('detail')"><slot></slot></div>
  </ACol>
</template>

<script>
import PropTypes from "ant-design-vue/lib/_util/vue-types";
import responsive from "./responsive";
import { Col } from "ant-design-vue";
import { useBEM } from "@/utils/bem";
const prefixCls = "antd-vue-components__description-list";
const genCls = useBEM(prefixCls);

export default {
  name: "Description",
  components: {
    ACol: Col
  },
  props: {
    term: PropTypes.string.def("")
  },
  computed: {
    columnConfig() {
      const { column } = this.$parent.$attrs;
      return responsive[column];
    }
  },
  methods: {
    genCls
  }
};
</script>

<style lang="less" src="./index.less"></style>
