<script>
import events from './events'

export default {
  name: 'MultiTab',
  data () {
    return {
      allPathMap: {},
      pathList: [],
      pages: [],
      activeKey: '',
      activePath: '', // tab选中的path
      newTabIndex: 0
    }
  },
  created () {
    // bind event
    events.$on('open', val => {
      if (!val) {
        throw new Error(`multi-tab: open tab ${val} err`)
      }
      this.activeKey = val
    }).$on('close', val => {
      if (!val) {
        this.closeThat(this.activeKey)
        return
      }
      this.closeThat(val)
    }).$on('rename', ({ key, name }) => {
      console.log('rename', key, name)
      try {
        const item = this.pages.find(item => item.path === key)
        item.meta.customTitle = name
        this.$forceUpdate()
      } catch (e) {
      }
    })

    this.pages.push(this.$route)
    this.pathList.push(this.$route.path)
    this.addAllPath(this.$route.path, this.$route.fullPath)
    this.selectedLastPath()
  },
  methods: {
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    remove (targetKey) {
      this.pages = this.pages.filter(page => page.fullPath !== targetKey)
      this.pathList = this.pathList.filter(path => path !== targetKey)
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.pathList.includes(this.activeKey)) {
        this.selectedLastPath()
      }
    },
    selectedLastPath () {
      this.activeKey = this.pathList[this.pathList.length - 1]
    },
    // 加入tab key与path的map
    addAllPath (key, path) {
      this.allPathMap[key] = path
    },
    // 该路由path属于那个tab
    findTabKey (path) {
      let tabKey = ''
      for (const key in this.allPathMap) {
        if (this.allPathMap[key] === path) {
          tabKey = key
        }
      }
      console.log('findTabKey:' + tabKey)
      return tabKey
    },
    // 该tab最后存储的path
    findTabPath (key) {
      let tabPath = ''
      tabPath = this.allPathMap[key]
      console.log('findTabPath:' + tabPath)
      return tabPath
    },
    // content menu
    closeThat (e) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.pathList.length > 1) {
        this.remove(e)
      } else {
        this.$message.info('这是最后一个标签了, 无法被关闭')
      }
    },
    closeLeft (e) {
      const currentIndex = this.pathList.indexOf(e)
      if (currentIndex > 0) {
        this.pathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('左侧没有标签')
      }
    },
    closeRight (e) {
      const currentIndex = this.pathList.indexOf(e)
      if (currentIndex < (this.pathList.length - 1)) {
        this.pathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('右侧没有标签')
      }
    },
    closeAll (e) {
      const currentIndex = this.pathList.indexOf(e)
      this.pathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item)
        }
      })
    },
    closeMenuClick (key, route) {
      this[key](route)
    },
    renderTabPaneMenu (e) {
      return (
        <a-menu {...{ on: { click: ({ key, item, domEvent }) => { this.closeMenuClick(key, e) } } }}>
          <a-menu-item key="closeThat">关闭当前标签</a-menu-item>
          <a-menu-item key="closeRight">关闭右侧</a-menu-item>
          <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
          <a-menu-item key="closeAll">关闭全部</a-menu-item>
        </a-menu>
      )
    },
    // render
    renderTabPane (title, keyPath) {
      const menu = this.renderTabPaneMenu(keyPath)

      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span style={{ userSelect: 'none' }}>{ title }</span>
        </a-dropdown>
      )
    }
  },
  watch: {
    '$route': function (newVal) {
      this.activePath = newVal.fullPath
      this.addAllPath(newVal.path, newVal.fullPath)
      if (this.pathList.indexOf(newVal.path) < 0) {
        this.pathList.push(newVal.path)
        this.pages.push(newVal)
      }
    },
    activeKey: function (newPathKey) {
      const lastPath = this.findTabPath(newTabKey)
      this.$router.push({ path: lastPath })
    },
    activePath: function (newPathKey) {
      this.$router.push({ path: newPathKey })
      this.activeKey = this.findTabKey(newPathKey)
    }
  },
  render () {
    const { onEdit, $data: { pages } } = this
    const panes = pages.map(page => {
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(page.meta.customTitle || page.meta.title, page.fullPath)}
          key={page.fullPath} closable={pages.length > 1}
        >
        </a-tab-pane>)
    })

    return (
      <div class="ant-pro-multi-tab">
        <div class="ant-pro-multi-tab-wrapper">
          <a-tabs
            hideAdd
            type={'editable-card'}
            v-model={this.activeKey}
            tabBarStyle={{ background: '#FFF', margin: 0, paddingLeft: '16px', paddingTop: '1px' }}
            {...{ on: { edit: onEdit } }}>
            {panes}
          </a-tabs>
        </div>
      </div>
    )
  }
}
</script>
