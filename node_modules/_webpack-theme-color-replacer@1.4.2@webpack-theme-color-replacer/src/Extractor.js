// \n和备注
var Reg_Lf_Rem = /\\\\?n|\n|\\\\?t|\\\\?r|\/\*[\s\S]+?\*\//g

var SpaceReg = /\s+/g
var TrimReg = /(^|,)\s+|\s+($)/g; //前空格，逗号后的空格; 后空格
var SubCssReg = /\s*>\s*/g // div > a 替换为 div>a
var DataUrlReg = /url\s*\([\\'"\s]*data:/ //url("data:image/svg+xml;base64,PHN2")
var QuotReg = /\\+(['"])/g
//var ExclueCssReg = /(?:scale3d|translate3d|rotate3d|matrix3d)\s*\(/i;

module.exports = function Extractor(options) {
    var matchColorRegs = options.matchColors // ['#409EFF', '#409eff', '#53a8ff', '#66b1ff', '#79bbff', '#8cc5ff', '#a0cfff', '#b3d8ff', '#c6e2ff', '#d9ecff', '#ecf5ff', '#3a8ee6', '#337ecc']
        .map(c => new RegExp(c.replace(/\s/g, '').replace(/,/g, ',\\s*') + '([\\da-f]{2})?(\\b|\\)|,|\\s)', 'i')); // 255, 255,3

    this.extractColors = function (src) {
        src = src.replace(Reg_Lf_Rem, '')
        var ret = []
        var nameStart, nameEnd, cssEnd = -1;
        while (true) {
            nameStart = cssEnd + 1
            nameEnd = src.indexOf('{', nameStart)
            cssEnd = findCssEnd(src, nameEnd)
            if (cssEnd > -1 && cssEnd > nameEnd && nameEnd > nameStart) {
                var cssCode = src.slice(nameEnd + 1, cssEnd)
                if (cssCode.indexOf('{') > -1) { // @keyframes
                    var rules = this.extractColors(cssCode)
                } else {
                    rules = this.getRules(cssCode)
                }
                if (rules.length) {
                    var selector = src.slice(nameStart, nameEnd)
                    selector = selector.replace(TrimReg, '$1')
                    selector = selector.replace(SubCssReg, '>')
                    selector = selector.replace(SpaceReg, ' ') // lines
                    var p = selector.indexOf(';') //@charset utf-8;
                    if (p > -1) {
                        selector = selector.slice(p + 1)
                    }
                    // 改变选择器
                    if (options.changeSelector) {
                        var util = {
                            rules: rules,
                            changeEach: changeEach
                        }
                        selector = options.changeSelector(selector.split(',').sort().join(','), util) || selector
                    }
                    ret.push(selector + '{' + rules.join(';') + '}')
                }
            } else {
                break;
            }
        }
        return ret

        // 查找css尾部，兼容 @keyframes {10%{...}}
        function findCssEnd(src, start) {
            var level = 1
            var cssEnd = start
            while (true) {
                cssEnd++
                var char = src[cssEnd]
                if (!char) {
                    return -1
                } else if (char === '{') {
                    level++
                } else if (char === '}') {
                    level--
                    if (level === 0) {
                        break
                    }
                }
            }
            return cssEnd
        }

        function changeEach(selector, surfix, prefix) {
            surfix = surfix || ''
            prefix = prefix || ''
            return selector.split(',').map(function (s) {
                return prefix + s + surfix
            }).join(',')
        }
    }
    this.getRules = function (cssCode) {
        var rules = cssCode.split(';')
        var ret = []
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i]
            if (rule.match(DataUrlReg)) {
                rule += ';' + rules[i + 1]
                rule = rule.replace(QuotReg, '$1')
                i++;
            }
            if (this.testCssCode(rule)) {
                ret.push(rule.replace(SpaceReg, ' '))
            }
        }
        return ret
    }

    this.testCssCode = function (cssCode) {
        for (var colorReg of matchColorRegs) {
            if (colorReg.test(cssCode)) return true // && !ExclueCssReg.test(cssCode)
        }
        return false
    }
}
