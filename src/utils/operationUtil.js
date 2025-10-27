/**
 * 运算类，避免数据相加小数点后产生多位数和计算精度损失。
 */
/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 * @param {*} num1 加数1
 * @param {*} num2 加数2
 * @returns
 */
export function add (arg1, arg2) {
  arg1 = arg1.toString()
  arg2 = arg2.toString()// 将传入的数据转化为字符串
  var arg1Arr = arg1.split('.')
  var arg2Arr = arg2.split('.')
  var d1 = arg1Arr.length === 2 ? arg1Arr[1] : '' // 获取第一个数的小数点的长度
  var d2 = arg2Arr.length === 2 ? arg2Arr[1] : '' // 获取第二个数的小数点的长度
  var maxLen = Math.max(d1.length, d2.length) // 获取小数点长度较大的值
  var m = Math.pow(10, maxLen) // 这里表示10的小数点长度次方 也就是说如果小数点长度为2 m的值就是100 如果小数点长度是3 m的值就是1000如果不懂请自行查找api
  var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen)) // 将小数转化为整数后相加在除掉两个数乘过的倍数然后去小数点较长的长度的小数位数
  var d = arguments[2] // 第三个参数用户可以自行决定是否要传递 用来定义要保留的小数长度
  return typeof d === 'number' ? Number((result).toFixed(d)) : result
};

/**
 * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
 * @param {*} num1 被减数
 * @param {*} num2 减数
 * @returns
 */
export function sub (num1, num2) {
  var baseNum, baseNum1, baseNum2
  var precision// 精度
  try {
    baseNum1 = num1.toString().split('.')[1].length
  } catch (e) {
    baseNum1 = 0
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length
  } catch (e) {
    baseNum2 = 0
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
  precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision)
}

/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 * @param {*} num1 被乘数
 * @param {*} num2 乘数
 * @returns
 */
export function multi (num1, num2) {
  var baseNum = 0
  try {
    baseNum += num1.toString().split('.')[1].length
  } catch (e) {
  }
  try {
    baseNum += num2.toString().split('.')[1].length
  } catch (e) {
  }
  return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum)
}
/**
 * 除法
 * @param {*} arg1 除数
 * @param {*} arg2 被除数
 * @param {*} digital 保留的小数点后的位数
 * @returns
 */
 export function div (arg1, arg2, digital  = 2) {
  let t1 = 0
  let t2 = 0
  let r1
  let r2
  t1 = arg1.toString().split('.')[1] ? arg1.toString().split('.')[1].length : 0
  t2 = arg2.toString().split('.')[1] ? arg2.toString().split('.')[1].length : 0
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return ((r1 / r2) * Math.pow(10, t2 - t1)).toFixed(digital)
}
