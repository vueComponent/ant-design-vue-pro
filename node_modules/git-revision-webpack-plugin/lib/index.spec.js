/* global describe, it */

var rewire = require('rewire')
var sinon = require('sinon')
var expect = require('chai').expect

var GitRevisionPlugin = rewire('.')

describe('git-revision-webpack-plugin (unit)', function () {
  describe('on setting custom commithash command', function () {
    it('should run the build on .apply', function () {
      var buildFile = sinon.spy()
      GitRevisionPlugin.__set__('buildFile', buildFile)

      new GitRevisionPlugin({
        commithashCommand: 'custom commithash command'
      }).apply()

      var commithashCall = buildFile.args.find(function (calls) {
        return calls[0].asset === 'COMMITHASH'
      })

      expect(commithashCall[0].command).to.eql('custom commithash command')
    })

    it('should run the custom git command on .commithash', function () {
      var runGitCommand = sinon.spy()
      GitRevisionPlugin.__set__('runGitCommand', runGitCommand)

      new GitRevisionPlugin({
        commithashCommand: 'custom commithash command'
      }).commithash()

      expect(runGitCommand.args[0][1]).to.eql('custom commithash command')
    })
  })

  describe('on setting custom version command', function () {
    it('should prevent setting lightweightTags flag', function () {
      expect(function () {
        /* eslint no-new: 0 */
        new GitRevisionPlugin({
          versionCommand: 'custom version command',
          lightweightTags: true
        })
      }).to.throw('lightweightTags can\'t be used together versionCommand')
    })

    it('should run the build on .apply', function () {
      var buildFile = sinon.spy()
      GitRevisionPlugin.__set__('buildFile', buildFile)

      new GitRevisionPlugin({
        versionCommand: 'custom version command'
      }).apply()

      var commithashCall = buildFile.args.find(function (calls) {
        return calls[0].asset === 'VERSION'
      })

      expect(commithashCall[0].command).to.eql('custom version command')
    })

    it('should run the custom git command on .version', function () {
      var runGitCommand = sinon.spy()
      GitRevisionPlugin.__set__('runGitCommand', runGitCommand)

      new GitRevisionPlugin({
        versionCommand: 'custom version command'
      }).version()

      expect(runGitCommand.args[0][1]).to.eql('custom version command')
    })
  })

  describe('on setting custom branch command', function () {
    it('should run the build on .apply', function () {
      var buildFile = sinon.spy()
      GitRevisionPlugin.__set__('buildFile', buildFile)

      new GitRevisionPlugin({
        branch: true,
        branchCommand: 'custom branch command'
      }).apply()

      var branchCall = buildFile.args.find(function (calls) {
        return calls[0].asset === 'BRANCH'
      })

      expect(branchCall[0].command).to.eql('custom branch command')
    })

    it('should run the custom git command on .version', function () {
      var runGitCommand = sinon.spy()
      GitRevisionPlugin.__set__('runGitCommand', runGitCommand)

      new GitRevisionPlugin({
        branch: true,
        branchCommand: 'custom branch command'
      }).branch()

      expect(runGitCommand.args[0][1]).to.eql('custom branch command')
    })
  })
})
