"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addPathToAdapterConfig = addPathToAdapterConfig;
exports.generateNpmInstallAdapterCommand = generateNpmInstallAdapterCommand;
exports.generateYarnAddAdapterCommand = generateYarnAddAdapterCommand;
exports.getGitRootPath = getGitRootPath;
exports.getNearestNodeModulesDirectory = getNearestNodeModulesDirectory;
exports.getNearestProjectRootDirectory = getNearestProjectRootDirectory;
exports.getNpmInstallStringMappings = getNpmInstallStringMappings;
exports.getPrompter = getPrompter;
exports.getYarnAddStringMappings = getYarnAddStringMappings;
exports.resolveAdapterPath = resolveAdapterPath;

var _child_process = _interopRequireDefault(require("child_process"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _findNodeModules = _interopRequireDefault(require("find-node-modules"));

var _lodash = _interopRequireDefault(require("lodash"));

var _detectIndent = _interopRequireDefault(require("detect-indent"));

var _util = require("../common/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cov_16lcdpz3tp() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/commitizen/adapter.js";
  var hash = "64a129a685b55284cc7bfdc7f237a0c0a925fd53";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/commitizen/adapter.js",
    statementMap: {
      "0": {
        start: {
          line: 38,
          column: 32
        },
        end: {
          line: 44,
          column: 3
        }
      },
      "1": {
        start: {
          line: 46,
          column: 24
        },
        end: {
          line: 46,
          column: 91
        }
      },
      "2": {
        start: {
          line: 47,
          column: 26
        },
        end: {
          line: 47,
          column: 67
        }
      },
      "3": {
        start: {
          line: 49,
          column: 15
        },
        end: {
          line: 49,
          column: 61
        }
      },
      "4": {
        start: {
          line: 50,
          column: 27
        },
        end: {
          line: 50,
          column: 56
        }
      },
      "5": {
        start: {
          line: 51,
          column: 30
        },
        end: {
          line: 51,
          column: 32
        }
      },
      "6": {
        start: {
          line: 52,
          column: 2
        },
        end: {
          line: 54,
          column: 3
        }
      },
      "7": {
        start: {
          line: 53,
          column: 4
        },
        end: {
          line: 53,
          column: 81
        }
      },
      "8": {
        start: {
          line: 55,
          column: 2
        },
        end: {
          line: 55,
          column: 96
        }
      },
      "9": {
        start: {
          line: 64,
          column: 30
        },
        end: {
          line: 64,
          column: 61
        }
      },
      "10": {
        start: {
          line: 67,
          column: 2
        },
        end: {
          line: 71,
          column: 3
        }
      },
      "11": {
        start: {
          line: 68,
          column: 4
        },
        end: {
          line: 70,
          column: 5
        }
      },
      "12": {
        start: {
          line: 69,
          column: 6
        },
        end: {
          line: 69,
          column: 66
        }
      },
      "13": {
        start: {
          line: 73,
          column: 2
        },
        end: {
          line: 73,
          column: 31
        }
      },
      "14": {
        start: {
          line: 82,
          column: 30
        },
        end: {
          line: 82,
          column: 58
        }
      },
      "15": {
        start: {
          line: 85,
          column: 2
        },
        end: {
          line: 89,
          column: 3
        }
      },
      "16": {
        start: {
          line: 86,
          column: 4
        },
        end: {
          line: 88,
          column: 5
        }
      },
      "17": {
        start: {
          line: 87,
          column: 6
        },
        end: {
          line: 87,
          column: 66
        }
      },
      "18": {
        start: {
          line: 91,
          column: 2
        },
        end: {
          line: 91,
          column: 31
        }
      },
      "19": {
        start: {
          line: 100,
          column: 31
        },
        end: {
          line: 100,
          column: 55
        }
      },
      "20": {
        start: {
          line: 105,
          column: 2
        },
        end: {
          line: 109,
          column: 3
        }
      },
      "21": {
        start: {
          line: 106,
          column: 4
        },
        end: {
          line: 106,
          column: 37
        }
      },
      "22": {
        start: {
          line: 116,
          column: 2
        },
        end: {
          line: 116,
          column: 78
        }
      },
      "23": {
        start: {
          line: 123,
          column: 2
        },
        end: {
          line: 127,
          column: 49
        }
      },
      "24": {
        start: {
          line: 134,
          column: 2
        },
        end: {
          line: 137,
          column: 49
        }
      },
      "25": {
        start: {
          line: 145,
          column: 28
        },
        end: {
          line: 145,
          column: 59
        }
      },
      "26": {
        start: {
          line: 148,
          column: 16
        },
        end: {
          line: 148,
          column: 44
        }
      },
      "27": {
        start: {
          line: 166,
          column: 15
        },
        end: {
          line: 166,
          column: 45
        }
      },
      "28": {
        start: {
          line: 167,
          column: 15
        },
        end: {
          line: 167,
          column: 68
        }
      },
      "29": {
        start: {
          line: 170,
          column: 28
        },
        end: {
          line: 172,
          column: 22
        }
      },
      "30": {
        start: {
          line: 174,
          column: 2
        },
        end: {
          line: 180,
          column: 3
        }
      },
      "31": {
        start: {
          line: 176,
          column: 4
        },
        end: {
          line: 176,
          column: 48
        }
      },
      "32": {
        start: {
          line: 178,
          column: 4
        },
        end: {
          line: 178,
          column: 86
        }
      },
      "33": {
        start: {
          line: 179,
          column: 4
        },
        end: {
          line: 179,
          column: 16
        }
      },
      "34": {
        start: {
          line: 184,
          column: 2
        },
        end: {
          line: 184,
          column: 109
        }
      }
    },
    fnMap: {
      "0": {
        name: "addPathToAdapterConfig",
        decl: {
          start: {
            line: 36,
            column: 9
          },
          end: {
            line: 36,
            column: 31
          }
        },
        loc: {
          start: {
            line: 36,
            column: 68
          },
          end: {
            line: 56,
            column: 1
          }
        },
        line: 36
      },
      "1": {
        name: "generateNpmInstallAdapterCommand",
        decl: {
          start: {
            line: 61,
            column: 9
          },
          end: {
            line: 61,
            column: 41
          }
        },
        loc: {
          start: {
            line: 61,
            column: 75
          },
          end: {
            line: 74,
            column: 1
          }
        },
        line: 61
      },
      "2": {
        name: "generateYarnAddAdapterCommand",
        decl: {
          start: {
            line: 79,
            column: 9
          },
          end: {
            line: 79,
            column: 38
          }
        },
        loc: {
          start: {
            line: 79,
            column: 72
          },
          end: {
            line: 92,
            column: 1
          }
        },
        line: 79
      },
      "3": {
        name: "getNearestNodeModulesDirectory",
        decl: {
          start: {
            line: 97,
            column: 9
          },
          end: {
            line: 97,
            column: 39
          }
        },
        loc: {
          start: {
            line: 97,
            column: 50
          },
          end: {
            line: 110,
            column: 1
          }
        },
        line: 97
      },
      "4": {
        name: "getNearestProjectRootDirectory",
        decl: {
          start: {
            line: 115,
            column: 9
          },
          end: {
            line: 115,
            column: 39
          }
        },
        loc: {
          start: {
            line: 115,
            column: 60
          },
          end: {
            line: 117,
            column: 1
          }
        },
        line: 115
      },
      "5": {
        name: "getNpmInstallStringMappings",
        decl: {
          start: {
            line: 122,
            column: 9
          },
          end: {
            line: 122,
            column: 36
          }
        },
        loc: {
          start: {
            line: 122,
            column: 71
          },
          end: {
            line: 128,
            column: 1
          }
        },
        line: 122
      },
      "6": {
        name: "getYarnAddStringMappings",
        decl: {
          start: {
            line: 133,
            column: 9
          },
          end: {
            line: 133,
            column: 33
          }
        },
        loc: {
          start: {
            line: 133,
            column: 54
          },
          end: {
            line: 138,
            column: 1
          }
        },
        line: 133
      },
      "7": {
        name: "getPrompter",
        decl: {
          start: {
            line: 143,
            column: 9
          },
          end: {
            line: 143,
            column: 20
          }
        },
        loc: {
          start: {
            line: 143,
            column: 35
          },
          end: {
            line: 158,
            column: 1
          }
        },
        line: 143
      },
      "8": {
        name: "resolveAdapterPath",
        decl: {
          start: {
            line: 164,
            column: 9
          },
          end: {
            line: 164,
            column: 27
          }
        },
        loc: {
          start: {
            line: 164,
            column: 49
          },
          end: {
            line: 181,
            column: 1
          }
        },
        line: 164
      },
      "9": {
        name: "getGitRootPath",
        decl: {
          start: {
            line: 183,
            column: 9
          },
          end: {
            line: 183,
            column: 23
          }
        },
        loc: {
          start: {
            line: 183,
            column: 27
          },
          end: {
            line: 185,
            column: 1
          }
        },
        line: 183
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 49,
            column: 15
          },
          end: {
            line: 49,
            column: 61
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 49,
            column: 15
          },
          end: {
            line: 49,
            column: 53
          }
        }, {
          start: {
            line: 49,
            column: 57
          },
          end: {
            line: 49,
            column: 61
          }
        }],
        line: 49
      },
      "1": {
        loc: {
          start: {
            line: 52,
            column: 2
          },
          end: {
            line: 54,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 52,
            column: 2
          },
          end: {
            line: 54,
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
        line: 52
      },
      "2": {
        loc: {
          start: {
            line: 68,
            column: 4
          },
          end: {
            line: 70,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 68,
            column: 4
          },
          end: {
            line: 70,
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
        line: 68
      },
      "3": {
        loc: {
          start: {
            line: 86,
            column: 4
          },
          end: {
            line: 88,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 86,
            column: 4
          },
          end: {
            line: 88,
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
        line: 86
      },
      "4": {
        loc: {
          start: {
            line: 105,
            column: 2
          },
          end: {
            line: 109,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 105,
            column: 2
          },
          end: {
            line: 109,
            column: 3
          }
        }],
        line: 105
      },
      "5": {
        loc: {
          start: {
            line: 105,
            column: 6
          },
          end: {
            line: 105,
            column: 65
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 105,
            column: 6
          },
          end: {
            line: 105,
            column: 28
          }
        }, {
          start: {
            line: 105,
            column: 32
          },
          end: {
            line: 105,
            column: 65
          }
        }],
        line: 105
      },
      "6": {
        loc: {
          start: {
            line: 124,
            column: 17
          },
          end: {
            line: 124,
            column: 58
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 124,
            column: 38
          },
          end: {
            line: 124,
            column: 46
          }
        }, {
          start: {
            line: 124,
            column: 49
          },
          end: {
            line: 124,
            column: 58
          }
        }],
        line: 124
      },
      "7": {
        loc: {
          start: {
            line: 124,
            column: 18
          },
          end: {
            line: 124,
            column: 34
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 124,
            column: 18
          },
          end: {
            line: 124,
            column: 22
          }
        }, {
          start: {
            line: 124,
            column: 26
          },
          end: {
            line: 124,
            column: 34
          }
        }],
        line: 124
      },
      "8": {
        loc: {
          start: {
            line: 125,
            column: 20
          },
          end: {
            line: 125,
            column: 54
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 125,
            column: 30
          },
          end: {
            line: 125,
            column: 42
          }
        }, {
          start: {
            line: 125,
            column: 45
          },
          end: {
            line: 125,
            column: 54
          }
        }],
        line: 125
      },
      "9": {
        loc: {
          start: {
            line: 126,
            column: 22
          },
          end: {
            line: 126,
            column: 60
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 126,
            column: 34
          },
          end: {
            line: 126,
            column: 48
          }
        }, {
          start: {
            line: 126,
            column: 51
          },
          end: {
            line: 126,
            column: 60
          }
        }],
        line: 126
      },
      "10": {
        loc: {
          start: {
            line: 127,
            column: 18
          },
          end: {
            line: 127,
            column: 47
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 127,
            column: 26
          },
          end: {
            line: 127,
            column: 35
          }
        }, {
          start: {
            line: 127,
            column: 38
          },
          end: {
            line: 127,
            column: 47
          }
        }],
        line: 127
      },
      "11": {
        loc: {
          start: {
            line: 135,
            column: 16
          },
          end: {
            line: 135,
            column: 41
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 135,
            column: 22
          },
          end: {
            line: 135,
            column: 29
          }
        }, {
          start: {
            line: 135,
            column: 32
          },
          end: {
            line: 135,
            column: 41
          }
        }],
        line: 135
      },
      "12": {
        loc: {
          start: {
            line: 136,
            column: 18
          },
          end: {
            line: 136,
            column: 47
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 136,
            column: 26
          },
          end: {
            line: 136,
            column: 35
          }
        }, {
          start: {
            line: 136,
            column: 38
          },
          end: {
            line: 136,
            column: 47
          }
        }],
        line: 136
      },
      "13": {
        loc: {
          start: {
            line: 137,
            column: 18
          },
          end: {
            line: 137,
            column: 47
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 137,
            column: 26
          },
          end: {
            line: 137,
            column: 35
          }
        }, {
          start: {
            line: 137,
            column: 38
          },
          end: {
            line: 137,
            column: 47
          }
        }],
        line: 137
      },
      "14": {
        loc: {
          start: {
            line: 167,
            column: 15
          },
          end: {
            line: 167,
            column: 68
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 167,
            column: 15
          },
          end: {
            line: 167,
            column: 36
          }
        }, {
          start: {
            line: 167,
            column: 40
          },
          end: {
            line: 167,
            column: 68
          }
        }],
        line: 167
      },
      "15": {
        loc: {
          start: {
            line: 170,
            column: 28
          },
          end: {
            line: 172,
            column: 22
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 171,
            column: 4
          },
          end: {
            line: 171,
            column: 54
          }
        }, {
          start: {
            line: 172,
            column: 4
          },
          end: {
            line: 172,
            column: 22
          }
        }],
        line: 170
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
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0, 0],
      "13": [0, 0],
      "14": [0, 0],
      "15": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "64a129a685b55284cc7bfdc7f237a0c0a925fd53"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_16lcdpz3tp = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_16lcdpz3tp();

