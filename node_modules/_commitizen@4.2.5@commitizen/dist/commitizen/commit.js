"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _cachedir = _interopRequireDefault(require("cachedir"));

var _fsExtra = require("fs-extra");

var _git = require("../git");

var cache = _interopRequireWildcard(require("./cache"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cov_g0ukcvuof() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/commitizen/commit.js";
  var hash = "4a518579188a2aabf17606ae1fd56644666d7e1b";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/commitizen/commit.js",
    statementMap: {
      "0": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 17,
          column: 7
        }
      },
      "1": {
        start: {
          line: 16,
          column: 6
        },
        end: {
          line: 16,
          column: 28
        }
      },
      "2": {
        start: {
          line: 24,
          column: 23
        },
        end: {
          line: 24,
          column: 45
        }
      },
      "3": {
        start: {
          line: 25,
          column: 18
        },
        end: {
          line: 25,
          column: 62
        }
      },
      "4": {
        start: {
          line: 27,
          column: 2
        },
        end: {
          line: 66,
          column: 5
        }
      },
      "5": {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 65,
          column: 5
        }
      },
      "6": {
        start: {
          line: 29,
          column: 6
        },
        end: {
          line: 29,
          column: 75
        }
      },
      "7": {
        start: {
          line: 32,
          column: 6
        },
        end: {
          line: 64,
          column: 7
        }
      },
      "8": {
        start: {
          line: 34,
          column: 8
        },
        end: {
          line: 34,
          column: 53
        }
      },
      "9": {
        start: {
          line: 42,
          column: 12
        },
        end: {
          line: 42,
          column: 56
        }
      },
      "10": {
        start: {
          line: 43,
          column: 8
        },
        end: {
          line: 43,
          column: 93
        }
      },
      "11": {
        start: {
          line: 47,
          column: 8
        },
        end: {
          line: 63,
          column: 11
        }
      },
      "12": {
        start: {
          line: 50,
          column: 10
        },
        end: {
          line: 54,
          column: 11
        }
      },
      "13": {
        start: {
          line: 51,
          column: 12
        },
        end: {
          line: 51,
          column: 39
        }
      },
      "14": {
        start: {
          line: 52,
          column: 12
        },
        end: {
          line: 52,
          column: 29
        }
      },
      "15": {
        start: {
          line: 53,
          column: 12
        },
        end: {
          line: 53,
          column: 25
        }
      },
      "16": {
        start: {
          line: 56,
          column: 10
        },
        end: {
          line: 58,
          column: 11
        }
      },
      "17": {
        start: {
          line: 57,
          column: 12
        },
        end: {
          line: 57,
          column: 31
        }
      },
      "18": {
        start: {
          line: 61,
          column: 10
        },
        end: {
          line: 61,
          column: 95
        }
      },
      "19": {
        start: {
          line: 62,
          column: 10
        },
        end: {
          line: 62,
          column: 80
        }
      }
    },
    fnMap: {
      "0": {
        name: "dispatchGitCommit",
        decl: {
          start: {
            line: 13,
            column: 9
          },
          end: {
            line: 13,
            column: 26
          }
        },
        loc: {
          start: {
            line: 13,
            column: 80
          },
          end: {
            line: 18,
            column: 1
          }
        },
        line: 13
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 15,
            column: 70
          },
          end: {
            line: 15,
            column: 71
          }
        },
        loc: {
          start: {
            line: 15,
            column: 87
          },
          end: {
            line: 17,
            column: 5
          }
        },
        line: 15
      },
      "2": {
        name: "commit",
        decl: {
          start: {
            line: 23,
            column: 9
          },
          end: {
            line: 23,
            column: 15
          }
        },
        loc: {
          start: {
            line: 23,
            column: 62
          },
          end: {
            line: 68,
            column: 1
          }
        },
        line: 23
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 27,
            column: 28
          },
          end: {
            line: 27,
            column: 29
          }
        },
        loc: {
          start: {
            line: 27,
            column: 45
          },
          end: {
            line: 66,
            column: 3
          }
        },
        line: 27
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 47,
            column: 27
          },
          end: {
            line: 47,
            column: 28
          }
        },
        loc: {
          start: {
            line: 47,
            column: 71
          },
          end: {
            line: 63,
            column: 9
          }
        },
        line: 47
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 65,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 65,
            column: 5
          }
        }, {
          start: {
            line: 31,
            column: 11
          },
          end: {
            line: 65,
            column: 5
          }
        }],
        line: 28
      },
      "1": {
        loc: {
          start: {
            line: 32,
            column: 6
          },
          end: {
            line: 64,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 32,
            column: 6
          },
          end: {
            line: 64,
            column: 7
          }
        }, {
          start: {
            line: 45,
            column: 13
          },
          end: {
            line: 64,
            column: 7
          }
        }],
        line: 32
      },
      "2": {
        loc: {
          start: {
            line: 50,
            column: 10
          },
          end: {
            line: 54,
            column: 11
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 50,
            column: 10
          },
          end: {
            line: 54,
            column: 11
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
        line: 50
      },
      "3": {
        loc: {
          start: {
            line: 56,
            column: 10
          },
          end: {
            line: 58,
            column: 11
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 56,
            column: 10
          },
          end: {
            line: 58,
            column: 11
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
        line: 56
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
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "4a518579188a2aabf17606ae1fd56644666d7e1b"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_g0ukcvuof = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_g0ukcvuof();

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = commit;
/**
 * Takes all of the final inputs needed in order to make dispatch a git commit
 */

exports.default = _default;

function dispatchGitCommit(repoPath, template, options, overrideOptions, done) {
  cov_g0ukcvuof().f[0]++;
  cov_g0ukcvuof().s[0]++;
  // Commit the user input -- side effect that we'll test
  (0, _git.commit)(repoPath, template, _objectSpread(_objectSpread({}, options), overrideOptions), function (error) {
    cov_g0ukcvuof().f[1]++;
    cov_g0ukcvuof().s[1]++;
    done(error, template);
  });
}
/**
 * Asynchronously commits files using commitizen
 */


function commit(inquirer, repoPath, prompter, options, done) {
  cov_g0ukcvuof().f[2]++;
  var cacheDirectory = (cov_g0ukcvuof().s[2]++, (0, _cachedir.default)('commitizen'));
  var cachePath = (cov_g0ukcvuof().s[3]++, _path.default.join(cacheDirectory, 'commitizen.json'));
  cov_g0ukcvuof().s[4]++;
  (0, _fsExtra.ensureDir)(cacheDirectory, function (error) {
    cov_g0ukcvuof().f[3]++;
    cov_g0ukcvuof().s[5]++;

    if (error) {
      cov_g0ukcvuof().b[0][0]++;
      cov_g0ukcvuof().s[6]++;
      console.error("Couldn't create commitizen cache directory: ", error); // TODO: properly handle error?
    } else {
      cov_g0ukcvuof().b[0][1]++;
      cov_g0ukcvuof().s[7]++;

      if (options.retryLastCommit) {
        cov_g0ukcvuof().b[1][0]++;
        cov_g0ukcvuof().s[8]++;
        console.log('Retrying last commit attempt.'); // We want to use the last commit instead of the current commit,
        // so lets override some options using the values from cache.

        let {
          options: retryOptions,
          overrideOptions: retryOverrideOptions,
          template: retryTemplate
        } = (cov_g0ukcvuof().s[9]++, cache.getCacheValueSync(cachePath, repoPath));
        cov_g0ukcvuof().s[10]++;
        dispatchGitCommit(repoPath, retryTemplate, retryOptions, retryOverrideOptions, done);
      } else {
        cov_g0ukcvuof().b[1][1]++;
        cov_g0ukcvuof().s[11]++;
        // Get user input -- side effect that is hard to test
        prompter(inquirer, function (error, template, overrideOptions) {
          cov_g0ukcvuof().f[4]++;
          cov_g0ukcvuof().s[12]++;

          // Allow adapters to error out
          // (error: Error?, template: String, overrideOptions: Object)
          if (!(error instanceof Error)) {
            cov_g0ukcvuof().b[2][0]++;
            cov_g0ukcvuof().s[13]++;
            overrideOptions = template;
            cov_g0ukcvuof().s[14]++;
            template = error;
            cov_g0ukcvuof().s[15]++;
            error = null;
          } else {
            cov_g0ukcvuof().b[2][1]++;
          }

          cov_g0ukcvuof().s[16]++;

          if (error) {
            cov_g0ukcvuof().b[3][0]++;
            cov_g0ukcvuof().s[17]++;
            return done(error);
          } else {
            cov_g0ukcvuof().b[3][1]++;
          } // We don't want to add retries to the cache, only actual commands


          cov_g0ukcvuof().s[18]++;
          cache.setCacheValueSync(cachePath, repoPath, {
            template,
            options,
            overrideOptions
          });
          cov_g0ukcvuof().s[19]++;
          dispatchGitCommit(repoPath, template, options, overrideOptions, done);
        });
      }
    }
  });
}