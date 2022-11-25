"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProfileTwoTone = {
    name: 'profile',
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
                        d: 'M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z'
                    }
                },
                {
                    tag: 'path',
                    attrs: {
                        fill: secondaryColor,
                        d: 'M184 840h656V184H184v656zm300-496c0-4.4 3.6-8 8-8h184c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8H492c-4.4 0-8-3.6-8-8v-48zm0 144c0-4.4 3.6-8 8-8h184c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8H492c-4.4 0-8-3.6-8-8v-48zm0 144c0-4.4 3.6-8 8-8h184c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8H492c-4.4 0-8-3.6-8-8v-48zM380 328c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40zm0 144c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40zm0 144c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40z'
                    }
                },
                {
                    tag: 'path',
                    attrs: {
                        fill: primaryColor,
                        d: 'M340 656a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0-144a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0-144a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm152 320h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm0-144h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm0-144h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z'
                    }
                }
            ]
        };
    }
};
exports.default = ProfileTwoTone;
