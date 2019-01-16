<script>
  export default {
    name: 'RouteView',
    data () {
      return {}
    },
    render () {
      const { $route: { meta } } = this

      const inKeep = (
        <keep-alive>
          <router-view />
        </keep-alive>
      )
      const notKeep = (
        <router-view />
      )
      return meta.keepAlive ? inKeep : notKeep
    }
  }
</script>