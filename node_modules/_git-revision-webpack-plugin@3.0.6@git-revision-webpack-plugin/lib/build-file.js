var runGitCommand = require('./helpers/run-git-command')

module.exports = ({ compiler, gitWorkTree, command, replacePattern, asset }) => {
  var data = ''

  compiler.hooks.compilation.tap('compilation', (compilation) => {
    compilation.hooks.optimizeTree.tapAsync('optimize-tree', (chunks, modules, callback) => {
      runGitCommand(gitWorkTree, command, function (err, res) {
        if (err) { return callback(err) }
        data = res

        callback()
      })
    })

    compilation.mainTemplate.hooks.assetPath.tap('asset-path', (assetPath, chunkData) => {
      return (typeof assetPath === 'function'
        ? assetPath(chunkData)
        : assetPath).replace(replacePattern, data)
    })
  })

  compiler.hooks.emit.tapAsync('emit', (compilation, callback) => {
    compilation.assets[asset] = {
      source: function () {
        return data
      },
      size: function () {
        return data.length
      }
    }

    callback()
  })
}
