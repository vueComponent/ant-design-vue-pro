"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;

var _child_process = _interopRequireDefault(require("child_process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cov_2lfeo71xnk() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/git/init.js";
  var hash = "2e1de1e82ca18c86df306fd611871f92429b8fa5";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/git/init.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 9,
          column: 61
        }
      }
    },
    fnMap: {
      "0": {
        name: "init",
        decl: {
          start: {
            line: 8,
            column: 9
          },
          end: {
            line: 8,
            column: 13
          }
        },
        loc: {
          start: {
            line: 8,
            column: 25
          },
          end: {
            line: 10,
            column: 1
          }
        },
        line: 8
      }
    },
    branchMap: {},
    s: {
      "0": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "2e1de1e82ca18c86df306fd611871f92429b8fa5"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2lfeo71xnk = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2lfeo71xnk();

/**
 * Synchronously creates a new git repo at a path
 */
function init(repoPath) {
  cov_2lfeo71xnk().f[0]++;
  cov_2lfeo71xnk().s[0]++;

  _child_process.default.spawnSync('git', ['init'], {
    cwd: repoPath
  });
}