/**
 * 创建DOM 节点
 * @param  {String} str Dom 字符串
 * @return {HTMLElement}  DOM 节点
 */
const TABLE = document.createElement('table');
const TABLE_TR = document.createElement('tr');
const FRAGMENT_REG = /^\s*<(\w+|!)[^>]*>/;
const CONTAINERS = {
  tr: document.createElement('tbody'),
  tbody: TABLE,
  thead: TABLE,
  tfoot: TABLE,
  td: TABLE_TR,
  th: TABLE_TR,
  '*': document.createElement('div')
};

module.exports = function createDom(str) {
  let name = FRAGMENT_REG.test(str) && RegExp.$1;
  if (!(name in CONTAINERS)) {
    name = '*';
  }
  const container = CONTAINERS[name];
  str = str.replace(/(^\s*)|(\s*$)/g, '');
  container.innerHTML = '' + str;
  const dom = container.childNodes[0];
  container.removeChild(dom);
  return dom;
};
