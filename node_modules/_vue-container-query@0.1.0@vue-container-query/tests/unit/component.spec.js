import { mount } from '@vue/test-utils'
import { ContainerQuery } from '../../src'

const ContainerQueryApp = {
  components: { ContainerQuery },
  props: {
    query: Object,
    initialSize: Object
  },
  data () {
    return { params: {} }
  },
  template: `
<container-query :query="query" :initialSize="initialSize" v-model="params">
  <pre class="app">{{ params }}</pre>
</container-query>
`
}

describe('ContainerQuery', () => {
  const query = {
    mobile: {maxWidth: 399},
    desktop: {minWidth: 400}
  }

  const initialSize = { width: 300 }

  it('renders without initialSize', () => {
    const wrapper = mount(ContainerQueryApp, {
      propsData: { query }
    })

    expect(wrapper.vm.params).toEqual({})
    expect(wrapper.is('pre.app')).toBe(true)
  })

  it('renders with initialSize', () => {
    const wrapper = mount(ContainerQueryApp, {
      propsData: { query, initialSize }
    })

    expect(wrapper.vm.params.mobile).toBe(true)
    expect(wrapper.vm.params.desktop).toBe(false)
    expect(wrapper.is('pre.app')).toBe(true)
  })
})
