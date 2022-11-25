import _extends from "babel-runtime/helpers/extends";
function omit(obj, fields) {
  var shallowCopy = _extends({}, obj);
  for (var i = 0; i < fields.length; i++) {
    var key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}

export default omit;