/**
 * 添加事件监听器
 * @param  {Object} target DOM对象
 * @param  {String} eventType 事件名
 * @param  {Funtion} callback 回调函数
 * @return {Object} 返回对象
 */
module.exports = function addEventListener(target, eventType, callback) {
  if (target) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  }
};
