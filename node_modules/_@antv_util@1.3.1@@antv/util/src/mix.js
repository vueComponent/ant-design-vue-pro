function _mix(dist, obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && key !== 'constructor' && obj[key] !== undefined) {
      dist[key] = obj[key];
    }
  }
}

const mix = function(dist, src1, src2, src3) {
  if (src1) _mix(dist, src1);
  if (src2) _mix(dist, src2);
  if (src3) _mix(dist, src3);
  return dist;
};

module.exports = mix;
