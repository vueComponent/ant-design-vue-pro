"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _inquirer = _interopRequireDefault(require("inquirer"));

var _findRoot = _interopRequireDefault(require("find-root"));

var _util = require("../../common/util");

var _parsers = require("../parsers");

var _commitizen = require("../../commitizen");

var gitStrategy = _interopRequireWildcard(require("./git"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// destructure for shorter apis
let {
  parse
} = _parsers.gitCz;
let {
  getPrompter,
  resolveAdapterPath,
  getGitRootPath
} = _commitizen.adapter;
let {
  isClean
} = _commitizen.staging;
var _default = gitCz;
exports.default = _default;

function gitCz(rawGitArgs, environment, adapterConfig) {
  // See if any override conditions exist.
  // In these very specific scenarios we may want to use a different
  // commit strategy than git-cz. For example, in the case of --amend
  let parsedCommitizenArgs = _parsers.commitizen.parse(rawGitArgs);

  if (parsedCommitizenArgs.amend) {
    // console.log('override --amend in place');
    gitStrategy.default(rawGitArgs, environment);
    return;
  } // Now, if we've made it past overrides, proceed with the git-cz strategy


  let parsedGitCzArgs = parse(rawGitArgs); // Determine if we need to process this commit as a retry instead of a
  // normal commit.

  let retryLastCommit = rawGitArgs && rawGitArgs[0] === '--retry'; // Determine if we need to process this commit using interactive hook mode
  // for husky prepare-commit-message

  let hookMode = !(typeof parsedCommitizenArgs.hook === 'undefined');
  let resolvedAdapterConfigPath = resolveAdapterPath(adapterConfig.path);
  let resolvedAdapterRootPath = (0, _findRoot.default)(resolvedAdapterConfigPath);
  let prompter = getPrompter(adapterConfig.path);
  let shouldStageAllFiles = rawGitArgs.includes('-a') || rawGitArgs.includes('--all');
  isClean(process.cwd(), function (error, stagingIsClean) {
    if (error) {
      throw error;
    }

    if (stagingIsClean && !parsedGitCzArgs.includes('--allow-empty')) {
      throw new Error('No files added to staging! Did you forget to run git add?');
    } // OH GOD IM SORRY FOR THIS SECTION


    let adapterPackageJson = (0, _util.getParsedPackageJsonFromPath)(resolvedAdapterRootPath);
    let cliPackageJson = (0, _util.getParsedPackageJsonFromPath)(environment.cliPath);
    console.log(`cz-cli@${cliPackageJson.version}, ${adapterPackageJson.name}@${adapterPackageJson.version}\n`);
    (0, _commitizen.commit)(_inquirer.default, getGitRootPath(), prompter, {
      args: parsedGitCzArgs,
      disableAppendPaths: true,
      emitData: true,
      quiet: false,
      retryLastCommit,
      hookMode
    }, function (error) {
      if (error) {
        throw error;
      }
    });
  }, shouldStageAllFiles);
}