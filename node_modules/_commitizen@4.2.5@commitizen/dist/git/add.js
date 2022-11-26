"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFile = addFile;
exports.addPath = addPath;

var _child_process = _interopRequireDefault(require("child_process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cov_226e3t1eat() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/git/add.js";
  var hash = "6b2e029493ef375337d44a1ebfb8489948920288";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/git/add.js",
    statementMap: {
      "0": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 12,
          column: 65
        }
      },
      "1": {
        start: {
          line: 19,
          column: 2
        },
        end: {
          line: 19,
          column: 70
        }
      }
    },
    fnMap: {
      "0": {
        name: "addPath",
        decl: {
          start: {
            line: 11,
            column: 9
          },
          end: {
            line: 11,
            column: 16
          }
        },
        loc: {
          start: {
            line: 11,
            column: 28
          },
          end: {
            line: 13,
            column: 1
          }
        },
        line: 11
      },
      "1": {
        name: "addFile",
        decl: {
          start: {
            line: 18,
            column: 9
          },
          end: {
            line: 18,
            column: 16
          }
        },
        loc: {
          start: {
            line: 18,
            column: 38
          },
          end: {
            line: 20,
            column: 1
          }
        },
        line: 18
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "6b2e029493ef375337d44a1ebfb8489948920288"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_226e3t1eat = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_226e3t1eat();

/**
 * Synchronously adds a path to git staging
 */
function addPath(repoPath) {
  cov_226e3t1eat().f[0]++;
  cov_226e3t1eat().s[0]++;

  _child_process.default.spawnSync('git', ['add', '.'], {
    cwd: repoPath
  });
}
/**
 * Synchronously adds a file to git staging
 */


function addFile(repoPath, filename) {
  cov_226e3t1eat().f[1]++;
  cov_226e3t1eat().s[1]++;

  _child_process.default.spawnSync('git', ['add', filename], {
    cwd: repoPath
  });
}