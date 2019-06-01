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
          "https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg",
        title: "500",
        desc: "抱歉，服务器出错了"
      }
    };
  }
};
</script>

<style></style>
