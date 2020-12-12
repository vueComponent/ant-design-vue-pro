<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
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
computed: {
    data () {
        return [
        { title: this.$t('account.settings.security.password'), description: this.$t('account.settings.security.password-description'), value: '强', actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.$message.info('This is a normal message') } } },
        { title: this.$t('account.settings.security.phone'), description: this.$t('account.settings.security.phone-description'), value: '138****8293', actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.$message.success('This is a message of success') } } },
        { title: this.$t('account.settings.security.question'), description: this.$t('account.settings.security.question-description'), value: '', actions: { title: this.$t('account.settings.security.set'), callback: () => { this.$message.error('This is a message of error') } } },
        { title: this.$t('account.settings.security.email'), description: this.$t('account.settings.security.email-description'), value: 'ant***sign.com', actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.$message.warning('This is message of warning') } } },
        { title: this.$t('account.settings.security.mfa'), description: this.$t('account.settings.security.mfa-description'), value: '', actions: { title: this.$t('account.settings.security.bind'), callback: () => { this.$message.info('This is a normal message') } } }
      ]
    }
  }
}
</script>

<style scoped>

</style>
