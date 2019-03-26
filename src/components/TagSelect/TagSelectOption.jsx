import { Tag } from 'ant-design-vue'
const { CheckableTag } = Tag

export default {
  name: 'TagSelectOption',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-tag-select-option'
    },
    defaultValue: {
      type: [String, Number, Object],
      required: true
    },
    value: {
      type: [String, Number, Object],
      required: true
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      val: this.value || this.defaultValue || null,
      localChecked: this.checked || false
    }
  },
  methods () {

  },
  render () {
    const { $slots, $props, val } = this
    const props = {
      ...$props
    }
    const onChange = (checked) => {
      this.localChecked = checked
      this.$emit('change', { val, checked })
    }
    return (<CheckableTag {...{ props }} onChange={onChange}>
      {$slots.default}
    </CheckableTag>)
  }
}
