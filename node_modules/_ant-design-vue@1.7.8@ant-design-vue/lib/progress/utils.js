"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validProgress = validProgress;
function validProgress(progress) {
  if (!progress || progress < 0) {
    return 0;
  }
  if (progress > 100) {
    return 100;
  }
  return progress;
}