/**
 * ADAPTER
 *
 * Adapter is generally responsible for actually installing adapters to an
 * end user's project. It does not perform checks to determine if there is
 * a previous commitizen adapter installed or if the proper fields were
 * provided. It defers that responsibility to init.
 */

/**
 * Modifies the package.json, sets config.commitizen.path to the path of the adapter
 * Must be passed an absolute path to the cli's root
 */
function addPathToAdapterConfig(cliPath, repoPath, adapterNpmName) {
  cov_16lcdpz3tp().f[0]++;
  let commitizenAdapterConfig = (cov_16lcdpz3tp().s[0]++, {
    config: {
      commitizen: {
        path: `./node_modules/${adapterNpmName}`
      }
    }
  });
  let packageJsonPath = (cov_16lcdpz3tp().s[1]++, _path.default.join(getNearestProjectRootDirectory(repoPath), 'package.json'));
  let packageJsonString = (cov_16lcdpz3tp().s[2]++, _fs.default.readFileSync(packageJsonPath, 'utf-8')); // tries to detect the indentation and falls back to a default if it can't

  let indent = (cov_16lcdpz3tp().s[3]++, (cov_16lcdpz3tp().b[0][0]++, (0, _detectIndent.default)(packageJsonString).indent) || (cov_16lcdpz3tp().b[0][1]++, '  '));
  let packageJsonContent = (cov_16lcdpz3tp().s[4]++, JSON.parse(packageJsonString));
  let newPackageJsonContent = (cov_16lcdpz3tp().s[5]++, '');
  cov_16lcdpz3tp().s[6]++;

  if (_lodash.default.get(packageJsonContent, 'config.commitizen.path') !== adapterNpmName) {
    cov_16lcdpz3tp().b[1][0]++;
    cov_16lcdpz3tp().s[7]++;
    newPackageJsonContent = _lodash.default.merge(packageJsonContent, commitizenAdapterConfig);
  } else {
    cov_16lcdpz3tp().b[1][1]++;
  }

  cov_16lcdpz3tp().s[8]++;

  _fs.default.writeFileSync(packageJsonPath, JSON.stringify(newPackageJsonContent, null, indent) + '\n');
}
/**
 * Generates an npm install command given a map of strings and a package name
 */


