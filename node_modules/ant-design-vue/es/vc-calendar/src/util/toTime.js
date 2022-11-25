export function goStartMonth(time) {
  return time.clone().startOf('month');
}

export function goEndMonth(time) {
  return time.clone().endOf('month');
}

export function goTime(time, direction, unit) {
  return time.clone().add(direction, unit);
}

export function includesTime() {
  var timeList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var time = arguments[1];
  var unit = arguments[2];

  return timeList.some(function (t) {
    return t.isSame(time, unit);
  });
}