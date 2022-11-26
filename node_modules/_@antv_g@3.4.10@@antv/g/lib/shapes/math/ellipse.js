module.exports = {
  xAt: function xAt(psi, rx, ry, cx, t) {
    return rx * Math.cos(psi) * Math.cos(t) - ry * Math.sin(psi) * Math.sin(t) + cx;
  },
  yAt: function yAt(psi, rx, ry, cy, t) {
    return rx * Math.sin(psi) * Math.cos(t) + ry * Math.cos(psi) * Math.sin(t) + cy;
  },
  xExtrema: function xExtrema(psi, rx, ry) {
    return Math.atan(-ry / rx * Math.tan(psi));
  },
  yExtrema: function yExtrema(psi, rx, ry) {
    return Math.atan(ry / (rx * Math.tan(psi)));
  }
};