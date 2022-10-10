const path = require('path')
const webpack = require('webpack')
const packageJson = require('./package.json')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// check Git
function getGitHash () {
  try {
    return GitRevision.version()
  } catch (e) {}
  return 'unknown'
}
// eslint-disable-next-line no-unused-vars
const isProd = process.env.NODE_ENV === 'production'
// eslint-disable-next-line no-unused-vars
const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.5.1/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin({
        contextRegExp: /^\.\/locale$/,
        resourceRegExp: /moment$/
      }),
      new webpack.DefinePlugin({
        APP_VERSION: `"${packageJson.version}"`,
        GIT_HASH: JSON.stringify(getGitHash()),
        BUILD_DATE: buildDate
      })
    ]
    // en_US: `if prod, add externals`
    // zh_CN: `这里是用来控制编译忽略外部依赖的，与 config.plugin('html') 配合可以编译时引入外部CDN文件依赖`
    // externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))

    // fixed svg-loader by https://github.com/damianstasik/vue-svg-loader/issues/185#issuecomment-1126721069
		const svgRule = config.module.rule('svg')
		// Remove regular svg config from root rules list
		config.module.rules.delete('svg')

		config.module.rule('svg')
			// Use svg component rule
			.oneOf('svg_as_component')
				.resourceQuery(/inline/)
				.test(/\.(svg)(\?.*)?$/)
				.use('babel-loader')
					.loader('babel-loader')
					.end()
				.use('vue-svg-loader')
					.loader('vue-svg-loader')
					.options({
						svgo: {
							plugins: [
								{ prefixIds: true },
								{ cleanupIDs: true },
								{ convertShapeToPath: false },
								{ convertStyleToAttrs: true }
							]
						}
					})
					.end()
				.end()
			// Otherwise use original svg rule
			.oneOf('svg_as_regular')
				.merge(svgRule.toConfig())
				.end()

    // en_US: If prod is on assets require on cdn
    // zh_CN: 如果是 prod 模式，则引入 CDN 依赖文件，有需要减少包大小请自行解除依赖
    //
    // if (isProd) {
    //   config.plugin('html').tap(args => {
    //     args[0].cdn = assetsCDN
    //     return args
    //   })
    // }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8000
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    // proxy: {
    //   '/api': {
    //     target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
    //     ws: false,
    //     changeOrigin: true
    //   }
    // }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
