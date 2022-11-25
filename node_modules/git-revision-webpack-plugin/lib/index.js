var buildFile = require('./build-file')
var runGitCommand = require('./helpers/run-git-command')

var COMMITHASH_COMMAND = 'rev-parse HEAD'
var VERSION_COMMAND = 'describe --always'
var BRANCH_COMMAND = 'rev-parse --abbrev-ref HEAD'

function GitRevisionPlugin (options) {
  options = options || {}

  this.gitWorkTree = options.gitWorkTree

  this.commithashCommand = options.commithashCommand ||
    COMMITHASH_COMMAND

  this.versionCommand = options.versionCommand ||
    VERSION_COMMAND + (options.lightweightTags ? ' --tags' : '')

  this.createBranchFile = options.branch || false

  this.branchCommand = options.branchCommand ||
    BRANCH_COMMAND

  if (options.versionCommand && options.lightweightTags) {
    throw new Error('lightweightTags can\'t be used together versionCommand')
  }
}

GitRevisionPlugin.prototype.apply = function (compiler) {
  buildFile({
    compiler: compiler,
    gitWorkTree: this.gitWorkTree,
    command: this.commithashCommand,
    replacePattern: /\[git-revision-hash\]/gi,
    asset: 'COMMITHASH'
  })

  buildFile({
    compiler: compiler,
    gitWorkTree: this.gitWorkTree,
    command: this.versionCommand,
    replacePattern: /\[git-revision-version\]/gi,
    asset: 'VERSION'
  })

  if (this.createBranchFile) {
    buildFile({
      compiler: compiler,
      gitWorkTree: this.gitWorkTree,
      command: this.branchCommand,
      replacePattern: /\[git-revision-branch\]/gi,
      asset: 'BRANCH'
    })
  }
}

GitRevisionPlugin.prototype.commithash = function () {
  return runGitCommand(
    this.gitWorkTree,
    this.commithashCommand
  )
}

GitRevisionPlugin.prototype.version = function () {
  return runGitCommand(
    this.gitWorkTree,
    this.versionCommand
  )
}

GitRevisionPlugin.prototype.branch = function () {
  return runGitCommand(
    this.gitWorkTree,
    this.branchCommand
  )
}

module.exports = GitRevisionPlugin
