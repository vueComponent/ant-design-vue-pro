// isFinite,
const isNil = function(value) {
    /**
     * isNil(null) => true
     * isNil() => true
     */
  return value === null || value === undefined;
};

module.exports = isNil;
