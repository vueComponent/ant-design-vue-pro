const mod = function(n, m) {
  return ((n % m) + m) % m;
};

module.exports = mod;
