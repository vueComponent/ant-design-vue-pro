"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = load;

var _configLoader = require("../configLoader");

function cov_1itu0bpi0j() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/commitizen/configLoader.js";
  var hash = "c627c83b933ee54517e9c98550128758f664f3aa";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/commitizen/configLoader.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 14
        },
        end: {
          line: 6,
          column: 51
        }
      },
      "1": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 9,
          column: 38
        }
      }
    },
    fnMap: {
      "0": {
        name: "load",
        decl: {
          start: {
            line: 8,
            column: 9
          },
          end: {
            line: 8,
            column: 13
          }
        },
        loc: {
          start: {
            line: 8,
            column: 28
          },
          end: {
            line: 10,
            column: 1
          }
        },
        line: 8
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "c627c83b933ee54517e9c98550128758f664f3aa"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1itu0bpi0j = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1itu0bpi0j();
// Configuration sources in priority order.
var configs = (cov_1itu0bpi0j().s[0]++, ['.czrc', '.cz.json', 'package.json']);

function load(config, cwd) {
  cov_1itu0bpi0j().f[0]++;
  cov_1itu0bpi0j().s[1]++;
  return (0, _configLoader.loader)(configs, config, cwd);
}