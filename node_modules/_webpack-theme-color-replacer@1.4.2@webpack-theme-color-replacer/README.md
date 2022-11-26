This plugin can extract theme color styles from all the outputed css files (such as element-ui theme colors), and make a 'theme-colors.css' file which only contains color styles. At runtime in your web page, the client part will help you to download this css file, and then replace the colors into new customized colors dynamicly.

Preview:    
https://hzsrc-vue-webpack4-elementui.netlify.com/themeColor.html    
http://test.hz300.com/webpack4/#/theme

Implementation (Chinese):
https://segmentfault.com/a/1190000016061608

# Install
npm i -D webpack-theme-color-replacer

# Cofig for webpack

````js

const ThemeColorReplacer = require('webpack-theme-color-replacer')

module.exports = {
    // ..... other config
    plugins: [
        new ThemeColorReplacer({
            matchColors: ['#ed4040', '#4b0', '255,80,80', '27, 92.531%, 52.745%'], // colors array for extracting css file, support rgb and hsl.
            fileName: 'css/theme-colors-[contenthash:8].css', //optional. output css file name, suport [contenthash] and [hash].
            // resolveCss(resultCss) { // optional. Resolve result css code as you wish.
            //     return resultCss.replace(/#ccc/g, '#eee')
            // },
            externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
            // changeSelector(selector, util) { // optional, Funciton. Changing css selectors, in order to raise css priority, to resolve lazy-loading problems.
            //     return util.changeEach(selector, '.el-button--default')
            // },
            injectCss: false, // optional. Inject css text into js file, no need to download `theme-colors-xxx.css` any more.
            isJsUgly: process.env.NODE_ENV !== 'development', // optional. Set to `true` if your js is uglified. Default is set by process.env.NODE_ENV.
        })
    ],
}
````
If you use customized runtime-chunk filename, it should contains a string `manifest.`, like this:
````js
optimization: {
  runtimeChunk: {
    name: entrypoint => 'manifest.' +  entrypoint.name,
  },
}
````
You can view this sample:
https://github.com/hzsrc/vue-element-ui-scaffold-webpack4/blob/master/build/webpack.base.conf.js

---
* Other build tool(not webpack)

Otherwise, if you use other build tool(like gulp) but not webpack, you can use this plugin by nodejs:
````js
var nodeRun = require('webpack-theme-color-replacer/src/nodeRun');
var {code, outFile} = nodeRun({
    src: 'src/css/**/*.css', // source css files. string or string array, as `glob`.
    matchColors: ['#ed4040', '#4b0', '255,80,80', '27, 92.531%, 52.745%'],
    fileName: 'css/theme-colors-[contenthash:8].css',
    // ...
})
// do sth with outFile
````
See this sample: https://github.com/hzsrc/webpack-theme-color-replacer/blob/master/src/nodeRun.js

# Usage in your runtime web page
Like this:

````js
import client from 'webpack-theme-color-replacer/client'

// change theme colors at runtime.
export function changeColor() {
  var options = {
    newColors: ['#f67a17', '#f67a17', '160,20,255', '285,78.182%,56.863%'], // new colors array, one-to-one corresponde with `matchColors`
    // appendToEl: 'head', //optional. The element selector for appending child with `<style>`, default is 'body'. Using `appendToEl: 'body'` can make the css priority higher than any css in <head>
    // changeUrl(cssUrl) {
    //   return `/${cssUrl}`; // while router is not `hash` mode, it needs absolute path
    // },
  }

  client.changer.changeColor(options, Promise).then(() => {
      console.log('Theme colors changed!')
  })
}



````

You can view this sample:
https://github.com/hzsrc/vue-element-ui-scaffold-webpack4/blob/master/src/js/themeColorClient.js

# Options for build
These options are used for `new ThemeColorReplacer(options)`.

#### * matchColors: Array&lt;string>
Colors array for extracting css file. Css rules which have any one of these colors will be extracted out.
    
#### * fileName: string
Optional. output css file name, suport [contenthash] and [hash].

#### * resolveCss: Function(resultCss : string) : string
Optional. Resolve result css code as you wish.

#### * externalCssFiles : string | Array&lt;string>
Optional. Set external css files (such as cdn css) to extract colors.

#### * changeSelector : Function(selector: string, util: { rules: Array&lt;String>, changeEach: Function } ): string
Optional. Changing css selectors, in order to raise css priority, to resolve lazy-loading problems.

#### * injectCss: boolean
Optional. Inject css text into js file, no need to download `theme-colors-xxx.css` any more.

#### * isJsUgly: boolean
Optional. Default value: process.env.NODE_ENV !== 'development'. Set to `true` if your js is uglified. Default is set by process.env.NODE_ENV.

#### * configVar: string
Optional.  to set custom var name, instead of `theme_COLOR_cfg` or `tc_cfg_xxxxxx`. Default is an random name which start with 'tc_cfg_'.

#### * injectToHtml: RegExp | true
Optional.  Injecting config-code into html files instead of injecting into entry js files. Use a RegExp to check which files to be injected to. `true` is the same as `/index\.html?$/i`.


# Options for runtime
These options are used for `client.changer.changeColor(options)`, which imports `client/index.js`.

#### * newColors: Array&lt;string>
New colors array for changing, one-to-one corresponde with `matchColors`.

#### * appendToEl: string
Optional. The element selector for this plugin to appending with child node `<style>`. Default is 'body'. Using `appendToEl: 'body'` can make the priority of theme-color-css higher than any other css in <head> element.

#### * changeUrl: Function(cssUrl: string): string
Optional. Change the theme-color-css download url if you need. While router is not `hash` mode, it needs to change url to an absolute path(start with `/`).


# issues report
If you have issues with this plugin, please run your command with `--theme_debug` option, such as `npm run dev --theme_debug`, then upload the outputed `_tmp_xxx` files while reporting issues. Thanks!

#  update log (fixed bugs not listed)
### 1.3.2
* Default to append `<style>...</style>` to `<body>`, not to `<head>` any more, in order to resolve most priority problems in lazy loading pages. Thanks to [iota9star](https://github.com/iota9star) : [15](https://github.com/hzsrc/webpack-theme-color-replacer/issues/15)

### 1.3.4
* Support running without webpack, just with nodejs, such as like `gulp`.

### 1.3.12
* HotModuleReplacement performance improved.

### 1.3.14
* hsl(a) colors format supported.

### 1.3.25
* Add `themeUtil` tool which can make color series both at 
[webpack-config](https://github.com/hzsrc/vue-element-ui-scaffold-webpack4/blob/master/build/webpack.base.conf.js)
 and [runtime](https://github.com/hzsrc/vue-element-ui-scaffold-webpack4/blob/master/src/js/themeColorClient.js).   

* `getElementUISeries` returns all 1-9 darken colors. 

### 1.4.1
* Replace `__theme_COLOR_cfg` to a random variable name, remove `__theme_COLOR_css` variable, to resolve name collision problems: https://github.com/hzsrc/webpack-theme-color-replacer/pull/103/
* Add a build option: `configVar`, to set your variable name.
* <font color="red">Note: need to use `webpack.DefinePlugin` in webpack.</font>

### 1.4.2
Add `injectToHtml` option. 
