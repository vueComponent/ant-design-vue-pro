import { shallowMount } from '@vue/test-utils'
import { createContainerQueryMixin } from '../../src'

const query = {
  mobile: {maxWidth: 399},
  desktop: {minWidth: 400}
}
const initialSize = { width: 300 }

const template = '<pre class="app">{ containerQuery }</pre>'

describe('createContainerQueryMixin', () => {
  it('renders without initialSize', () => {
    const wrapper = shallowMount({
      template,
      mixins: [
        createContainerQueryMixin(query)
      ]
    })

    expect(wrapper.vm.containerQuery).toEqual({})
    expect(wrapper.is('pre.app')).toBe(true)
  })

  it('renders with initialSize', () => {
    const wrapper = shallowMount({
      template,
      mixins: [
        createContainerQueryMixin(query, initialSize)
      ]
    })

    expect(wrapper.vm.containerQuery.mobile).toBe(true)
    expect(wrapper.vm.containerQuery.desktop).toBe(false)
    expect(wrapper.is('pre.app')).toBe(true)
  })
})
