"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClean = isClean;

var _child_process = require("child_process");

function cov_jkd4cxdc9() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/commitizen/staging.js";
  var hash = "30be7fb393c788ad4e85c71340438cb0aaa50d35";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/commitizen/staging.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 18,
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
          column: 25
        }
      },
      "3": {
        start: {
          line: 16,
          column: 17
        },
        end: {
          line: 16,
          column: 29
        }
      },
      "4": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 43
        }
      }
    },
    fnMap: {
      "0": {
        name: "isClean",
        decl: {
          start: {
            line: 8,
            column: 9
          },
          end: {
            line: 8,
            column: 16
          }
        },
        loc: {
          start: {
            line: 8,
            column: 49
          },
          end: {
            line: 19,
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
            column: 30
          },
          end: {
            line: 18,
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
            line: 9,
            column: 54
          },
          end: {
            line: 9,
            column: 116
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 9,
            column: 72
          },
          end: {
            line: 9,
            column: 111
          }
        }, {
          start: {
            line: 9,
            column: 114
          },
          end: {
            line: 9,
            column: 116
          }
        }],
        line: 9
      },
      "1": {
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
      },
      "2": {
        loc: {
          start: {
            line: 16,
            column: 17
          },
          end: {
            line: 16,
            column: 29
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 16,
            column: 17
          },
          end: {
            line: 16,
            column: 23
          }
        }, {
          start: {
            line: 16,
            column: 27
          },
          end: {
            line: 16,
            column: 29
          }
        }],
        line: 16
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "30be7fb393c788ad4e85c71340438cb0aaa50d35"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_jkd4cxdc9 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_jkd4cxdc9();

/**
 * Asynchrounously determines if the staging area is clean
 */
function isClean(repoPath, done, stageAllFiles) {
  cov_jkd4cxdc9().f[0]++;
  cov_jkd4cxdc9().s[0]++;
  (0, _child_process.exec)(`git diff --cached --no-ext-diff --name-only ${!!stageAllFiles ? (cov_jkd4cxdc9().b[0][0]++, '&& git diff --no-ext-diff --name-only') : (cov_jkd4cxdc9().b[0][1]++, '')}`, {
    maxBuffer: Infinity,
    cwd: repoPath
  }, function (error, stdout) {
    cov_jkd4cxdc9().f[1]++;
    cov_jkd4cxdc9().s[1]++;

    if (error) {
      cov_jkd4cxdc9().b[1][0]++;
      cov_jkd4cxdc9().s[2]++;
      return done(error);
    } else {
      cov_jkd4cxdc9().b[1][1]++;
    }

    let output = (cov_jkd4cxdc9().s[3]++, (cov_jkd4cxdc9().b[2][0]++, stdout) || (cov_jkd4cxdc9().b[2][1]++, ''));
    cov_jkd4cxdc9().s[4]++;
    done(null, output.trim().length === 0);
  });
}