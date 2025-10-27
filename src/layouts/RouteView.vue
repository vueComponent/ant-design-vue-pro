<script>
export default {
  name: 'RouteView',
  props: {
    keepAlive: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  render () {
    const { $route: { meta }, $store: { getters } } = this
    const inKeep = (
      <keep-alive>
        <router-view />
      </keep-alive>
    )
    const notKeep = (
      <router-view />
    )
    // alert(JSON.stringify(this.$route.query))
    // 这里增加了 multiTab 的判断，当开启了 multiTab 时
    // 应当全部组件皆缓存，否则会导致切换页面后页面还原成原始状态
    // 若确实不需要，可改为 return meta.keepAlive ? inKeep : notKeep
    if (!getters.multiTab && !meta.keepAlive) {
      return notKeep
    }
    // alert(this.keepAlive + '  ' + getters.multiTab + '  ' + meta.keepAlive)
    // if (this.$route.query.shuaxin && this.$route.query.shuaxin > -1) {
      // 每次点击选项都刷新
    //  return inKeep
   // } else {
      return this.keepAlive || getters.multiTab || meta.keepAlive ? inKeep : notKeep
   // }
  }
}
</script>
