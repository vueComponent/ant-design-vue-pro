"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commit = commit;

var _child_process = require("child_process");

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

var _dedent = _interopRequireDefault(require("dedent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cov_lpc78prp4() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/git/commit.js";
  var hash = "dffb8a6807d61696bc8019d6e9da18a39917eafb";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/git/commit.js",
    statementMap: {
      "0": {
        start: {
          line: 15,
          column: 15
        },
        end: {
          line: 15,
          column: 20
        }
      },
      "1": {
        start: {
          line: 20,
          column: 2
        },
        end: {
          line: 85,
          column: 3
        }
      },
      "2": {
        start: {
          line: 21,
          column: 15
        },
        end: {
          line: 21,
          column: 73
        }
      },
      "3": {
        start: {
          line: 22,
          column: 16
        },
        end: {
          line: 25,
          column: 6
        }
      },
      "4": {
        start: {
          line: 27,
          column: 4
        },
        end: {
          line: 32,
          column: 7
        }
      },
      "5": {
        start: {
          line: 28,
          column: 6
        },
        end: {
          line: 28,
          column: 25
        }
      },
      "6": {
        start: {
          line: 28,
          column: 18
        },
        end: {
          line: 28,
          column: 25
        }
      },
      "7": {
        start: {
          line: 29,
          column: 6
        },
        end: {
          line: 29,
          column: 20
        }
      },
      "8": {
        start: {
          line: 31,
          column: 6
        },
        end: {
          line: 31,
          column: 16
        }
      },
      "9": {
        start: {
          line: 34,
          column: 4
        },
        end: {
          line: 51,
          column: 7
        }
      },
      "10": {
        start: {
          line: 35,
          column: 6
        },
        end: {
          line: 35,
          column: 25
        }
      },
      "11": {
        start: {
          line: 35,
          column: 18
        },
        end: {
          line: 35,
          column: 25
        }
      },
      "12": {
        start: {
          line: 36,
          column: 6
        },
        end: {
          line: 36,
          column: 20
        }
      },
      "13": {
        start: {
          line: 38,
          column: 6
        },
        end: {
          line: 50,
          column: 7
        }
      },
      "14": {
        start: {
          line: 39,
          column: 8
        },
        end: {
          line: 46,
          column: 9
        }
      },
      "15": {
        start: {
          line: 40,
          column: 10
        },
        end: {
          line: 45,
          column: 14
        }
      },
      "16": {
        start: {
          line: 47,
          column: 8
        },
        end: {
          line: 47,
          column: 95
        }
      },
      "17": {
        start: {
          line: 49,
          column: 8
        },
        end: {
          line: 49,
          column: 19
        }
      },
      "18": {
        start: {
          line: 53,
          column: 23
        },
        end: {
          line: 56,
          column: 12
        }
      },
      "19": {
        start: {
          line: 57,
          column: 27
        },
        end: {
          line: 57,
          column: 66
        }
      },
      "20": {
        start: {
          line: 58,
          column: 4
        },
        end: {
          line: 84,
          column: 5
        }
      },
      "21": {
        start: {
          line: 59,
          column: 17
        },
        end: {
          line: 59,
          column: 46
        }
      },
      "22": {
        start: {
          line: 60,
          column: 6
        },
        end: {
          line: 67,
          column: 7
        }
      },
      "23": {
        start: {
          line: 61,
          column: 8
        },
        end: {
          line: 61,
          column: 43
        }
      },
      "24": {
        start: {
          line: 62,
          column: 8
        },
        end: {
          line: 62,
          column: 19
        }
      },
      "25": {
        start: {
          line: 64,
          column: 8
        },
        end: {
          line: 64,
          column: 16
        }
      },
      "26": {
        start: {
          line: 66,
          column: 8
        },
        end: {
          line: 66,
          column: 22
        }
      },
      "27": {
        start: {
          line: 71,
          column: 6
        },
        end: {
          line: 83,
          column: 7
        }
      },
      "28": {
        start: {
          line: 72,
          column: 19
        },
        end: {
          line: 72,
          column: 49
        }
      },
      "29": {
        start: {
          line: 73,
          column: 8
        },
        end: {
          line: 80,
          column: 9
        }
      },
      "30": {
        start: {
          line: 74,
          column: 10
        },
        end: {
          line: 74,
          column: 45
        }
      },
      "31": {
        start: {
          line: 75,
          column: 10
        },
        end: {
          line: 75,
          column: 21
        }
      },
      "32": {
        start: {
          line: 77,
          column: 10
        },
        end: {
          line: 77,
          column: 18
        }
      },
      "33": {
        start: {
          line: 79,
          column: 10
        },
        end: {
          line: 79,
          column: 24
        }
      },
      "34": {
        start: {
          line: 82,
          column: 8
        },
        end: {
          line: 82,
          column: 16
        }
      }
    },
    fnMap: {
      "0": {
        name: "commit",
        decl: {
          start: {
            line: 14,
            column: 9
          },
          end: {
            line: 14,
            column: 15
          }
        },
        loc: {
          start: {
            line: 14,
            column: 51
          },
          end: {
            line: 86,
            column: 1
          }
        },
        line: 14
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 27,
            column: 22
          },
          end: {
            line: 27,
            column: 23
          }
        },
        loc: {
          start: {
            line: 27,
            column: 37
          },
          end: {
            line: 32,
            column: 5
          }
        },
        line: 27
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 34,
            column: 21
          },
          end: {
            line: 34,
            column: 22
          }
        },
        loc: {
          start: {
            line: 34,
            column: 45
          },
          end: {
            line: 51,
            column: 5
          }
        },
        line: 34
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 20,
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
            line: 20,
            column: 2
          },
          end: {
            line: 85,
            column: 3
          }
        }, {
          start: {
            line: 52,
            column: 9
          },
          end: {
            line: 85,
            column: 3
          }
        }],
        line: 20
      },
      "1": {
        loc: {
          start: {
            line: 21,
            column: 53
          },
          end: {
            line: 21,
            column: 71
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 21,
            column: 53
          },
          end: {
            line: 21,
            column: 65
          }
        }, {
          start: {
            line: 21,
            column: 69
          },
          end: {
            line: 21,
            column: 71
          }
        }],
        line: 21
      },
      "2": {
        loc: {
          start: {
            line: 24,
            column: 13
          },
          end: {
            line: 24,
            column: 49
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 24,
            column: 29
          },
          end: {
            line: 24,
            column: 37
          }
        }, {
          start: {
            line: 24,
            column: 40
          },
          end: {
            line: 24,
            column: 49
          }
        }],
        line: 24
      },
      "3": {
        loc: {
          start: {
            line: 28,
            column: 6
          },
          end: {
            line: 28,
            column: 25
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 28,
            column: 6
          },
          end: {
            line: 28,
            column: 25
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
        line: 28
      },
      "4": {
        loc: {
          start: {
            line: 35,
            column: 6
          },
          end: {
            line: 35,
            column: 25
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 35,
            column: 6
          },
          end: {
            line: 35,
            column: 25
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
        line: 35
      },
      "5": {
        loc: {
          start: {
            line: 38,
            column: 6
          },
          end: {
            line: 50,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 38,
            column: 6
          },
          end: {
            line: 50,
            column: 7
          }
        }, {
          start: {
            line: 48,
            column: 13
          },
          end: {
            line: 50,
            column: 7
          }
        }],
        line: 38
      },
      "6": {
        loc: {
          start: {
            line: 39,
            column: 8
          },
          end: {
            line: 46,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 39,
            column: 8
          },
          end: {
            line: 46,
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
        line: 39
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
      "2": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "dffb8a6807d61696bc8019d6e9da18a39917eafb"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_lpc78prp4 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_lpc78prp4();

/**
 * Asynchronously git commit at a given path with a message
 */
function commit(repoPath, message, options, done) {
  cov_lpc78prp4().f[0]++;
  let called = (cov_lpc78prp4().s[0]++, false); // commit the file by spawning a git process, unless the --hook
  // option was provided. in that case, write the commit message into
  // the .git/COMMIT_EDITMSG file

  cov_lpc78prp4().s[1]++;

  if (!options.hookMode) {
    cov_lpc78prp4().b[0][0]++;
    let args = (cov_lpc78prp4().s[2]++, ['commit', '-m', (0, _dedent.default)(message), ...((cov_lpc78prp4().b[1][0]++, options.args) || (cov_lpc78prp4().b[1][1]++, []))]);
    let child = (cov_lpc78prp4().s[3]++, (0, _child_process.spawn)('git', args, {
      cwd: repoPath,
      stdio: options.quiet ? (cov_lpc78prp4().b[2][0]++, 'ignore') : (cov_lpc78prp4().b[2][1]++, 'inherit')
    }));
    cov_lpc78prp4().s[4]++;
    child.on('error', function (err) {
      cov_lpc78prp4().f[1]++;
      cov_lpc78prp4().s[5]++;

      if (called) {
        cov_lpc78prp4().b[3][0]++;
        cov_lpc78prp4().s[6]++;
        return;
      } else {
        cov_lpc78prp4().b[3][1]++;
      }

      cov_lpc78prp4().s[7]++;
      called = true;
      cov_lpc78prp4().s[8]++;
      done(err);
    });
    cov_lpc78prp4().s[9]++;
    child.on('exit', function (code, signal) {
      cov_lpc78prp4().f[2]++;
      cov_lpc78prp4().s[10]++;

      if (called) {
        cov_lpc78prp4().b[4][0]++;
        cov_lpc78prp4().s[11]++;
        return;
      } else {
        cov_lpc78prp4().b[4][1]++;
      }

      cov_lpc78prp4().s[12]++;
      called = true;
      cov_lpc78prp4().s[13]++;

      if (code) {
        cov_lpc78prp4().b[5][0]++;
        cov_lpc78prp4().s[14]++;

        if (code === 128) {
          cov_lpc78prp4().b[6][0]++;
          cov_lpc78prp4().s[15]++;
          console.warn(`
            Git exited with code 128. Did you forget to run:

              git config --global user.email "you@example.com"
              git config --global user.name "Your Name"
            `);
        } else {
          cov_lpc78prp4().b[6][1]++;
        }

        cov_lpc78prp4().s[16]++;
        done(Object.assign(new Error(`git exited with error code ${code}`), {
          code,
          signal
        }));
      } else {
        cov_lpc78prp4().b[5][1]++;
        cov_lpc78prp4().s[17]++;
        done(null);
      }
    });
  } else {
    cov_lpc78prp4().b[0][1]++;
    const gitDirPath = (cov_lpc78prp4().s[18]++, (0, _child_process.execSync)('git rev-parse --absolute-git-dir', {
      cwd: repoPath,
      encoding: 'utf8'
    }).trim());
    const commitFilePath = (cov_lpc78prp4().s[19]++, _path.default.join(gitDirPath, 'COMMIT_EDITMSG'));
    cov_lpc78prp4().s[20]++;

    try {
      const fd = (cov_lpc78prp4().s[21]++, (0, _fs.openSync)(commitFilePath, 'w'));
      cov_lpc78prp4().s[22]++;

      try {
        cov_lpc78prp4().s[23]++;
        (0, _fs.writeFileSync)(fd, (0, _dedent.default)(message));
        cov_lpc78prp4().s[24]++;
        done(null);
      } catch (e) {
        cov_lpc78prp4().s[25]++;
        done(e);
      } finally {
        cov_lpc78prp4().s[26]++;
        (0, _fs.closeSync)(fd);
      }
    } catch (e) {
      cov_lpc78prp4().s[27]++;

      // windows doesn't allow opening existing hidden files
      // in 'w' mode... but it does let you do 'r+'!
      try {
        const fd = (cov_lpc78prp4().s[28]++, (0, _fs.openSync)(commitFilePath, 'r+'));
        cov_lpc78prp4().s[29]++;

        try {
          cov_lpc78prp4().s[30]++;
          (0, _fs.writeFileSync)(fd, (0, _dedent.default)(message));
          cov_lpc78prp4().s[31]++;
          done(null);
        } catch (e) {
          cov_lpc78prp4().s[32]++;
          done(e);
        } finally {
          cov_lpc78prp4().s[33]++;
          (0, _fs.closeSync)(fd);
        }
      } catch (e) {
        cov_lpc78prp4().s[34]++;
        done(e);
      }
    }
  }
}