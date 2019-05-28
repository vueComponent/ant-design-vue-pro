<template>
  <span>{{ lastTime }}</span>
</template>

<script>
export default {
  props: ["target", "onEnd"],
  data() {
    return {
      lastTime: this.initTime(),
      timer: null
    };
  },
  methods: {
    fixedZero(val) {
      return val * 1 < 10 ? `0${val}` : val;
    },
    initTime() {
      let lastTime = 0;
      let targetTime = 0;
      try {
        if (Object.prototype.toString.call(this.target) === "[object Date]") {
          targetTime = this.target.getTime();
        } else {
          targetTime = new Date(this.target).getTime();
        }
      } catch (e) {
        throw new Error("invalid target prop", e);
      }
      lastTime = targetTime - new Date().getTime();
      return lastTime < 0 ? 0 : lastTime;
    }
  }
};
</script>

<style></style>