function generateNpmInstallAdapterCommand(stringMappings, adapterNpmName) {
  cov_16lcdpz3tp().f[1]++;
  // Start with an initial npm install command
  let installAdapterCommand = (cov_16lcdpz3tp().s[9]++, `npm install ${adapterNpmName}`); // Append the neccesary arguments to it based on user preferences

  cov_16lcdpz3tp().s[10]++;

  for (let value of stringMappings.values()) {
    cov_16lcdpz3tp().s[11]++;

    if (value) {
      cov_16lcdpz3tp().b[2][0]++;
      cov_16lcdpz3tp().s[12]++;
      installAdapterCommand = installAdapterCommand + ' ' + value;
    } else {
      cov_16lcdpz3tp().b[2][1]++;
    }
  }

  cov_16lcdpz3tp().s[13]++;
  return installAdapterCommand;
}
/**
 * Generates an yarn add command given a map of strings and a package name
 */


function generateYarnAddAdapterCommand(stringMappings, adapterNpmName) {
  cov_16lcdpz3tp().f[2]++;
  // Start with an initial yarn add command
  let installAdapterCommand = (cov_16lcdpz3tp().s[14]++, `yarn add ${adapterNpmName}`); // Append the necessary arguments to it based on user preferences

  cov_16lcdpz3tp().s[15]++;

  for (let value of stringMappings.values()) {
    cov_16lcdpz3tp().s[16]++;

    if (value) {
      cov_16lcdpz3tp().b[3][0]++;
      cov_16lcdpz3tp().s[17]++;
      installAdapterCommand = installAdapterCommand + ' ' + value;
    } else {
      cov_16lcdpz3tp().b[3][1]++;
    }
  }

  cov_16lcdpz3tp().s[18]++;
  return installAdapterCommand;
}
/**
 * Gets the nearest npm_modules directory
 */


