"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function renderIconDefinitionToSVGElement(icon, options) {
    if (options === void 0) { options = {}; }
    if (typeof icon.icon === 'function') {
        var placeholders = options.placeholders || {};
        return renderAbstractNodeToSVGElement(icon.icon(placeholders.primaryColor || '#333', placeholders.secondaryColor || '#E6E6E6'), options);
    }
    return renderAbstractNodeToSVGElement(icon.icon, options);
}
exports.renderIconDefinitionToSVGElement = renderIconDefinitionToSVGElement;
function renderAbstractNodeToSVGElement(node, options) {
    var targetAttrs = node.tag === 'svg'
        ? __assign({}, node.attrs, (options.extraSVGAttrs || {})) : node.attrs;
    var attrs = Object.keys(targetAttrs).reduce(function (acc, nextKey) {
        var key = nextKey;
        var value = targetAttrs[key];
        var token = key + "=\"" + value + "\"";
        acc.push(token);
        return acc;
    }, []);
    var attrsToken = attrs.length ? ' ' + attrs.join(' ') : '';
    var container = [
        "<" + node.tag + attrsToken + ">",
        "</" + node.tag + ">"
    ];
    var children = (node.children || [])
        .map(function (child) { return renderAbstractNodeToSVGElement(child, options); })
        .join('');
    return "" + container[0] + children + container[1];
}
