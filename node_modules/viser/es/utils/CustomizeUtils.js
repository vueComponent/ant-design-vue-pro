var G2 = require('@antv/g2');
export var registerShape = function (geoName, shapeName, shapeFun) {
    G2.Shape.registerShape(geoName, shapeName, shapeFun);
};
export var registerAnimation = function (animationType, animationName, animationFun) {
    G2.Animate.registerAnimation(animationType, animationName, animationFun);
};
//# sourceMappingURL=CustomizeUtils.js.map