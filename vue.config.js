// vue.config.js
module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1DA57A',
          'link-color': '#1DA57A',
          'border-radius-base': '2px',
        },
        javascriptEnabled: true,
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://www.easy-mock.com/mock/5b7bce071f130e5b7fe8cd7d/antd-pro',
        ws: true,
        changeOrigin: true
      },
      '/gateway': {
        target: 'https://www.easy-mock.com/mock/5b7bce071f130e5b7fe8cd7d/antd-pro',
        changeOrigin: true,
        pathRewrite: {
          '^/gateway': '/api'
        }
      }
    }
  }
}