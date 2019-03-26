import PropTypes from 'ant-design-vue/es/_util/vue-types'
import TagSelectOption from './TagSelectOption.jsx'
import { filterEmpty } from '@/components/_util/util'

export default {
  name: 'TagSelect',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-tag-select'
    },
    defaultValue: {
      type: PropTypes.object,
      default: () => []
    ,
    value: {
      type: PropTypes.object,
      default: () => []
    ,
    expandable: {
      type: Boolean,
      default: false
    },
    hideCheckAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expand: false,
      val: this.value || this.defaultValue || []
    }
  },
  methods: {
    onChange () {

    },

    // render option
    renderTag ({ value, checked }) {
      const props = {
        checked: checked,
        value: value
      }
      return (
        <TagSelectOption {...{ props }} />
      )
    },
    renderTags (items) {
      return items.map(item => this.renderTag(item))
    }
  }
  },
  render () {
    const { $props: { prefixCls }, renderTags } = this
    const classString = {
      [`${prefixCls}`]: true
    }
    const tagItems = filterEmpty(this.$slots.default)
    const tagItemDom = (tagItems && tagItems.length > 0) && renderTags(tagItems) || null

    return (
      <div class={classString}>
        {tagItemDom}
      </div>
    )
  }
}