function getNearestNodeModulesDirectory(options) {
  cov_16lcdpz3tp().f[3]++;
  // Get the nearest node_modules directories to the current working directory
  let nodeModulesDirectories = (cov_16lcdpz3tp().s[19]++, (0, _findNodeModules.default)(options)); // Make sure we find a node_modules folder

  /* istanbul ignore else */

  cov_16lcdpz3tp().s[20]++;

  if ((cov_16lcdpz3tp().b[5][0]++, nodeModulesDirectories) && (cov_16lcdpz3tp().b[5][1]++, nodeModulesDirectories.length > 0)) {
    cov_16lcdpz3tp().b[4][0]++;
    cov_16lcdpz3tp().s[21]++;
    return nodeModulesDirectories[0];
  } else {
    console.error(`Error: Could not locate node_modules in your project's root directory. Did you forget to npm init or npm install?`);
  }
}
/**
 * Gets the nearest project root directory
 */


function getNearestProjectRootDirectory(repoPath, options) {
  cov_16lcdpz3tp().f[4]++;
  cov_16lcdpz3tp().s[22]++;
  return _path.default.join(repoPath, getNearestNodeModulesDirectory(options), '/../');
}
/**
 * Gets a map of arguments where the value is the corresponding npm strings
 */


function getNpmInstallStringMappings(save, saveDev, saveExact, force) {
  cov_16lcdpz3tp().f[5]++;
  cov_16lcdpz3tp().s[23]++;
  return new Map().set('save', (cov_16lcdpz3tp().b[7][0]++, save) && (cov_16lcdpz3tp().b[7][1]++, !saveDev) ? (cov_16lcdpz3tp().b[6][0]++, '--save') : (cov_16lcdpz3tp().b[6][1]++, undefined)).set('saveDev', saveDev ? (cov_16lcdpz3tp().b[8][0]++, '--save-dev') : (cov_16lcdpz3tp().b[8][1]++, undefined)).set('saveExact', saveExact ? (cov_16lcdpz3tp().b[9][0]++, '--save-exact') : (cov_16lcdpz3tp().b[9][1]++, undefined)).set('force', force ? (cov_16lcdpz3tp().b[10][0]++, '--force') : (cov_16lcdpz3tp().b[10][1]++, undefined));
}
/**
 * Gets a map of arguments where the value is the corresponding yarn strings
 */


