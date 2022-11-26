"use strict";

function cov_toszyysar() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/index.js";
  var hash = "2dc4d0be9f441adce3ca215aa053ea537077b4a1";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/index.js",
    statementMap: {
      "0": {
        start: {
          line: 1,
          column: 17
        },
        end: {
          line: 1,
          column: 40
        }
      },
      "1": {
        start: {
          line: 2,
          column: 0
        },
        end: {
          line: 2,
          column: 28
        }
      }
    },
    fnMap: {},
    branchMap: {},
    s: {
      "0": 0,
      "1": 0
    },
    f: {},
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "2dc4d0be9f441adce3ca215aa053ea537077b4a1"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_toszyysar = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_toszyysar();
var commitizen = (cov_toszyysar().s[0]++, require('./commitizen'));
cov_toszyysar().s[1]++;
module.exports = commitizen;