var path = require('path')
var fs = require('fs')
var Extractor = require('./Extractor')

/* optimize-chunk-assets 钩子的代码处理 */
// var Css_Code_Prefix = 'exports.push([module.i, "'; // from css-loader:  exports.push([module.i, "
// var Css_Code_Surfix = '}\\n", ""])'; // from css-loader:  }\n', ''])}
// module.exports = function extractAssets(assets, extractor) {
//   var cssSrcs = Object.keys(assets).map(fn => {
//     if (fn.match(/\.css/i)) {
//       var src = assets[fn].source()
//       return extractor.extractColors(src).join('\n')
//     }
//     else if (fn.match(/\.js/i)
//       || fn === '*' //miniCssPlugin
//       || fn === 'extract-text-webpack-plugin-output-filename' //extractTextPlugin
//     ) {
//       var src = assets[fn].source()
//       var start = src.indexOf(Css_Code_Prefix);
//       if (start > -1) {
//         var end = src.indexOf(Css_Code_Surfix, start + 1)
//         if (end + 1 > start + Css_Code_Prefix.length) {
//           var srcCss = src.substring(start + Css_Code_Prefix.length, end + 1).replace(/\\n/g, '')
//           return extractor.extractColors(srcCss).join('\n')
//         }
//       }
//     }
//   });
//   return cssSrcs
// }

/* emit钩子的代码处理 */

//                          Module\nexports.push([module.i, \"h1...   ;\\n}\\n\", \"\",{\"version\":3,\"
//css-loader 2:        \n// Module\nexports.push([module.i, \"a{   ...... }\\n\", \"\",{\"version\":3,
//css-loader 1:        \n// module\nexports.push([module.i, \"a{   ...... }\\n\", \"\"]);
//css-loader 2@srcmap:   // Module\nexports.push([module.i, "a{   .....   }\n", "",{"version":3
//css-loader@srcmap.less // Module\nexports.push([module.i, "a{ .....   ;\n  }\n}\n\n\n/*# sourceMappingURL=antd.css.map*/", "",{"version":3,"
//css-loader 5.1:      ___CSS_LOADER_EXPORT___.push([module.id, "a {\n ... \n  }\n}\n"],"sourceRoot":""}]);

var Css_Loader_Reg_DEV = /\bn?(?:exports|___CSS_LOADER_EXPORT___)\.push\(\[module\.id?, \\?"(.+?\})(?:\\?\\n)?(?:[\\n]*\/\*#\s*sourceMappingURL=.+?\*\/)?\\?", \\?"\\?"(?:\]\)|,\s*\{)/g;

//css-loader:  n.exports=t("FZ+f")(!1)).push([n.i,"\n.payment-type[data-v-ffb10066] {......}\n",""])
var Css_Loader_Reg_UGLY = /\.push\(\[\w+\.i,['"](.+?\})[\\rn]*['"],['"]['"](?:\]\)|,\{)/g;
var CssExtReg = /\.css$/i, JsExtReg = /\.js$/i

module.exports = function AssetsExtractor(options) {
    this.extractor = new Extractor(options)

    this.extractAssets = function (assets) {
        var srcArray = this.extractToArray(assets);

        // 外部的css文件。如cdn加载的
        if (options.externalCssFiles) {
            [].concat(options.externalCssFiles).map(file => {
                var src = fs.readFileSync(file, 'utf-8')
                var css = this.extractor.extractColors(src)
                srcArray = srcArray.concat(css)
            })
        }

        var output = dropDuplicate(srcArray).join('\n');

        // 自定义后续处理
        if (options.resolveCss) {
            output = options.resolveCss(output, srcArray)
        }
        return output
    }
    this.extractToArray = function (assets) {
        var srcArray = extractAll(this)
        if (srcArray.length === 0 && !this._uglyChanged) {
            // 容错一次
            this._uglyChanged = true
            options.isJsUgly = !options.isJsUgly
            //清空缓存
            Object.keys(assets).map(fn => assets[fn]._themeCssCache = 0)
            srcArray = extractAll(this)
        }
        return srcArray;

        function extractAll(that) {
            var cssSrcs = [];
            Object.keys(assets).map(fn => {
                // 原本每修改一点源码，都需要对整个项目的assets翻一遍css，影响性能。
                // 故改为在asset上缓存上一次的结果，对没发生变化的asset直接取缓存(已发生变化的asset已经是新对象，无缓存)。
                var asset = assets[fn]
                var cssRules = asset._themeCssCache || that.extractAsset(fn, asset)
                asset._themeCssCache = cssRules
                cssSrcs = cssSrcs.concat(cssRules)
            });
            return cssSrcs
        }
    }
    this.extractAsset = function (fn, asset) {
        if (fn.match(CssExtReg)) {
            var src = assetToStr(asset);
            writeFileForDebugIf(fn, src, this.extractor)
            return this.extractor.extractColors(src);
        } else if (fn.match(JsExtReg)) {
            src = assetToStr(asset);
            writeFileForDebugIf(fn, src, this.extractor)
            var cssSrcs = []
            var CssCodeReg = options.isJsUgly ? Css_Loader_Reg_UGLY : Css_Loader_Reg_DEV;
            src.replace(CssCodeReg, (match, $1) => {
                cssSrcs = cssSrcs.concat(this.extractor.extractColors($1));
            });
            return cssSrcs
        }
        return []

        function writeFileForDebugIf(fn, src, extractor) {
            // `npm run dev --theme_debug` to write asset files for debug
            if (process.env.npm_config_theme_debug) {
                try {
                    if (extractor.testCssCode(src)) {
                        var info = '/*var theme_cfg=' + JSON.stringify(options) + '*/\n' + src
                        fs.writeFileSync(path.join(process.cwd(), '_tmp_' + path.basename(fn)), info)
                    }
                } catch (e) {
                }
            }
        }
    }
};

function assetToStr(asset) {
    var src = asset.source() || '';
    return src.toString();
}

function dropDuplicate(arr) {
    var map = {}
    var r = []
    for (var s of arr) {
        if (!map[s]) {
            r.push(s)
            map[s] = 1
        }
    }
    return r
}
