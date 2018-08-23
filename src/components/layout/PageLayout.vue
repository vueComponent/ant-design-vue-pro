<template>
    <div :style="!$route.meta.hideHeader ? 'margin: -24px -24px 0px;' : null">
        <!-- pageHeader , route meta hideHeader:true on hide -->
        <page-header v-if="!$route.meta.hideHeader" :title="title" :logo="logo" :avatar="avatar">
            <slot slot="action" name="action"></slot>
            <slot slot="content" name="headerContent"></slot>
            <div slot="content" v-if="!this.$slots.headerContent && desc">
                <p style="font-size: 14px;line-height: 1.5;color: rgba(0,0,0,.65)">{{ desc }}</p>
                <div class="link">
                    <template  v-for="(link, index) in linkList">
                        <a :key="index" :href="link.href">
                          <a-icon :type="link.icon" />{{ link.title }}
                        </a>
                    </template>
                </div>
            </div>
            <slot slot="extra" name="extra"></slot>
        </page-header>
        <div ref="content" class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
  import PageHeader from './PageHeader'

  export default {
    name: "LayoutContent",
    components: {
      PageHeader
    },
    props: ['desc', 'logo', 'title', 'avatar', 'linkList', 'extraImage'],
  }
</script>

<style scoped>
    .content {
        margin: 24px 24px 0;
    }
</style>