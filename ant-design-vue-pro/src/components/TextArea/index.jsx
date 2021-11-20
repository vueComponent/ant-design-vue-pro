import './style.less'
import { getStrFullLength, cutStrByFullLength } from '../_util/util'
import Input from 'ant-design-vue/es/input'
const TextArea = Input.TextArea

export default {
  name: 'LimitTextArea',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: Object.assign({}, TextArea.props, {
    prefixCls: {
      type: String,
      default: 'ant-textarea-limit'
    },
    // eslint-disable-next-line
    value: {
      type: String
    },
    limit: {
      type: Number,
      default: 200
    }
  }),
  data () {
    return {
      currentLimit: 0
    }
  },
  watch: {
    value (val) {
      this.calcLimitNum(val)
    }
  },
  created () {
    this.calcLimitNum(this.value)
  },
  methods: {
    handleChange (e) {
      const value = e.target.value
      const len = getStrFullLength(value)
      if (len <= this.limit) {
        this.currentLimit = len
        this.$emit('change', value)
        return
      } else {
        const str = cutStrByFullLength(value, this.limit)
        this.currentLimit = getStrFullLength(str)
        this.$emit('change', str)
      }
      console.error('limit out! currentLimit:', this.currentLimit)
    },
    calcLimitNum (val) {
      const len = getStrFullLength(val)
      this.currentLimit = len
    }
  },
  render () {
    const { prefixCls, ...props } = this.$props
    return (
      <div class={this.prefixCls}>
        <TextArea {...{ props }} value={this.value} onChange={this.handleChange}>
        </TextArea>
        <span class="limit">{this.currentLimit}/{this.limit}</span>
      </div>
    )
  }
}
