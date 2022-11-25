// @ts-ignore
import matchQueries from 'container-query-toolkit/lib/matchQueries'
import ContainerQueryCore from './ContainerQueryCore'

export default {
  methods: {
    handleChange () {
      throw new Error('Method `handleChange()` not implemented.')
    },

    disposeObserver () {
      if (this.cqCore) {
        this.cqCore.disconnect()
      }
      this.cqCore = null
    },

    startObserving (query) {
      this.cqCore = new ContainerQueryCore(query, params => {
        this.handleChange(params)
      })

      const element = (this.$el || this.$slots.default[0].elm)
      this.cqCore.observe(element)
    }
  },

  created () {
    const { query, initialSize } = this
    const params = initialSize
      ? matchQueries(query)(initialSize)
      : {}
    this.handleChange(params)
  },

  mounted () {
    this.startObserving(this.query)
  },

  destroyed () {
    this.disposeObserver()
  }
}
