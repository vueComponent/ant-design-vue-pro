const uniqueId = (function() {
  const map = {};
  return function(prefix) {
    prefix = prefix || 'g';
    if (!map[prefix]) {
      map[prefix] = 1;
    } else {
      map[prefix] += 1;
    }
    return prefix + map[prefix];
  };
})();

module.exports = uniqueId;
