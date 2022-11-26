var _urlColors = {}; // {[url]: {id,colors}}
var theme_COLOR_config;

module.exports = {
    _tryNum: 0,
    changeColor: function (options, promiseForIE) {
        var Promise = promiseForIE || win().Promise
        var _this = this;
        if (!theme_COLOR_config) {
            theme_COLOR_config = win()[WP_THEME_CONFIG]
            var later = retry()
            //重试直到theme_COLOR_config加载
            if (later) return later
        }
        var oldColors = options.oldColors || theme_COLOR_config.colors || []
        var newColors = options.newColors || []

        var cssUrl = theme_COLOR_config.url || options.cssUrl;
        if (options.changeUrl) {
            cssUrl = options.changeUrl(cssUrl)
        }

        return new Promise(function (resolve, reject) {
            var last = _urlColors[cssUrl] //url可能被changeUrl改变
            if (last) {
                //之前已替换过
                oldColors = last.colors
            }

            if (isSameArr(oldColors, newColors)) {
                resolve()
            } else {
                setCssText(last, cssUrl, resolve, reject)
            }
        })

        function retry() {
            if (!theme_COLOR_config) {
                if (_this._tryNum < 9) {
                    _this._tryNum = _this._tryNum + 1
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(_this.changeColor(options, promiseForIE))
                        }, 100)
                    })
                } else {
                    theme_COLOR_config = {}
                }
            }
        }

        function setCssText(last, url, resolve, reject) {
            var elStyle = last && document.getElementById(last.id);
            if (elStyle && last.colors) {
                setCssTo(elStyle.innerText)
                last.colors = newColors
                resolve()
            } else {
                //第一次替换
                var id = 'css_' + (+new Date())
                elStyle = document.querySelector(options.appendToEl || 'body')
                    .appendChild(document.createElement('style'))

                elStyle.setAttribute('id', id)

                _this.getCssString(url, function (cssText) {
                    setCssTo(cssText)
                    _urlColors[url] = { id: id, colors: newColors }
                    resolve()
                }, reject)
            }

            function setCssTo(cssText) {
                cssText = _this.replaceCssText(cssText, oldColors, newColors)
                elStyle.innerText = cssText
            }
        }

    },
    replaceCssText: function (cssText, oldColors, newColors) {
        oldColors.forEach(function (color, t) {
            //#222、#222223、#22222350、222, 255,3 => #333、#333334、#33333450、211,133,53、hsl(27, 92.531%, 52.745%)
            var reg = new RegExp(color.replace(/\s/g, '').replace(/,/g, ',\\s*') + '([\\da-f]{2})?(\\b|\\)|,|\\s)', 'ig')
            cssText = cssText.replace(reg, newColors[t] + '$1$2') // 255, 255,3
        })
        return cssText
    },
    getCssString: function (url, resolve, reject) {
        var css = theme_COLOR_config.cssCode
        if (css) { // css已内嵌在js中
            theme_COLOR_config.cssCode = ''
            resolve(css)
            return
        }

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText)
                } else {
                    reject(xhr.status)
                }
            }
        }
        xhr.onerror = function (e) {
            reject(e)
        }
        xhr.ontimeout = function (e) {
            reject(e)
        }
        xhr.open('GET', url)
        xhr.send()
    },
}
function win(){
    return typeof window === 'undefined' ? global : window
}
function isSameArr(oldColors, newColors) {
    if (oldColors.length !== newColors.length) {
        return false
    }
    for (var i = 0, j = oldColors.length; i < j; i++) {
        if (oldColors[i] !== newColors[i]) {
            return false
        }
    }
    return true
}
