import warning, { resetWarned } from '../vc-util/warning';

export { resetWarned };

export default (function (valid, component) {
  var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  warning(valid, '[antdv: ' + component + '] ' + message);
});