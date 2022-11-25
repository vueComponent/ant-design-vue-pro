"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParsedJsonFromFile = getParsedJsonFromFile;
exports.getParsedPackageJsonFromPath = getParsedPackageJsonFromPath;
exports.isFunction = isFunction;
exports.isInTest = isInTest;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cov_pg9gkzupg() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/common/util.js";
  var hash = "443667b7bd63169d3e6fa6f728fc86237eaa590b";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/common/util.js",
    statementMap: {
      "0": {
        start: {
          line: 15,
          column: 2
        },
        end: {
          line: 20,
          column: 3
        }
      },
      "1": {
        start: {
          line: 16,
          column: 30
        },
        end: {
          line: 16,
          column: 86
        }
      },
      "2": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 43
        }
      },
      "3": {
        start: {
          line: 19,
          column: 4
        },
        end: {
          line: 19,
          column: 21
        }
      },
      "4": {
        start: {
          line: 27,
          column: 2
        },
        end: {
          line: 27,
          column: 53
        }
      },
      "5": {
        start: {
          line: 34,
          column: 2
        },
        end: {
          line: 43,
          column: 3
        }
      },
      "6": {
        start: {
          line: 36,
          column: 4
        },
        end: {
          line: 36,
          column: 17
        }
      },
      "7": {
        start: {
          line: 37,
          column: 9
        },
        end: {
          line: 43,
          column: 3
        }
      },
      "8": {
        start: {
          line: 38,
          column: 4
        },
        end: {
          line: 38,
          column: 17
        }
      },
      "9": {
        start: {
          line: 40,
          column: 18
        },
        end: {
          line: 40,
          column: 20
        }
      },
      "10": {
        start: {
          line: 41,
          column: 23
        },
        end: {
          line: 41,
          column: 61
        }
      },
      "11": {
        start: {
          line: 42,
          column: 4
        },
        end: {
          line: 42,
          column: 114
        }
      },
      "12": {
        start: {
          line: 47,
          column: 2
        },
        end: {
          line: 47,
          column: 41
        }
      }
    },
    fnMap: {
      "0": {
        name: "getParsedJsonFromFile",
        decl: {
          start: {
            line: 14,
            column: 9
          },
          end: {
            line: 14,
            column: 30
          }
        },
        loc: {
          start: {
            line: 14,
            column: 71
          },
          end: {
            line: 21,
            column: 1
          }
        },
        line: 14
      },
      "1": {
        name: "getParsedPackageJsonFromPath",
        decl: {
          start: {
            line: 26,
            column: 9
          },
          end: {
            line: 26,
            column: 37
          }
        },
        loc: {
          start: {
            line: 26,
            column: 45
          },
          end: {
            line: 28,
            column: 1
          }
        },
        line: 26
      },
      "2": {
        name: "isFunction",
        decl: {
          start: {
            line: 33,
            column: 9
          },
          end: {
            line: 33,
            column: 19
          }
        },
        loc: {
          start: {
            line: 33,
            column: 38
          },
          end: {
            line: 44,
            column: 1
          }
        },
        line: 33
      },
      "3": {
        name: "isInTest",
        decl: {
          start: {
            line: 46,
            column: 9
          },
          end: {
            line: 46,
            column: 17
          }
        },
        loc: {
          start: {
            line: 46,
            column: 21
          },
          end: {
            line: 48,
            column: 1
          }
        },
        line: 46
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 14,
            column: 52
          },
          end: {
            line: 14,
            column: 69
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 14,
            column: 63
          },
          end: {
            line: 14,
            column: 69
          }
        }],
        line: 14
      },
      "1": {
        loc: {
          start: {
            line: 34,
            column: 2
          },
          end: {
            line: 43,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 34,
            column: 2
          },
          end: {
            line: 43,
            column: 3
          }
        }, {
          start: {
            line: 37,
            column: 9
          },
          end: {
            line: 43,
            column: 3
          }
        }],
        line: 34
      },
      "2": {
        loc: {
          start: {
            line: 37,
            column: 9
          },
          end: {
            line: 43,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 37,
            column: 9
          },
          end: {
            line: 43,
            column: 3
          }
        }, {
          start: {
            line: 39,
            column: 9
          },
          end: {
            line: 43,
            column: 3
          }
        }],
        line: 37
      },
      "3": {
        loc: {
          start: {
            line: 42,
            column: 11
          },
          end: {
            line: 42,
            column: 113
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 42,
            column: 11
          },
          end: {
            line: 42,
            column: 26
          }
        }, {
          start: {
            line: 42,
            column: 31
          },
          end: {
            line: 42,
            column: 67
          }
        }, {
          start: {
            line: 42,
            column: 71
          },
          end: {
            line: 42,
            column: 112
          }
        }],
        line: 42
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
      "11": 0,
      "12": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0
    },
    b: {
      "0": [0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "443667b7bd63169d3e6fa6f728fc86237eaa590b"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_pg9gkzupg = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_pg9gkzupg();

/**
 * Gets the parsed contents of a json file
 */
function getParsedJsonFromFile(filePath, fileName, encoding = (cov_pg9gkzupg().b[0][0]++, 'utf8')) {
  cov_pg9gkzupg().f[0]++;
  cov_pg9gkzupg().s[0]++;

  try {
    var packageJsonContents = (cov_pg9gkzupg().s[1]++, _fs.default.readFileSync(_path.default.join(filePath, fileName), encoding));
    cov_pg9gkzupg().s[2]++;
    return JSON.parse(packageJsonContents);
  } catch (e) {
    cov_pg9gkzupg().s[3]++;
    console.error(e);
  }
}
/**
 * A helper method for getting the contents of package.json at a given path
 */


function getParsedPackageJsonFromPath(path) {
  cov_pg9gkzupg().f[1]++;
  cov_pg9gkzupg().s[4]++;
  return getParsedJsonFromFile(path, 'package.json');
}
/**
 * Test if the passed argument is a function
 */


function isFunction(functionToCheck) {
  cov_pg9gkzupg().f[2]++;
  cov_pg9gkzupg().s[5]++;

  if (typeof functionToCheck === "undefined") {
    cov_pg9gkzupg().b[1][0]++;
    cov_pg9gkzupg().s[6]++;
    return false;
  } else {
    cov_pg9gkzupg().b[1][1]++;
    cov_pg9gkzupg().s[7]++;

    if (functionToCheck === null) {
      cov_pg9gkzupg().b[2][0]++;
      cov_pg9gkzupg().s[8]++;
      return false;
    } else {
      cov_pg9gkzupg().b[2][1]++;
      var getType = (cov_pg9gkzupg().s[9]++, {});
      var functionType = (cov_pg9gkzupg().s[10]++, getType.toString.call(functionToCheck));
      cov_pg9gkzupg().s[11]++;
      return (cov_pg9gkzupg().b[3][0]++, functionToCheck) && ((cov_pg9gkzupg().b[3][1]++, functionType === '[object Function]') || (cov_pg9gkzupg().b[3][2]++, functionType === '[object AsyncFunction]'));
    }
  }
}

function isInTest() {
  cov_pg9gkzupg().f[3]++;
  cov_pg9gkzupg().s[12]++;
  return typeof global.it === 'function';
}