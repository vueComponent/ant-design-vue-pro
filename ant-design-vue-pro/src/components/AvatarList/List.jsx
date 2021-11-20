import './index.less'

import PropTypes from 'ant-design-vue/es/_util/vue-types'
import Avatar from 'ant-design-vue/es/avatar'
import Item from './Item.jsx'
import { filterEmpty } from '@/components/_util/util'

/**
 * size: `number`、 `large`、`small`、`default` 默认值: default
 * maxLength: number
 * excessItemsStyle: CSSProperties
 */
const AvatarListProps = {
  prefixCls: PropTypes.string.def('ant-pro-avatar-list'),
  size: {
    validator: val => {
      return typeof val === 'number' || ['small', 'large', 'default'].includes(val)
    },
    default: 'default'
  },
  maxLength: PropTypes.number.def(0),
  excessItemsStyle: PropTypes.object.def({
    color: '#f56a00',
    backgroundColor: '#fde3cf'
  })
}

const AvatarList = {
  __ANT_AVATAR_LIST: true,
  Item,
  name: 'AvatarList',
  props: AvatarListProps,
  render (h) {
    const { prefixCls, size } = this.$props
    const className = {
      [`${prefixCls}`]: true,
      [`${size}`]: true
    }

    const items = filterEmpty(this.$slots.default)
    const itemsDom = items && items.length ? <ul class={`${prefixCls}-items`}>{this.getItems(items)}</ul> : null
    return (
      <div class={className}>
        {itemsDom}
      </div>
    )
  },
  methods: {
    getItems (items) {
      const className = {
        [`${this.prefixCls}-item`]: true,
        [`${this.size}`]: true
      }
      const totalSize = items.length

      if (this.maxLength > 0) {
        items = items.slice(0, this.maxLength)
        items.push((<Avatar size={this.size === 'mini' ? 'small' : this.size} style={this.excessItemsStyle}>{`+${totalSize - this.maxLength}`}</Avatar>))
      }
      return items.map((item) => (
        <li class={className}>{item}</li>
      ))
    }
  }
}

AvatarList.install = function (Vue) {
  Vue.component(AvatarList.name, AvatarList)
  Vue.component(AvatarList.Item.name, AvatarList.Item)
}

export default AvatarList
