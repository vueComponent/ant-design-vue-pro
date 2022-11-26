<template>
  <section :class="{'preview': !all, 'all': all}">
    <code class="language-html">
       <slot name="body"></slot>
    </code>
    <div class="show" @click="() => all = !all">{{ msg }}</div>
  </section>
</template>

<script>
export default {
  data: function () {
    return {
      all: false
    }
  },
  computed: {
    msg () {
      return !this.all ? 'unfold' : 'fold'
    }
  }
}
</script>

<style lang="css" scoped>
section code.language-html {
  padding: 10px 20px;
  margin: 10px 0px;
  display: block;
  background-color: #333;
  color: #fff;
  overflow-x: auto;
  font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo, Lucida, Sans, Type, Writer, Ubuntu, Mono;
  border-radius: 5px;
  white-space: pre;
}

.preview {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.all{
  position: relative;
}

.show {
  position: absolute;
  width: 100%;
  text-align: center;
  left: 0;
  bottom: 0;
  line-height: 50px;
  height: 50px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
}
</style>
