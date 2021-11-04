import { ROUTE_BINDING } from './APIEnums'
import AppEvent from './events'

const RouteAPI = {
  /**
   * Open a new tab(route)
   * 打开一个新标签(路由)
   *
   * @param config: {
   *   routeName,
   *   title
   * }
   */
  open (config) {
    AppEvent.$emit(ROUTE_BINDING.R_OPEN, config)
  },
  /**
   * Close a tab
   * 关闭一个打开的标签
   * 如果标签没打开或找不到标签则不做任何事情
   *
   * @param config
   * @param cache: bool  true 则关闭后会缓存页面，false 反之
   */
  close (config, cache) {
    AppEvent.$emit(ROUTE_BINDING.R_CLOSE, { config, isCache: cache })
  },
  /**
   * Active a opened tab
   * 激活一个已经打开的 tab
   * @param config
   */
  activeTab (config) {
    AppEvent.$emit(ROUTE_BINDING.R_ACTIVE, config)
  },
  /**
   * Replace current page to new Route
   * 替换当前 tab 页面为一个新的页面
   * 注意：这个替换会更新路由地址，但是 tab 的位置不会发生变化
   * 被替换的路由还会被缓存住，下次打开还是缓存时的状态
   *
   * @param {*} config
   */
  replace (config) {
    AppEvent.$emit('hook:replace', config)
  },
  /**
   * Refresh current tab (clear page cache)
   */
  refresh (keyPath) {
    AppEvent.$emit(ROUTE_BINDING.R_REFRESH, keyPath)
  },
  closeAll () {
    AppEvent.$emit('hook:closeAll')
  },
  closeOthers () {
    AppEvent.$emit('hook:closeOthers')
  },
  /**
   * Get all cached page
   *
   * @param callback
   */
  caches (callback) {
    AppEvent.$emit(ROUTE_BINDING.R_GET_CACHES, callback)
  }
}

export default RouteAPI
