/* eslint-disable */
import { ROUTE_BINDING, TAB_BINDING } from './APIEnums'
import AppEvent from './events'
import RouteAPI from './RouteAPI'
import MultiTab from './MultiTab'
import RouteKeepAlive from './RouteKeepAlive'

const addAndGet = val => {
  return val >= Number.MAX_SAFE_INTEGER ? 0 : ++val
}

const RouteContent = {
  name: 'RouteContent',
  data () {
    return {
      includes: [],
      excludes: [],
      /*
       * Cache: { fullPath : String, snapshot : Number }
       * cached: Map
       */
      cached: {}
    }
  },
  render () {
    const {
      $route: { meta, fullPath },
      includes,
      excludes,
      cached
    } = this

    const handleRef = (ref) => {
      this.keepRef = ref
    }
    console.log('meta', this.$route);
    if (meta.keepAlive) {
      if (includes.findIndex(item => item === fullPath) === -1) {
        includes.push(fullPath)
        cached[fullPath] = {
          fullPath,
          snapshot: 0
        }
      }
    }
    const genKey = cached[fullPath].fullPath + cached[fullPath].snapshot
    const props = {
      on: {
        ref: handleRef
      }
    }
    return (
      <route-keep-alive {...props} include={includes} exclude={excludes}>
        <router-view key={genKey} />
      </route-keep-alive>
    )
  },
  created () {
    AppEvent.$on(ROUTE_BINDING.R_OPEN, ({ routeName, title, ...rest }) => {
      this.$router.push({ name: routeName, params: { '_tabName': title, ...rest } })
    }).$on(ROUTE_BINDING.R_REFRESH, keyPath => {
      const { $route: { fullPath } } = this
      let key = keyPath || fullPath
      const cache = this.cached[key]
      this.keepRef.clearCache(key)
      cache.snapshot = addAndGet(cache.snapshot)
      // how with
      this.$forceUpdate()
    }).$on(ROUTE_BINDING.R_GET_CACHES, (callback) => {
      callback(this.keepRef.allCache())
    }).$on(ROUTE_BINDING.R_CLOSE, val => {
      const { config: keyPath, isCache } = val
      AppEvent.$emit(TAB_BINDING.TAB_CLOSE, keyPath)
      // this.keepRef.clearCache(keyPath)
    })
  }
}

RouteContent.install = function (Vue) {
  if (Vue.prototype.$tab) {
    return
  }
  Vue.prototype.$tab = RouteAPI
  Vue.component(RouteContent.name, RouteContent)
  Vue.component(RouteKeepAlive.name, RouteKeepAlive)
  Vue.component(MultiTab.name, MultiTab)
}

export default RouteContent
