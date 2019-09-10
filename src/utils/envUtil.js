/**
 * 判断当前是否为dev环境或预览模式
 * @return {boolean}
 */
function isDevOrPreview () {
  return process.env.NODE_ENV === 'development' || process.env.VUE_APP_PREVIEW === 'true'
}

/**
 * 判断当前是否为生产环境
 * @return {boolean}
 */
function isProd () {
  return process.env.NODE_ENV === 'production' || process.env.VUE_APP_PREVIEW !== 'true'
}

module.exports = {
  isDevOrPreview, isProd
}
