var clamp = function clamp(a, min, max) {
  if (a < min) {
    return min;
  } else if (a > max) {
    return max;
  }
  return a;
};

module.exports = clamp;