function getYarnAddStringMappings(dev, exact, force) {
  cov_16lcdpz3tp().f[6]++;
  cov_16lcdpz3tp().s[24]++;
  return new Map().set('dev', dev ? (cov_16lcdpz3tp().b[11][0]++, '--dev') : (cov_16lcdpz3tp().b[11][1]++, undefined)).set('exact', exact ? (cov_16lcdpz3tp().b[12][0]++, '--exact') : (cov_16lcdpz3tp().b[12][1]++, undefined)).set('force', force ? (cov_16lcdpz3tp().b[13][0]++, '--force') : (cov_16lcdpz3tp().b[13][1]++, undefined));
}
/**
 * Gets the prompter from an adapter given an adapter path
 */


function getPrompter(adapterPath) {
  cov_16lcdpz3tp().f[7]++;
  // Resolve the adapter path
  let resolvedAdapterPath = (cov_16lcdpz3tp().s[25]++, resolveAdapterPath(adapterPath)); // Load the adapter

  let adapter = (cov_16lcdpz3tp().s[26]++, require(resolvedAdapterPath));
  /* istanbul ignore next */

  if (adapter && adapter.prompter && (0, _util.isFunction)(adapter.prompter)) {
    return adapter.prompter;
  } else if (adapter && adapter.default && adapter.default.prompter && (0, _util.isFunction)(adapter.default.prompter)) {
    return adapter.default.prompter;
  } else {
    throw new Error(`Could not find prompter method in the provided adapter module: ${adapterPath}`);
  }
}
/**
 * Given a resolvable module name or path, which can be a directory or file, will
 * return a located adapter path or will throw.
 */


