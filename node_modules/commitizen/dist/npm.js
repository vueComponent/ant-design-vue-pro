// this file left blank until npm init is implemented
"use strict";

function cov_1gc3c8mxtr() {
  var path = "/home/runner/work/cz-cli/cz-cli/src/npm.js";
  var hash = "05b9d3440fe2b0b7f84bf1dcc5d4f9bf2770e33e";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/runner/work/cz-cli/cz-cli/src/npm.js",
    statementMap: {},
    fnMap: {},
    branchMap: {},
    s: {},
    f: {},
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "05b9d3440fe2b0b7f84bf1dcc5d4f9bf2770e33e"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1gc3c8mxtr = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1gc3c8mxtr();