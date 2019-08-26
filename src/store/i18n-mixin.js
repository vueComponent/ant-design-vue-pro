import { mapState } from 'vuex'

const mixin = {
  computed: {
    ...mapState({
      currentLang: state => state.app.lang
    })
  },
  methods: {
    setLang (lang) {
      this.$store.dispatch('SetLang', lang)
    }
  }
}

export { mixin }
