"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _glob = _interopRequireDefault(require("glob"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cov_wjwib8bhg() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/configLoader/findup.js";
  var hash = "6f6cc99ed279f909c532154d9f66555fb82a2d2a";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/configLoader/findup.js",
    statementMap: {
      "0": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 37
        }
      },
      "1": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 15,
          column: 25
        }
      },
      "2": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 44
        }
      },
      "3": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 33,
          column: 39
        }
      },
      "4": {
        start: {
          line: 19,
          column: 8
        },
        end: {
          line: 25,
          column: 14
        }
      },
      "5": {
        start: {
          line: 20,
          column: 29
        },
        end: {
          line: 20,
          column: 59
        }
      },
      "6": {
        start: {
          line: 22,
          column: 12
        },
        end: {
          line: 24,
          column: 13
        }
      },
      "7": {
        start: {
          line: 23,
          column: 16
        },
        end: {
          line: 23,
          column: 62
        }
      },
      "8": {
        start: {
          line: 27,
          column: 8
        },
        end: {
          line: 29,
          column: 9
        }
      },
      "9": {
        start: {
          line: 28,
          column: 12
        },
        end: {
          line: 28,
          column: 48
        }
      },
      "10": {
        start: {
          line: 31,
          column: 8
        },
        end: {
          line: 31,
          column: 31
        }
      },
      "11": {
        start: {
          line: 32,
          column: 8
        },
        end: {
          line: 32,
          column: 54
        }
      }
    },
    fnMap: {
      "0": {
        name: "findup",
        decl: {
          start: {
            line: 8,
            column: 9
          },
          end: {
            line: 8,
            column: 15
          }
        },
        loc: {
          start: {
            line: 8,
            column: 40
          },
          end: {
            line: 34,
            column: 1
          }
        },
        line: 8
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 19,
            column: 31
          },
          end: {
            line: 19,
            column: 32
          }
        },
        loc: {
          start: {
            line: 19,
            column: 50
          },
          end: {
            line: 25,
            column: 9
          }
        },
        line: 19
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 22,
            column: 12
          },
          end: {
            line: 24,
            column: 13
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 22,
            column: 12
          },
          end: {
            line: 24,
            column: 13
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
        line: 22
      },
      "1": {
        loc: {
          start: {
            line: 27,
            column: 8
          },
          end: {
            line: 29,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 27,
            column: 8
          },
          end: {
            line: 29,
            column: 9
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
        line: 27
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "6f6cc99ed279f909c532154d9f66555fb82a2d2a"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_wjwib8bhg = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_wjwib8bhg();
var _default = findup; // Before, "findup-sync" package was used,
// but it does not provide filter callback

exports.default = _default;

function findup(patterns, options, fn) {
  cov_wjwib8bhg().f[0]++;

  /* jshint -W083 */
  var lastpath;
  var file;
  cov_wjwib8bhg().s[0]++;
  options = Object.create(options);
  cov_wjwib8bhg().s[1]++;
  options.maxDepth = 1;
  cov_wjwib8bhg().s[2]++;
  options.cwd = _path.default.resolve(options.cwd);
  cov_wjwib8bhg().s[3]++;

  do {
    cov_wjwib8bhg().s[4]++;
    file = patterns.filter(function (pattern) {
      cov_wjwib8bhg().f[1]++;
      var configPath = (cov_wjwib8bhg().s[5]++, _glob.default.sync(pattern, options)[0]);
      cov_wjwib8bhg().s[6]++;

      if (configPath) {
        cov_wjwib8bhg().b[0][0]++;
        cov_wjwib8bhg().s[7]++;
        return fn(_path.default.join(options.cwd, configPath));
      } else {
        cov_wjwib8bhg().b[0][1]++;
      }
    })[0];
    cov_wjwib8bhg().s[8]++;

    if (file) {
      cov_wjwib8bhg().b[1][0]++;
      cov_wjwib8bhg().s[9]++;
      return _path.default.join(options.cwd, file);
    } else {
      cov_wjwib8bhg().b[1][1]++;
    }

    cov_wjwib8bhg().s[10]++;
    lastpath = options.cwd;
    cov_wjwib8bhg().s[11]++;
    options.cwd = _path.default.resolve(options.cwd, '..');
  } while (options.cwd !== lastpath);
}