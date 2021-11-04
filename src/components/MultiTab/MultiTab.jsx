import AppEvent from './events'
import { TAB_BINDING } from './APIEnums'
import { Menu, Dropdown, Button, Icon, Tabs } from 'ant-design-vue'
// import { i18nRender } from '@/locales'
import './index.less'

const customStyle = {
  background: '#FFF',
  margin: 0,
  paddingLeft: '16px',
  paddingTop: '1px'
}

const i18nRender = (context) => context

const renderTabMenu = (h, path) => {
  const props = {
    on: {
      click: ({ key, item, domEvent }) => {
        // console.log('key', path)
      }
    }
  }
  return (
    <Menu {...props}>
      <Menu.Item key="closeThat">关闭当前标签</Menu.Item>
      <Menu.Item key="closeRight">关闭右侧</Menu.Item>
      <Menu.Item key="closeLeft">关闭左侧</Menu.Item>
      <Menu.Item key="closeAll">关闭全部</Menu.Item>
    </Menu>
  )
}

const renderTabDropDown = (h, title, keyPath, handles) => {
  const handleReload = () => {
    handles['reload'](keyPath)
  }

  const menus = renderTabMenu(h, keyPath)
  return (
    <Dropdown overlay={menus} trigger={['contextmenu']}>
      <span>
        <span class='ant-pro-multi-tab-title'>{ title }</span>
        <Icon title='reload page' class='ant-pro-multi-tab-icon' type={'reload'} onClick={handleReload} />
      </span>
    </Dropdown>
  )
}

const MultiTab = {
  name: 'MultiTab',
  props: {
    contentWidth: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeKey: '',
      pages: [],
      fullPathList: []
    }
  },
  render (h) {
    const { $data: { pages }, contentWidth } = this
    const handles = {
      cls: (keyPath) => {
        // console.log('close', keyPath)
        // this.closeThat(keyPath)
        this.$tab.close(keyPath, false)
      },
      reload: (keyPath) => {
        // console.log('reload', keyPath)
        this.$tab.refresh(keyPath)
      }
    }
    const tabPanels = pages.map(page => {
      const title = page.meta.customTitle || page.meta.title
      return (
        <Tabs.TabPane
          style={{ height: 0 }}
          key={page.fullPath}
          tab={renderTabDropDown(h, i18nRender(title), page.fullPath, handles)}
          closable={pages.length > 1}
        ></Tabs.TabPane>
      )
    })

    const edit = (targetKey, action) => {
      // console.log('editTab:', targetKey, 'action:', action)
      this[action](targetKey)
    }

    const handleMenuClick = (e) => {

    }

    const controlMenu = (<Dropdown slot="tabBarExtraContent" style={{ marginRight: '8px' }}>
      <Menu slot="overlay" onClick={handleMenuClick}>
        <Menu.Item key="1">全部关闭</Menu.Item>
        <Menu.Item key="2">关闭当前</Menu.Item>
        <Menu.Item key="3">关闭其他</Menu.Item>
      </Menu>
      <Button icon={'align-left'} type={'link'}><Icon type="down" /></Button>
    </Dropdown>)

    return (
      <div class={['ant-pro-multi-tab', contentWidth ? 'wide' : null]}>
        <div class={'ant-pro-multi-tab-wrapper'}>
          <Tabs
            hideAdd
            type={'editable-card'}
            vModel={this.activeKey}
            tabBarStyle={customStyle}
            onEdit={edit}
          >
            {tabPanels}
            {controlMenu}
          </Tabs>
        </div>
      </div>
    )
  },
  created () {
    const { pages, fullPathList } = this
    AppEvent.$on(TAB_BINDING.TAB_CLOSE, val => {
      this.closeThat(val)
    }).$on('hook:tab:closeRight', val => {
      // console.log('hook:tab:closeRight', val)
    }).$on('hook:tab:closeLeft', val => {
      // console.log('hook:tab:closeRight', val)
    }).$on('hook:tab:closeAll', val => {
      // console.log('hook:tab:closeRight', val)
    }).$on('hook:tab:rename', val => {
      // console.log('hook:tab:rename', val)
    })

    pages.push(this.$route)
    fullPathList.push(this.$route.fullPath)
    this.activeLastTab()

    this.$watch('$route', newVal => {
      const { fullPath, params } = newVal
      if (this.activeKey !== fullPath) {
        this.activeKey = fullPath
      }
      if (this.fullPathList.indexOf(fullPath) < 0) {
        this.fullPathList.push(fullPath)
        if (params && params._tabName) {
          const newPage = Object.assign({}, newVal, {
            meta: {
              customTitle: params._tabName
            }
          })
          this.pages.push(newPage)
        } else {
          this.pages.push(newVal)
        }
      }
    })
    this.$watch('activeKey', pathKey => {
      this.$router.push({ path: pathKey })
    })
  },
  methods: {
    activeLastTab () {
      this.activeKey = this.fullPathList[this.fullPathList.length - 1]
    },
    remove (targetKey) {
      this.closeThat(targetKey)
    },
    closeThat (targetKey) {
      if (this.fullPathList.length > 1) {
        this.pages = this.pages.filter(page => page.fullPath !== targetKey)
        this.fullPathList = this.fullPathList.filter(path => path !== targetKey)
        this.activeLastTab()
      }
    }
  }
}

export default MultiTab
