module.exports = function removeEmptyLines (string) {
  return string.replace(/[\s\r\n]+$/, '')
}
