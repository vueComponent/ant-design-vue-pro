import Base from './Base'
import isQueriesEqual from './isQueriesEqual'

const kErrMsg = '<vue-Container-query> can only render' +
  ' one, and exactly one child component'

export const ContainerQuery = {
  name: 'vue-container-query',
  mixins: [Base],
  model: { event: 'change' },
  props: {
    initialSize: {
      type: Object
    },
    query: {
      required: true,
      type: Object
    }
  },
  methods: {
    handleChange (params) {
      this.$emit('change', params)
    }
  },
  watch: {
    query: {
      deep: true,
      immediate: true,
      handler (newVal, oldVal) {
        if (this.cqCore && !isQueriesEqual(oldVal, newVal)) {
          this.disposeObserver()
          this.startObserving(newVal)
        }
      }
    }
  },
  render () {
    const slot = this.$slots.default
    if (slot && slot.length === 1) {
      return slot[0]
    }

    throw new Error(kErrMsg)
  }
}

export function createContainerQueryMixin (query, initialSize) {
  return {
    mixins: [Base],
    data () {
      return { query, initialSize, containerQuery: {} }
    },
    methods: {
      handleChange (params) {
        this.containerQuery = params
      }
    }
  }
}
