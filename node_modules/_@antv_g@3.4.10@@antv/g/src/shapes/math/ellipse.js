module.exports = {
  xAt(psi, rx, ry, cx, t) {
    return rx * Math.cos(psi) * Math.cos(t) - ry * Math.sin(psi) * Math.sin(t) + cx;
  },
  yAt(psi, rx, ry, cy, t) {
    return rx * Math.sin(psi) * Math.cos(t) + ry * Math.cos(psi) * Math.sin(t) + cy;
  },
  xExtrema(psi, rx, ry) {
    return Math.atan((-ry / rx) * Math.tan(psi));
  },
  yExtrema(psi, rx, ry) {
    return Math.atan((ry / (rx * Math.tan(psi))));
  }
};
