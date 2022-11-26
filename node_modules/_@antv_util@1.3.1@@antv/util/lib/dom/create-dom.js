/**
 * 创建DOM 节点
 * @param  {String} str Dom 字符串
 * @return {HTMLElement}  DOM 节点
 */
var TABLE = document.createElement('table');
var TABLE_TR = document.createElement('tr');
var FRAGMENT_REG = /^\s*<(\w+|!)[^>]*>/;
var CONTAINERS = {
  tr: document.createElement('tbody'),
  tbody: TABLE,
  thead: TABLE,
  tfoot: TABLE,
  td: TABLE_TR,
  th: TABLE_TR,
  '*': document.createElement('div')
};

module.exports = function createDom(str) {
  var name = FRAGMENT_REG.test(str) && RegExp.$1;
  if (!(name in CONTAINERS)) {
    name = '*';
  }
  var container = CONTAINERS[name];
  str = str.replace(/(^\s*)|(\s*$)/g, '');
  container.innerHTML = '' + str;
  var dom = container.childNodes[0];
  container.removeChild(dom);
  return dom;
};