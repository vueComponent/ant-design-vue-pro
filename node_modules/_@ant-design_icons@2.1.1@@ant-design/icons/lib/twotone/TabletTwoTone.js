"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TabletTwoTone = {
    name: 'tablet',
    theme: 'twotone',
    icon: function (primaryColor, secondaryColor) {
        return {
            tag: 'svg',
            attrs: { viewBox: '64 64 896 896', focusable: false },
            children: [
                {
                    tag: 'path',
                    attrs: {
                        fill: primaryColor,
                        d: 'M800 64H224c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h576c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64zm-8 824H232V136h560v752z'
                    }
                },
                {
                    tag: 'path',
                    attrs: {
                        fill: secondaryColor,
                        d: 'M232 888h560V136H232v752zm280-144c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40z'
                    }
                },
                {
                    tag: 'path',
                    attrs: {
                        fill: primaryColor,
                        d: 'M472 784a40 40 0 1 0 80 0 40 40 0 1 0-80 0z'
                    }
                }
            ]
        };
    }
};
exports.default = TabletTwoTone;
