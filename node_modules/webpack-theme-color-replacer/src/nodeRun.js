var AssetsExtractor = require('./AssetsExtractor')
var replaceFileName = require('./replaceFileName')
var path = require('path')
var fs = require('fs')
var glob = require('glob')
var mkdirp = require('mkdirp')

/*
// use in Nodejs:
var extractColor = require('webpack-theme-color-replacer/src/nodeRun')
extractColor({
    src: 'css/*.*',
    fileName: 'css/theme-color-[contenthash:8].css',
    matchColors: ['#e2721d', '#ccc']
})
*/
module.exports = function run(options) {
    var mockAssets = getMockAssets(options);
    var code = new AssetsExtractor(options).extractAssets(mockAssets)

    var outFile = replaceFileName(options.fileName, code);
    mkdirp.sync(path.dirname(outFile))
    fs.writeFileSync(outFile, code)
    return { code, outFile }
}

function getMockAssets(options) {
    var mockAssets = {}
    var srcList = [].concat(options.src)
    srcList.map(src => {
        glob.sync(path.resolve(src)).map(pathFn => {
            var fn = path.relative('.', pathFn)
            mockAssets[fn] = { source: () => fs.readFileSync(pathFn, 'utf-8') }
        })
    })
    return mockAssets;
}

