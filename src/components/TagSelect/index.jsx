import PropTypes from 'ant-design-vue/es/_util/vue-types'
// TODO 
export default {
  name: 'TagSelect',
  props: {
    defaultValue: {
      type: [PropTypes.arrayOf(String), PropTypes.arrayOf(Number)],
      default: () => {}
    },
    expandable: {
      type: Boolean,
      default: false
    },
    hideCheckAll: {
      type: Boolean,
      default: false
    }
  }
}
