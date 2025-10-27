/**
 * 时间工具类
 * @returns
 */

/**
 * 格式化时间
 * @param {*} timeStamp 时间戳
 * @returns 返回时间格式为yyyy-MM-dd hh:mm:ss
 */
export function timeStampToFormatDate (timeStamp) {
  var date = new Date()
  if (timeStamp.toString().length === 10) {
    date.setTime(timeStamp * 1000)
  } else if (timeStamp.toString().length === 13) {
    date.setTime(timeStamp)
  }
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  var minute = date.getMinutes()
  var second = date.getSeconds()
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}
