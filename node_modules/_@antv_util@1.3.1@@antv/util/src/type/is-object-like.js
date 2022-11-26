const isObjectLike = function(value) {
    /**
     * isObjectLike({}) => true
     * isObjectLike([1, 2, 3]) => true
     * isObjectLike(Function) => false
     * isObjectLike(null) => false
     */
  return typeof value === 'object' && value !== null;
};

module.exports = isObjectLike;
