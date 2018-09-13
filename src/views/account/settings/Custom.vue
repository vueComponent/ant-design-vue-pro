<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title" href="https://vuecomponent.github.io/ant-design-vue/">{{ item.title }}</a>
        <span slot="description">
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ item.value }}</span>
        </span>
      </a-list-item-meta>
      <template v-if="item.actions">
        <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
      </template>

    </a-list-item>
  </a-list>
</template>

<script>
  export default {
    name: "Security",
    data () {
      return {
        theme: 'dark',

        data: [
          { title: '主题色' , description: '设置全局主题色', value: this.theme, actions: { title: '修改', callback: () => { this.$message.info('This is a normal message'); } } },
        ]
      }
    },
    filters: {
      themeFilter(theme) {
        const themeMap = {
          'dark': '暗色',
          'light': '白色'
        }
        return themeMap[theme]
      }
    },
    methods: {
      onChange (checked) {
        if (checked) {
          this.theme = 'dark'
        } else {
          this.theme = 'light'
        }
      }
    }
  }
</script>

<style scoped>

</style>