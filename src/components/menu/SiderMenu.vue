<template>
    <a-layout-sider :class="['sider', isMobile ? null : 'shadow', theme ]" width="256px" :collapsible="collapsible" v-model="collapsed" :trigger="null">
        <div class="logo">
            <router-link :to="{name:'dashboard'}">
                <img src="~@/assets/logo.svg" alt="logo">
                <h1>Ant Design Pro</h1>
            </router-link>
        </div>
        <s-menu :collapsed="collapsed" :menu="menus" :theme="theme" @select="onSelect" :mode="mode" style="padding: 16px 0px;"></s-menu>
    </a-layout-sider>
</template>

<script>
    import ALayoutSider from "ant-design-vue/es/layout/Sider"
    import SMenu from './index'
    export default {
        name: "SiderMenu",
        components: { ALayoutSider, SMenu },
        props: {
            mode: {
              type: String,
              required: false,
              default: 'inline'
            },
            theme: {
              type: String,
              required: false,
              default: 'dark'
            },
            collapsible: {
                type: Boolean,
                required: false,
                default: false
            },
            collapsed: {
                type: Boolean,
                required: false,
                default: false
            },
            menus: {
                type: Array,
                required: true
            }
        },
        created() {

        },
        computed: {
            isMobile () {
                return this.$store.state.app.device !== 'desktop'
            }
        },
        methods: {
            onSelect(obj) {
                this.$emit('menuSelect', obj)
            }
        }
    }
</script>