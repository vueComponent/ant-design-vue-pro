<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    locale () {
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  },
  mounted () {
    this.test()
  },
  methods: {
    test () {
      console.log('this', this)
    }
  }
}
</script>
