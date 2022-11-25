var arrPrototype = Array.prototype;
var splice = arrPrototype.splice;
var indexOf = arrPrototype.indexOf;
var slice = arrPrototype.slice;

var pull = function pull(arr) {
  var values = slice.call(arguments, 1);
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    var fromIndex = -1;
    while ((fromIndex = indexOf.call(arr, value)) > -1) {
      splice.call(arr, fromIndex, 1);
    }
  }
  return arr;
};

module.exports = pull;