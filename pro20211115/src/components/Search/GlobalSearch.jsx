import { Select } from 'ant-design-vue'
import './index.less'

const GlobalSearch = {
  name: 'GlobalSearch',
  data () {
    return {
      visible: false
    }
  },
  mounted () {
    const keyboardHandle = (e) => {
      e.preventDefault()
      e.stopPropagation()
      const { ctrlKey, shiftKey, altKey, keyCode } = e
      console.log('keyCode:', e.keyCode, e)
      // key is `K` and hold ctrl
      if (keyCode === 75 && ctrlKey && !shiftKey && !altKey) {
        this.visible = !this.visible
      }
    }
    document.addEventListener('keydown', keyboardHandle)
  },
  render () {
    const { visible } = this
    const handleSearch = (e) => {
      this.$emit('search', e)
    }

    const handleChange = (e) => {
      this.$emit('change', e)
    }
    if (!visible) {
      return null
    }
    return (
      <div class={'global-search global-search-wrapper'}>
        <div class={'global-search-box'}>
          <Select
            size={'large'}
            showSearch
            placeholder="Input search text.."
            style={{ width: '100%' }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
          >
          </Select>
          <div class={'global-search-tips'}>Open with Ctrl/⌘ + K</div>
        </div>
      </div>
    )
  }
}

GlobalSearch.install = function (Vue) {
  Vue.component(GlobalSearch.name, GlobalSearch)
}

export default GlobalSearch
