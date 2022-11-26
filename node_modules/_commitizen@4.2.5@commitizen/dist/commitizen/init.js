"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _child_process = _interopRequireDefault(require("child_process"));

var _path = _interopRequireDefault(require("path"));

var configLoader = _interopRequireWildcard(require("./configLoader"));

var adapter = _interopRequireWildcard(require("./adapter"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cov_1ss29zpusr() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/commitizen/init.js";
  var hash = "e4f46936046367f86f542d40fc45a41f7f10a7af";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/commitizen/init.js",
    statementMap: {
      "0": {
        start: {
          line: 12,
          column: 4
        },
        end: {
          line: 12,
          column: 11
        }
      },
      "1": {
        start: {
          line: 16,
          column: 17
        },
        end: {
          line: 16,
          column: 63
        }
      },
      "2": {
        start: {
          line: 35,
          column: 27
        },
        end: {
          line: 46,
          column: 1
        }
      },
      "3": {
        start: {
          line: 63,
          column: 2
        },
        end: {
          line: 63,
          column: 51
        }
      },
      "4": {
        start: {
          line: 66,
          column: 22
        },
        end: {
          line: 66,
          column: 49
        }
      },
      "5": {
        start: {
          line: 69,
          column: 23
        },
        end: {
          line: 69,
          column: 136
        }
      },
      "6": {
        start: {
          line: 72,
          column: 30
        },
        end: {
          line: 72,
          column: 165
        }
      },
      "7": {
        start: {
          line: 74,
          column: 33
        },
        end: {
          line: 74,
          column: 164
        }
      },
      "8": {
        start: {
          line: 77,
          column: 2
        },
        end: {
          line: 85,
          column: 3
        }
      },
      "9": {
        start: {
          line: 78,
          column: 4
        },
        end: {
          line: 84,
          column: 7
        }
      },
      "10": {
        start: {
          line: 87,
          column: 2
        },
        end: {
          line: 95,
          column: 3
        }
      },
      "11": {
        start: {
          line: 88,
          column: 4
        },
        end: {
          line: 88,
          column: 68
        }
      },
      "12": {
        start: {
          line: 89,
          column: 4
        },
        end: {
          line: 91,
          column: 5
        }
      },
      "13": {
        start: {
          line: 90,
          column: 6
        },
        end: {
          line: 90,
          column: 73
        }
      },
      "14": {
        start: {
          line: 92,
          column: 4
        },
        end: {
          line: 92,
          column: 63
        }
      },
      "15": {
        start: {
          line: 94,
          column: 4
        },
        end: {
          line: 94,
          column: 21
        }
      },
      "16": {
        start: {
          line: 103,
          column: 2
        },
        end: {
          line: 105,
          column: 3
        }
      },
      "17": {
        start: {
          line: 104,
          column: 4
        },
        end: {
          line: 104,
          column: 59
        }
      },
      "18": {
        start: {
          line: 106,
          column: 2
        },
        end: {
          line: 108,
          column: 3
        }
      },
      "19": {
        start: {
          line: 107,
          column: 4
        },
        end: {
          line: 107,
          column: 77
        }
      },
      "20": {
        start: {
          line: 116,
          column: 15
        },
        end: {
          line: 116,
          column: 43
        }
      },
      "21": {
        start: {
          line: 117,
          column: 2
        },
        end: {
          line: 121,
          column: 3
        }
      },
      "22": {
        start: {
          line: 118,
          column: 4
        },
        end: {
          line: 118,
          column: 18
        }
      }
    },
    fnMap: {
      "0": {
        name: "init",
        decl: {
          start: {
            line: 51,
            column: 9
          },
          end: {
            line: 51,
            column: 13
          }
        },
        loc: {
          start: {
            line: 60,
            column: 24
          },
          end: {
            line: 96,
            column: 1
          }
        },
        line: 60
      },
      "1": {
        name: "checkRequiredArguments",
        decl: {
          start: {
            line: 102,
            column: 9
          },
          end: {
            line: 102,
            column: 31
          }
        },
        loc: {
          start: {
            line: 102,
            column: 55
          },
          end: {
            line: 109,
            column: 1
          }
        },
        line: 102
      },
      "2": {
        name: "loadAdapterConfig",
        decl: {
          start: {
            line: 115,
            column: 9
          },
          end: {
            line: 115,
            column: 26
          }
        },
        loc: {
          start: {
            line: 115,
            column: 33
          },
          end: {
            line: 122,
            column: 1
          }
        },
        line: 115
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 51,
            column: 41
          },
          end: {
            line: 60,
            column: 22
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 60,
            column: 4
          },
          end: {
            line: 60,
            column: 22
          }
        }],
        line: 51
      },
      "1": {
        loc: {
          start: {
            line: 52,
            column: 2
          },
          end: {
            line: 52,
            column: 14
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 52,
            column: 9
          },
          end: {
            line: 52,
            column: 14
          }
        }],
        line: 52
      },
      "2": {
        loc: {
          start: {
            line: 53,
            column: 2
          },
          end: {
            line: 53,
            column: 16
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 53,
            column: 12
          },
          end: {
            line: 53,
            column: 16
          }
        }],
        line: 53
      },
      "3": {
        loc: {
          start: {
            line: 54,
            column: 2
          },
          end: {
            line: 54,
            column: 19
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 54,
            column: 14
          },
          end: {
            line: 54,
            column: 19
          }
        }],
        line: 54
      },
      "4": {
        loc: {
          start: {
            line: 55,
            column: 2
          },
          end: {
            line: 55,
            column: 15
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 55,
            column: 10
          },
          end: {
            line: 55,
            column: 15
          }
        }],
        line: 55
      },
      "5": {
        loc: {
          start: {
            line: 56,
            column: 2
          },
          end: {
            line: 56,
            column: 14
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 56,
            column: 9
          },
          end: {
            line: 56,
            column: 14
          }
        }],
        line: 56
      },
      "6": {
        loc: {
          start: {
            line: 57,
            column: 2
          },
          end: {
            line: 57,
            column: 13
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 57,
            column: 8
          },
          end: {
            line: 57,
            column: 13
          }
        }],
        line: 57
      },
      "7": {
        loc: {
          start: {
            line: 58,
            column: 2
          },
          end: {
            line: 58,
            column: 15
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 58,
            column: 10
          },
          end: {
            line: 58,
            column: 15
          }
        }],
        line: 58
      },
      "8": {
        loc: {
          start: {
            line: 59,
            column: 2
          },
          end: {
            line: 59,
            column: 27
          }
        },
        type: "default-arg",
        locations: [{
          start: {
            line: 59,
            column: 22
          },
          end: {
            line: 59,
            column: 27
          }
        }],
        line: 59
      },
      "9": {
        loc: {
          start: {
            line: 69,
            column: 23
          },
          end: {
            line: 69,
            column: 136
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 69,
            column: 30
          },
          end: {
            line: 69,
            column: 73
          }
        }, {
          start: {
            line: 69,
            column: 76
          },
          end: {
            line: 69,
            column: 136
          }
        }],
        line: 69
      },
      "10": {
        loc: {
          start: {
            line: 72,
            column: 30
          },
          end: {
            line: 72,
            column: 165
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 72,
            column: 37
          },
          end: {
            line: 72,
            column: 98
          }
        }, {
          start: {
            line: 72,
            column: 101
          },
          end: {
            line: 72,
            column: 165
          }
        }],
        line: 72
      },
      "11": {
        loc: {
          start: {
            line: 74,
            column: 33
          },
          end: {
            line: 74,
            column: 164
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 74,
            column: 40
          },
          end: {
            line: 74,
            column: 99
          }
        }, {
          start: {
            line: 74,
            column: 102
          },
          end: {
            line: 74,
            column: 164
          }
        }],
        line: 74
      },
      "12": {
        loc: {
          start: {
            line: 77,
            column: 2
          },
          end: {
            line: 85,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 77,
            column: 2
          },
          end: {
            line: 85,
            column: 3
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
        line: 77
      },
      "13": {
        loc: {
          start: {
            line: 77,
            column: 6
          },
          end: {
            line: 77,
            column: 84
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 77,
            column: 6
          },
          end: {
            line: 77,
            column: 19
          }
        }, {
          start: {
            line: 77,
            column: 23
          },
          end: {
            line: 77,
            column: 41
          }
        }, {
          start: {
            line: 77,
            column: 45
          },
          end: {
            line: 77,
            column: 74
          }
        }, {
          start: {
            line: 77,
            column: 78
          },
          end: {
            line: 77,
            column: 84
          }
        }],
        line: 77
      },
      "14": {
        loc: {
          start: {
            line: 89,
            column: 4
          },
          end: {
            line: 91,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 89,
            column: 4
          },
          end: {
            line: 91,
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
        line: 89
      },
      "15": {
        loc: {
          start: {
            line: 103,
            column: 2
          },
          end: {
            line: 105,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 103,
            column: 2
          },
          end: {
            line: 105,
            column: 3
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
        line: 103
      },
      "16": {
        loc: {
          start: {
            line: 106,
            column: 2
          },
          end: {
            line: 108,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 106,
            column: 2
          },
          end: {
            line: 108,
            column: 3
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
        line: 106
      },
      "17": {
        loc: {
          start: {
            line: 117,
            column: 2
          },
          end: {
            line: 121,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 117,
            column: 2
          },
          end: {
            line: 121,
            column: 3
          }
        }, {
          start: {
            line: 119,
            column: 9
          },
          end: {
            line: 121,
            column: 3
          }
        }],
        line: 117
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
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    b: {
      "0": [0],
      "1": [0],
      "2": [0],
      "3": [0],
      "4": [0],
      "5": [0],
      "6": [0],
      "7": [0],
      "8": [0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0, 0],
      "13": [0, 0, 0, 0],
      "14": [0, 0],
      "15": [0, 0],
      "16": [0, 0],
      "17": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "e4f46936046367f86f542d40fc45a41f7f10a7af"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1ss29zpusr = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1ss29zpusr();
let {
  addPathToAdapterConfig,
  generateNpmInstallAdapterCommand,
  getNpmInstallStringMappings,
  generateYarnAddAdapterCommand,
  getYarnAddStringMappings
} = (cov_1ss29zpusr().s[0]++, adapter);
var _default = init;
exports.default = _default;
const CLI_PATH = (cov_1ss29zpusr().s[1]++, _path.default.normalize(_path.default.join(__dirname, '../../')));
/**
 * CZ INIT
 *
 * Init is generally responsible for initializing an adapter in
 * a user's project. The goal is to be able to run
 * `commitizen init` and be prompted for certain fields which
 * will help you install the proper adapter for your project.
 *
 * Init does not actually create the adapter (it defers to adapter
 * for this). Instead, it is specifically designed to help gather
 * and validate the information needed to install the adapter
 * properly without interfering with a previous adapter config.
 */

/**
 * The defaults for init
 */

const defaultInitOptions = (cov_1ss29zpusr().s[2]++, {
  save: false,
  saveDev: true,
  saveExact: false,
  force: false,
  // for --yarn use
  // @see https://github.com/commitizen/cz-cli/issues/527#issuecomment-392653897
  yarn: false,
  dev: true,
  exact: false // should add trailing comma, thus next developer doesn't got blamed for this line

});
/**
 * Runs npm install for the adapter then modifies the config.commitizen as needed
 */

function init(repoPath, adapterNpmName, {
  save = (cov_1ss29zpusr().b[1][0]++, false),
  saveDev = (cov_1ss29zpusr().b[2][0]++, true),
  saveExact = (cov_1ss29zpusr().b[3][0]++, false),
  force = (cov_1ss29zpusr().b[4][0]++, false),
  yarn = (cov_1ss29zpusr().b[5][0]++, false),
  dev = (cov_1ss29zpusr().b[6][0]++, false),
  exact = (cov_1ss29zpusr().b[7][0]++, false),
  includeCommitizen = (cov_1ss29zpusr().b[8][0]++, false)
} = (cov_1ss29zpusr().b[0][0]++, defaultInitOptions)) {
  cov_1ss29zpusr().f[0]++;
  cov_1ss29zpusr().s[3]++;
  // Don't let things move forward if required args are missing
  checkRequiredArguments(repoPath, adapterNpmName); // Load the current adapter config

  let adapterConfig = (cov_1ss29zpusr().s[4]++, loadAdapterConfig(repoPath)); // Get the npm string mappings based on the arguments provided

  let stringMappings = (cov_1ss29zpusr().s[5]++, yarn ? (cov_1ss29zpusr().b[9][0]++, getYarnAddStringMappings(dev, exact, force)) : (cov_1ss29zpusr().b[9][1]++, getNpmInstallStringMappings(save, saveDev, saveExact, force))); // Generate a string that represents the npm install command

  let installAdapterCommand = (cov_1ss29zpusr().s[6]++, yarn ? (cov_1ss29zpusr().b[10][0]++, generateYarnAddAdapterCommand(stringMappings, adapterNpmName)) : (cov_1ss29zpusr().b[10][1]++, generateNpmInstallAdapterCommand(stringMappings, adapterNpmName)));
  let installCommitizenCommand = (cov_1ss29zpusr().s[7]++, yarn ? (cov_1ss29zpusr().b[11][0]++, generateYarnAddAdapterCommand(stringMappings, "commitizen")) : (cov_1ss29zpusr().b[11][1]++, generateNpmInstallAdapterCommand(stringMappings, "commitizen"))); // Check for previously installed adapters

  cov_1ss29zpusr().s[8]++;

  if ((cov_1ss29zpusr().b[13][0]++, adapterConfig) && (cov_1ss29zpusr().b[13][1]++, adapterConfig.path) && (cov_1ss29zpusr().b[13][2]++, adapterConfig.path.length > 0) && (cov_1ss29zpusr().b[13][3]++, !force)) {
    cov_1ss29zpusr().b[12][0]++;
    cov_1ss29zpusr().s[9]++;
    throw new Error(`A previous adapter is already configured. Use --force to override
    adapterConfig.path: ${adapterConfig.path}
    repoPath: ${repoPath}
    CLI_PATH: ${CLI_PATH}
    installAdapterCommand: ${installAdapterCommand}
    adapterNpmName: ${adapterNpmName}
    `);
  } else {
    cov_1ss29zpusr().b[12][1]++;
  }

  cov_1ss29zpusr().s[10]++;

  try {
    cov_1ss29zpusr().s[11]++;

    _child_process.default.execSync(installAdapterCommand, {
      cwd: repoPath
    });

    cov_1ss29zpusr().s[12]++;

    if (includeCommitizen) {
      cov_1ss29zpusr().b[14][0]++;
      cov_1ss29zpusr().s[13]++;

      _child_process.default.execSync(installCommitizenCommand, {
        cwd: repoPath
      });
    } else {
      cov_1ss29zpusr().b[14][1]++;
    }

    cov_1ss29zpusr().s[14]++;
    addPathToAdapterConfig(CLI_PATH, repoPath, adapterNpmName);
  } catch (e) {
    cov_1ss29zpusr().s[15]++;
    console.error(e);
  }
}
/**
 * Checks to make sure that the required arguments are passed
 * Throws an exception if any are not.
 */


function checkRequiredArguments(path, adapterNpmName) {
  cov_1ss29zpusr().f[1]++;
  cov_1ss29zpusr().s[16]++;

  if (!path) {
    cov_1ss29zpusr().b[15][0]++;
    cov_1ss29zpusr().s[17]++;
    throw new Error("Path is required when running init.");
  } else {
    cov_1ss29zpusr().b[15][1]++;
  }

  cov_1ss29zpusr().s[18]++;

  if (!adapterNpmName) {
    cov_1ss29zpusr().b[16][0]++;
    cov_1ss29zpusr().s[19]++;
    throw new Error("The adapter's npm name is required when running init.");
  } else {
    cov_1ss29zpusr().b[16][1]++;
  }
}
/**
 * CONFIG
 * Loads and returns the adapter config at key config.commitizen, if it exists
 */


function loadAdapterConfig(cwd) {
  cov_1ss29zpusr().f[2]++;
  let config = (cov_1ss29zpusr().s[20]++, configLoader.load(null, cwd));
  cov_1ss29zpusr().s[21]++;

  if (config) {
    cov_1ss29zpusr().b[17][0]++;
    cov_1ss29zpusr().s[22]++;
    return config;
  } else {
    cov_1ss29zpusr().b[17][1]++;
  }
}