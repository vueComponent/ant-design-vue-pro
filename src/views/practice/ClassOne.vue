<template>
  <div v-if="Math.random() > 0.5">Now you see me</div>
  <div v-else>Now you don't</div>
</template>

<script>
const items = [{ message: 'Foo' }, { message: 'Bar' }]
export default {
  data () {
    // data functions should return an object
    return {
      items
    }
  },
  created: function () {
    // `this` 指向 vm 实例
    console.log('items is: ' + JSON.stringify(this.items))
  }
}
</script>
