<template>
  <a-dropdown placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <span v-if="pending && pending.count === 0" @click="handle"><a-icon type="bell" /> 待处理: {{ pending ? pending.count : 0 }}</span>
      <span v-else @click="handle"><a-icon type="bell" :style="{ color: '#FF0000' }" /> 待处理: <span style="color:#FF0000;font-weight:bold;">{{ pending ? pending.count : 0 }}</span></span>
    </span>
  </a-dropdown>
</template>

<script>
// import { Modal } from 'ant-design-vue'

export default {
  name: 'PendingRemind',
  props: {
    pending: {
      type: Object,
      default: () => null
    }
  },
  methods: {
    handle () {
      this.$router.push({ path: '/dashboard/monitor' })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
