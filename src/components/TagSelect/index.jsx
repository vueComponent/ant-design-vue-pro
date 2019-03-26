import PropTypes from 'ant-design-vue/es/_util/vue-types'
import Option from './TagSelectOption.jsx'
import { filterEmpty } from '@/components/_util/util'

export default {
  Option,
  name: 'TagSelect',
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-tag-select'
    },
    defaultValue: {
      type: PropTypes.array,
      default: null
    },
    value: {
      type: PropTypes.array,
      default: null
    },
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
      checkAll: false,
      localCheckAll: false,
      items: [],
      val: this.value || this.defaultValue || []
    }
  },
  methods: {
    onChange (checked) {
      const key = Object.keys(this.items).filter(key => key === checked.value)
      this.items[key] = checked.checked
      // console.log(this.items)
      const bool = Object.values(this.items).lastIndexOf(false)
      console.log('bool', bool, 'this.checkAll', this.checkAll)
      if (bool === -1) {
        !this.checkAll && (this.checkAll = true)
      } else {
        this.checkAll && (this.checkAll = false)
        this.localCheckAll = false
      }
    },
    onCheckAll (checked) {
      this.checkAll = checked.checked
      // Object.keys(this.items)
      // this.items[k] = checked.checked
      Object.values(this.items).forEach(v => {
        v = checked.checked
      })
    },
    getItemsKey (items) {
      const totalItem = {}
      items.forEach(item => {
        totalItem[item.componentOptions.propsData && item.componentOptions.propsData.value] = false
      })
      return totalItem
    },
    // CheckAll Button
    renderCheckAll () {
      return !this.hideCheckAll && (<Option key={'total'} checked={this.localCheckAll} onChange={this.onCheckAll}>All</Option>) || null
    },
    // expandable
    renderExpandable () {

    },
    // render option
    renderTags (items) {
      const listeners = {
        change: (checked) => {
          this.onChange(checked)
          this.$emit('change', checked)
        }
      }

      return items.map(vnode => {
        const options = vnode.componentOptions
        options.listeners = listeners
        return vnode
      })
    }
  },
  render () {
    const { $props: { prefixCls } } = this
    const classString = {
      [`${prefixCls}`]: true
    }
    const tagItems = filterEmpty(this.$slots.default)
    this.items = this.getItemsKey(tagItems)
    console.log(this.items)
    return (
      <div class={classString}>
        {this.renderCheckAll()}
        {this.renderTags(tagItems)}
      </div>
    )
  }
}