function resolveAdapterPath(inboundAdapterPath) {
  cov_16lcdpz3tp().f[8]++;
  // Check if inboundAdapterPath is a path or node module name
  let parsed = (cov_16lcdpz3tp().s[27]++, _path.default.parse(inboundAdapterPath));
  let isPath = (cov_16lcdpz3tp().s[28]++, (cov_16lcdpz3tp().b[14][0]++, parsed.dir.length > 0) && (cov_16lcdpz3tp().b[14][1]++, parsed.dir.charAt(0) !== "@")); // Resolve from the root of the git repo if inboundAdapterPath is a path

  let absoluteAdapterPath = (cov_16lcdpz3tp().s[29]++, isPath ? (cov_16lcdpz3tp().b[15][0]++, _path.default.resolve(getGitRootPath(), inboundAdapterPath)) : (cov_16lcdpz3tp().b[15][1]++, inboundAdapterPath));
  cov_16lcdpz3tp().s[30]++;

  try {
    cov_16lcdpz3tp().s[31]++;
    // try to resolve the given path
    return require.resolve(absoluteAdapterPath);
  } catch (error) {
    cov_16lcdpz3tp().s[32]++;
    error.message = "Could not resolve " + absoluteAdapterPath + ". " + error.message;
    cov_16lcdpz3tp().s[33]++;
    throw error;
  }
}

function getGitRootPath() {
  cov_16lcdpz3tp().f[9]++;
  cov_16lcdpz3tp().s[34]++;
  return _child_process.default.spawnSync('git', ['rev-parse', '--show-toplevel'], {
    encoding: 'utf8'
  }).stdout.trim();
}