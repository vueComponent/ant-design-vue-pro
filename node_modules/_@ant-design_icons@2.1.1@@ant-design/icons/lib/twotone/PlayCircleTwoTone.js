"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayCircleTwoTone = {
    name: 'play-circle',
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
                        d: 'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z'
                    }
                },
                {
                    tag: 'path',
                    attrs: {
                        fill: secondaryColor,
                        d: 'M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zm164.1 378.2L457.7 677.1a8.02 8.02 0 0 1-12.7-6.5V353a8 8 0 0 1 12.7-6.5l218.4 158.8a7.9 7.9 0 0 1 0 12.9z'
                    }
                },
                {
                    tag: 'path',
                    attrs: {
                        fill: primaryColor,
                        d: 'M676.1 505.3L457.7 346.5A8 8 0 0 0 445 353v317.6a8.02 8.02 0 0 0 12.7 6.5l218.4-158.9a7.9 7.9 0 0 0 0-12.9z'
                    }
                }
            ]
        };
    }
};
exports.default = PlayCircleTwoTone;
