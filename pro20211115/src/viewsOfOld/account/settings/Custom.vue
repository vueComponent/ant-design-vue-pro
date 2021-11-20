<template>
  <a-list itemLayout="horizontal">
    <a-list-item>
      <a-list-item-meta>
        <template v-slot:title>
          <a>风格配色</a>
        </template>
        <template v-slot:description>
          <span>
            整体风格配色设置
          </span>
        </template>
      </a-list-item-meta>
      <template v-slot:actions>
        <a-switch checkedChildren="暗色" unCheckedChildren="白色" :defaultChecked="navTheme === 'dark' && true || false" @change="onChange" />
      </template>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template v-slot:title>
          <a>主题色</a>
        </template>
        <template v-slot:description>
          <span>
            页面风格配色： <a>{{ colorFilter(primaryColor) }}</a>
          </span>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>
<script>
import { colorList } from '@/components/SettingDrawer/settingConfig'
import { baseMixin } from '@/store/app-mixin'
import { NAV_THEME, TOGGLE_NAV_THEME } from '@/store/mutation-types'

const themeMap = {
  'dark': '暗色',
  'light': '白色'
}

export default {
  mixins: [baseMixin],
  data () {
    return {
    }
  },
  filters: {
    themeFilter (theme) {
      return themeMap[theme]
    }
  },
  methods: {
    colorFilter (color) {
      const c = colorList.find(o => o.color === color)
      return c && c.key
    },

    onChange (checked) {
      if (checked) {
        this.$store.commit(TOGGLE_NAV_THEME, NAV_THEME.DARK)
      } else {
        this.$store.commit(TOGGLE_NAV_THEME, NAV_THEME.LIGHT)
      }
    }
  }
}
</script>
