import _extends from 'babel-runtime/helpers/extends';
function isPointsEq(a1, a2, isAlignPoint) {
  if (isAlignPoint) {
    return a1[0] === a2[0];
  }
  return a1[0] === a2[0] && a1[1] === a2[1];
}

export function getAlignFromPlacement(builtinPlacements, placementStr, align) {
  var baseAlign = builtinPlacements[placementStr] || {};
  return _extends({}, baseAlign, align);
}

export function getAlignPopupClassName(builtinPlacements, prefixCls, align, isAlignPoint) {
  var points = align.points;
  for (var placement in builtinPlacements) {
    if (builtinPlacements.hasOwnProperty(placement)) {
      if (isPointsEq(builtinPlacements[placement].points, points, isAlignPoint)) {
        return prefixCls + '-placement-' + placement;
      }
    }
  }
  return '';
}
export function noop() {}