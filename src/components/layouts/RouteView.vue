<script>
export default {
  name: 'RouteView',
  data () {
    return {}
  },
  render () {
    const { $store: { getters }, aliveIgnore } = this
    const inKeep = (
      <keep-alive exclude={aliveIgnore}>
        <router-view />
      </keep-alive>
    )
    const notKeep = (
      <router-view />
    )
    // 这里增加了 multiTab 的判断，当开启了 multiTab 时
    // 应当全部组件皆缓存，否则会导致切换页面后页面还原成原始状态
    // 若确实不需要，可改为 return meta.keepAlive ? inKeep : notKeep
    return getters.multiTab ? inKeep : notKeep
  },
  methods: {
    // 获取keepAlive为false的路由名称组成数组
    get_ignore_route_name (routes) {
      return routes.reduce((all, cur) => {
        if (cur.meta && Object.is(cur.meta.keepAlive, false)) {
          all.push(cur.name)
        }
        if (cur.children) {
          all.push(...this.get_ignore_route_name(cur.children))
        }
        return all
      }, [])
    }
  },
  computed: {
    aliveIgnore () {
      return this.get_ignore_route_name(this.$store.getters.addRouters)
    }
  }
}
</script>
