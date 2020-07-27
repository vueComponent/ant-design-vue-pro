import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { Tooltip, Avatar } from 'ant-design-vue'
import { getSlotOptions } from 'ant-design-vue/lib/_util/props-util'
import { warning } from 'ant-design-vue/lib/vc-util/warning'

export const AvatarListItemProps = {
  tips: PropTypes.string.def(null),
  src: PropTypes.string.def('')
}

const Item = {
  __ANT_AVATAR_CHILDREN: true,
  name: 'AvatarListItem',
  props: AvatarListItemProps,
  created () {
    warning(getSlotOptions(this.$parent).__ANT_AVATAR_LIST, 'AvatarListItem must be a subcomponent of AvatarList')
  },
  render () {
    const AvatarDom = <Avatar size={this.$parent.size} src={this.src} />
    return this.tips && <Tooltip title={this.tips}>{AvatarDom}</Tooltip> || <AvatarDom />
  }
}

export default Item
