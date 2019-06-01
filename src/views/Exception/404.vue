<template>
  <exception :model="model"></exception>
</template>

<script>
import Exception from "./Exception";

export default {
  components: {
    Exception
  },
  data() {
    return {
      model: {
        src:
          "https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg",
        title: "404",
        desc: "抱歉，你访问的页面不存在"
      }
    };
  }
};
</script>

<style></style>
