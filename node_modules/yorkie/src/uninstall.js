'use strict'

const fs = require('fs')
const hooks = require('./hooks.json')
const findParent = require('./utils/find-parent')
const findHooksDir = require('./utils/find-hooks-dir')
const is = require('./utils/is')

function removeHook(dir, name) {
  const filename = `${dir}/${name}`

  if (fs.existsSync(filename) && is.huskyOrYorkie(filename)) {
    fs.unlinkSync(`${dir}/${name}`)
  }
}

function uninstallFrom(huskyDir) {
  try {
    const hooksDir = findHooksDir(findParent(huskyDir, '.git'))

    hooks.forEach(function(hookName) {
      removeHook(hooksDir, hookName)
    })
    console.log('done\n')
  } catch (e) {
    console.error(e)
  }
}

module.exports = uninstallFrom
