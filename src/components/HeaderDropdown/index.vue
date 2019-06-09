<template>
  <a-dropdown :overlayClassName="cls" v-bind="$attrs" v-on="$listeners">
    <slot />
  </a-dropdown>
</template>

<script>
import _pickBy from "lodash/pickBy";
import _keys from "lodash/keys";

const prefixCls = "header-dropdown";
export default {
  name: "HeaderDropdown",
  props: {
    overlayClassName: String
  },
  computed: {
    cls() {
      return _keys(
        _pickBy(
          {
            [`${prefixCls}__container`]: true,
            [this.overlayClassName]: !!this.overlayClassName
          },
          n => n
        )
      ).join(" ");
    }
  }
};
</script>

<style lang="less" src="./index.less"></style>
