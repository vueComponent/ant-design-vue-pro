<template>
  <span>{{ realTime }}</span>
</template>

<script>
export default {
  props: {
    target: null,
    onEnd: Function,
    format: Function
  },
  data() {
    return {
      lastTime: this.initTime(),
      timer: null
    };
  },
  mounted() {
    this.tick();
  },
  computed: {
    realTime() {
      const format = this.format ? this.format : this.defaultFormat;
      return format(this.lastTime);
    }
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
    },
    tick() {
      const interval = 1000;
      this.timer = setTimeout(() => {
        if (this.lastTime < interval) {
          clearTimeout(this.timer);
          this.lastTime = 0;
          if (this.onEnd) {
            this.onEnd();
          }
        } else {
          this.lastTime -= interval;
          this.tick();
        }
      }, interval);
    },
    defaultFormat(time) {
      const hours = 60 * 60 * 1000;
      const minutes = 60 * 1000;

      const h = Math.floor(time / hours);
      const m = Math.floor((time - h * hours) / minutes);
      const s = Math.floor((time - h * hours - m * minutes) / 1000);

      return `${this.fixedZero(h)}:${this.fixedZero(m)}:${this.fixedZero(s)}`;
    }
  }
};
</script>

<style></style>
