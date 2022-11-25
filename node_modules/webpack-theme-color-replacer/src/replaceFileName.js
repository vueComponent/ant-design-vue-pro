var crypto = require('crypto')

module.exports = function replaceFileName(outFile, code) {
    var p1 = outFile.indexOf('contenthash:')
    if (p1 > -1) {
        p1 += 12
        var p2 = outFile.indexOf(']', p1)
        if (p2 > p1) {
            var len = outFile.substr(p1, p2 - p1)
            outFile = outFile.replace('[contenthash:' + len + ']', getHash(code).slice(0, len))
        }
    }
    return outFile;
}

function getHash(str) {
    var md = crypto.createHash('md4');
    return md.update(str).digest('hex');
}
