<template>
  <div style="margin: -23px -24px 24px -24px">
    <a-tabs
      hideAdd
      v-model="activeKey"
      type="editable-card"
      :tabBarStyle="{ background: '#FFF', margin: 0, paddingLeft: '16px', paddingTop: '1px' }"
      @edit="onEdit"
    >
      <a-tab-pane v-for="page in pages" :style="{ height: 0 }" :tab="page.meta.title" :key="page.fullPath" :closable="pages.length > 1">
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  name: 'MultiTab',
  data () {
    return {
      fullPathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0
    }
  },
  created () {
    this.pages.push(this.$route)
    this.fullPathList.push(this.$route.fullPath)
  },
  methods: {
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    remove (targetKey) {
      if (this.pages.length === 1) {
        return
      }
      this.pages = this.pages.filter(page => page.fullPath !== targetKey)
      this.fullPathList = this.fullPathList.filter(path => path !== targetKey)
    }
  },
  watch: {
    '$route': function (newVal) {
      this.activeKey = newVal.fullPath
      if (this.fullPathList.indexOf(newVal.fullPath) < 0) {
        this.fullPathList.push(newVal.fullPath)
        this.pages.push(newVal)
      }
    },
    activeKey: function (newPathKey) {
      this.$router.push({ path: newPathKey })
    }
  }
}
</script>
