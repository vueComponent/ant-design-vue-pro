<template>
  <a-dropdown>
    <span class="action global-lang">
      <a-icon type="global" style="font-size: 16px" />
    </span>
    <a-menu slot="overlay" style="width: 150px;">
      <a-menu-item key="zhCN">
        <a rel="noopener noreferrer"><span role="img" aria-label="简体中文">🇨🇳</span>简体中文</a>
      </a-menu-item>
      <a-menu-item key="zhTW">
        <a rel="noopener noreferrer"><span role="img" aria-label="繁体中文">🇭🇰</span>繁体中文</a>
      </a-menu-item>
      <a-menu-item key="enUS">
        <a rel="noopener noreferrer"><span role="img" aria-label="English">🇬🇧</span>English</a>
      </a-menu-item>
      <a-menu-item key="Português">
        <a rel="noopener noreferrer"><span role="img" aria-label="Português">🇧🇷</span>Português</a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
export default {
    name: 'LangSelect',
    data () {
        return {}
    },
    methods: {

    }
}
</script>
