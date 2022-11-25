"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FolderTwoTone = {
    name: 'folder',
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
                        d: 'M880 298.4H521L403.7 186.2a8.15 8.15 0 0 0-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z'
                    }
                },
                {
                    tag: 'path',
                    attrs: {
                        fill: secondaryColor,
                        d: 'M372.5 256H184v512h656V370.4H492.1z'
                    }
                }
            ]
        };
    }
};
exports.default = FolderTwoTone;
