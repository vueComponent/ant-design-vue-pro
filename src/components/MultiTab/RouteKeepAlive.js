const _toString = Object.prototype.toString

const isRegExp = (v) => {
  return _toString.call(v) === '[object RegExp]'
}

const isDef = (v) => {
  return v !== undefined && v !== null
}

const isAsyncPlaceholder = (node) => {
  return node.isComment && node.asyncFactory
}

const remove = (arr, item) => {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export const getFirstComponentChild = (children) => {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

export const getComponentName = (opts) => {
  return opts && (opts.Ctor.options.name || opts.tag)
}

export const getComponentKey = (opts) => {
  return opts && (opts.Ctor.cid + (opts.tag ? `::${opts.tag}` : ''))
}

export const getCurrentRouteKey = ($route) => {
  return $route.fullPath
}

const matches = (pattern, name) => {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

const pruneCache = (keepAliveInstance, cacheKey) => {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode = cache[key]
    if (cachedNode) {
      if (cacheKey === key) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

const pruneCacheEntry = (
  cache,
  key,
  keys,
  current
) => {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

/* const findCached = (cached, vnode) => {

} */

const RouteKeepAlive = {
  name: 'RouteKeepAlive',
  abstract: true,
  props: {
    include: {
      type: [String, Array],
      default: ''
    },
    exclude: {
      type: [String, Array],
      default: ''
    },
    max: {
      type: [String, Number],
      default: null
    }
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    this.$watch('include', val => {
      pruneCache(this, val)
    })
    this.$watch('exclude', val => {
      pruneCache(this, val)
    })
  },

  methods: {
    allCache () {
      return this.cache
    },
    clearCache (key) {
      pruneCache(this, key)
      this.$router.replace(this.$router.currentRoute)
    }
  },

  render () {
    this.$emit('ref', this)
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    // const vnode = cloneVNode(defVNode, true)
    const componentOptions = vnode && vnode.componentOptions

    const key = getCurrentRouteKey(this.$route)
    if (componentOptions) {
      // check pattern
      const { include, exclude } = this
      if (
        // not included
        (include && (!key || !matches(include, key))) ||
        // excluded
        (exclude && key && matches(exclude, key))
      ) {
        return vnode
      }

      const { cache, keys } = this
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        // vnode = cloneVNode(vnode, true)

        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}

RouteKeepAlive.install = function (Vue) {
  Vue.component(RouteKeepAlive.name, RouteKeepAlive)
}

export default RouteKeepAlive
