export var degreeToRadian = function (angle) {
    return angle * Math.PI / 180;
};
export var radianToDegree = function (angleInRadian) {
    return angleInRadian * 180 / Math.PI;
};
export var polarToCartesian = function (cx, cy, radius, angle) {
    var radian = degreeToRadian(angle);
    return {
        x: cx + Math.cos(radian) * radius,
        y: cy + Math.sin(radian) * radius
    };
};
//# sourceMappingURL=PolarUtils.js.map