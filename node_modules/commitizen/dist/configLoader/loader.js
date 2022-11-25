"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _configLoader = require("../configLoader");

var _util = require("../common/util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cov_aqt8wzdi9() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/configLoader/loader.js";
  var hash = "4c4dccab67b6ecaa244de00bc5a7718df1c2c5ea";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/configLoader/loader.js",
    statementMap: {
      "0": {
        start: {
          line: 22,
          column: 20
        },
        end: {
          line: 22,
          column: 40
        }
      },
      "1": {
        start: {
          line: 25,
          column: 4
        },
        end: {
          line: 27,
          column: 5
        }
      },
      "2": {
        start: {
          line: 26,
          column: 8
        },
        end: {
          line: 26,
          column: 45
        }
      },
      "3": {
        start: {
          line: 29,
          column: 4
        },
        end: {
          line: 37,
          column: 6
        }
      },
      "4": {
        start: {
          line: 31,
          column: 12
        },
        end: {
          line: 33,
          column: 13
        }
      },
      "5": {
        start: {
          line: 35,
          column: 12
        },
        end: {
          line: 35,
          column: 24
        }
      },
      "6": {
        start: {
          line: 39,
          column: 4
        },
        end: {
          line: 41,
          column: 5
        }
      },
      "7": {
        start: {
          line: 40,
          column: 8
        },
        end: {
          line: 40,
          column: 23
        }
      },
      "8": {
        start: {
          line: 43,
          column: 4
        },
        end: {
          line: 59,
          column: 5
        }
      }
    },
    fnMap: {
      "0": {
        name: "loader",
        decl: {
          start: {
            line: 20,
            column: 9
          },
          end: {
            line: 20,
            column: 15
          }
        },
        loc: {
          start: {
            line: 20,
            column: 39
          },
          end: {
            line: 60,
            column: 1
          }
        },
        line: 20
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 30,
            column: 58
          },
          end: {
            line: 30,
            column: 59
          }
        },
        loc: {
          start: {
            line: 30,
            column: 80
          },
          end: {
            line: 36,
            column: 9
          }
        },
        line: 30
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 22,
            column: 20
          },
          end: {
            line: 22,
            column: 40
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 22,
            column: 20
          },
          end: {
            line: 22,
            column: 23
          }
        }, {
          start: {
            line: 22,
            column: 27
          },
          end: {
            line: 22,
            column: 40
          }
        }],
        line: 22
      },
      "1": {
        loc: {
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 27,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 27,
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
        line: 25
      },
      "2": {
        loc: {
          start: {
            line: 31,
            column: 12
          },
          end: {
            line: 33,
            column: 13
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 31,
            column: 12
          },
          end: {
            line: 33,
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
        line: 31
      },
      "3": {
        loc: {
          start: {
            line: 39,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 39,
            column: 4
          },
          end: {
            line: 41,
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
        line: 39
      },
      "4": {
        loc: {
          start: {
            line: 43,
            column: 4
          },
          end: {
            line: 59,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: undefined,
            column: undefined
          },
          end: {
            line: undefined,
            column: undefined
          }
        }],
        line: 43
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
      "8": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "4c4dccab67b6ecaa244de00bc5a7718df1c2c5ea"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_aqt8wzdi9 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_aqt8wzdi9();
var _default = loader;
/**
 * Command line config helpers
 * Shamelessly ripped from with slight modifications:
 * https://github.com/jscs-dev/node-jscs/blob/master/lib/cli-config.js
 */

/**
 * Get content of the configuration file
 * @param {String} config - partial path to configuration file
 * @param {String} [cwd = process.cwd()] - directory path which will be joined with config argument
 * @return {Object|undefined}
 */

exports.default = _default;

function loader(configs, config, cwd) {
  cov_aqt8wzdi9().f[0]++;
  var content;
  var directory = (cov_aqt8wzdi9().s[0]++, (cov_aqt8wzdi9().b[0][0]++, cwd) || (cov_aqt8wzdi9().b[0][1]++, process.cwd())); // If config option is given, attempt to load it

  cov_aqt8wzdi9().s[1]++;

  if (config) {
    cov_aqt8wzdi9().b[1][0]++;
    cov_aqt8wzdi9().s[2]++;
    return (0, _configLoader.getContent)(config, directory);
  } else {
    cov_aqt8wzdi9().b[1][1]++;
  }

  cov_aqt8wzdi9().s[3]++;
  content = (0, _configLoader.getContent)((0, _configLoader.findup)(configs, {
    nocase: true,
    cwd: directory
  }, function (configPath) {
    cov_aqt8wzdi9().f[1]++;
    cov_aqt8wzdi9().s[4]++;

    if (_path.default.basename(configPath) === 'package.json') {// return !!this.getContent(configPath);

      cov_aqt8wzdi9().b[2][0]++;
    } else {
      cov_aqt8wzdi9().b[2][1]++;
    }

    cov_aqt8wzdi9().s[5]++;
    return true;
  }));
  cov_aqt8wzdi9().s[6]++;

  if (content) {
    cov_aqt8wzdi9().b[3][0]++;
    cov_aqt8wzdi9().s[7]++;
    return content;
  } else {
    cov_aqt8wzdi9().b[3][1]++;
  }
  /* istanbul ignore if */


  cov_aqt8wzdi9().s[8]++;

  if (!(0, _util.isInTest)()) {
    // Try to load standard configs from home dir
    var directoryArr = [process.env.USERPROFILE, process.env.HOMEPATH, process.env.HOME];

    for (var i = 0, dirLen = directoryArr.length; i < dirLen; i++) {
      if (!directoryArr[i]) {
        continue;
      }

      for (var j = 0, len = configs.length; j < len; j++) {
        content = (0, _configLoader.getContent)(configs[j], directoryArr[i]);

        if (content) {
          return content;
        }
      }
    }
  } else {
    cov_aqt8wzdi9().b[4][0]++;
  }
}