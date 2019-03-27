import { Tag } from 'ant-design-vue'
const { CheckableTag } = Tag

export default {
  name: 'TagSelectOption',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-tag-select-option'
    },
    value: {
      type: [String, Number, Object],
      default: ''
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localChecked: this.checked || false
    }
  },
  watch: {
    '$parent.checkAll' (val) {
      this.localChecked = val
    }
  },
  render () {
    const { $slots, value } = this
    const onChange = (checked) => {
      this.$emit('change', { value, checked })
    }
    return (<CheckableTag key={value} vModel={this.localChecked} onChange={onChange}>
      {$slots.default}
    </CheckableTag>)
  }
}
