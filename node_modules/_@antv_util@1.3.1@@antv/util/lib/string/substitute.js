var substitute = function substitute(str, o) {
  if (!str || !o) {
    return str;
  }
  return str.replace(/\\?\{([^{}]+)\}/g, function (match, name) {
    if (match.charAt(0) === '\\') {
      return match.slice(1);
    }
    return o[name] === undefined ? '' : o[name];
  });
};

module.exports = substitute;