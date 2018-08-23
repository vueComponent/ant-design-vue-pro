<template>
    <page-layout :desc="desc" :title="getTitle" :link-list="linkList">
        <div slot="extra" class="extra-img">
            <img :src="extraImage"/>
        </div>
        <!-- keep-alive  -->
        <route-view></route-view>
    </page-layout>
</template>

<script>
  import PageLayout from './PageLayout'
  import RouteView from './RouteView'

  export default {
    name: "PageContent",
    components: {
      RouteView,
      PageLayout
    },
    data () {
      return {
        title: '',
        desc: '',
        linkList: [],
        extraImage: ''
      }
    },
    mounted () {
      this.getPageHeaderInfo()
    },
    updated () {
      this.getPageHeaderInfo()
    },
    computed: {

      getTitle () {
        return this.$route.meta.title
      }

    },
    methods: {
      getPageHeaderInfo () {
        // eslint-disable-next-line
        console.log('route title:', this.$route.meta.title)

        this.title = this.$route.meta.title
        const content = this.$refs.content
        if (content) {
          this.desc = content.desc
          this.linkList = content.linkList
          this.extraImage = content.extraImage
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
    .extra-img{
        margin-top: -60px;
        text-align: center;
        width: 195px;

        img{
            width: 100%;
        }
    }
</style>