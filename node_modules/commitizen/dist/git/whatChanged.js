"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whatChanged = whatChanged;

var _child_process = require("child_process");

function cov_2ixm6leycz() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/git/whatChanged.js";
  var hash = "1b3ffa6b1e244146ab047f40630d5a3cda14c5b3";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/git/whatChanged.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 17,
          column: 5
        }
      },
      "1": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 15,
          column: 5
        }
      },
      "2": {
        start: {
          line: 14,
          column: 6
        },
        end: {
          line: 14,
          column: 18
        }
      },
      "3": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 17
        }
      }
    },
    fnMap: {
      "0": {
        name: "whatChanged",
        decl: {
          start: {
            line: 8,
            column: 9
          },
          end: {
            line: 8,
            column: 20
          }
        },
        loc: {
          start: {
            line: 8,
            column: 38
          },
          end: {
            line: 18,
            column: 1
          }
        },
        line: 8
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 12,
            column: 5
          },
          end: {
            line: 12,
            column: 6
          }
        },
        loc: {
          start: {
            line: 12,
            column: 38
          },
          end: {
            line: 17,
            column: 3
          }
        },
        line: 12
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 15,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 15,
            column: 5
          }
        }, {
          start: {
            line: undefined,
            column: undefined
          },
          end: {
            line: undefined,
            column: undefined
          }
        }],
        line: 13
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "1b3ffa6b1e244146ab047f40630d5a3cda14c5b3"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2ixm6leycz = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2ixm6leycz();

/**
 * Asynchronously gets the git whatchanged output
 */
function whatChanged(repoPath, done) {
  cov_2ixm6leycz().f[0]++;
  cov_2ixm6leycz().s[0]++;
  (0, _child_process.exec)('git whatchanged', {
    maxBuffer: Infinity,
    cwd: repoPath
  }, function (error, stdout, stderr) {
    cov_2ixm6leycz().f[1]++;
    cov_2ixm6leycz().s[1]++;

    if (error) {
      cov_2ixm6leycz().b[0][0]++;
      cov_2ixm6leycz().s[2]++;
      throw error;
    } else {
      cov_2ixm6leycz().b[0][1]++;
    }

    cov_2ixm6leycz().s[3]++;
    done(stdout);
  });
}