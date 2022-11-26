
const SPACES = '\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029';
const PATH_COMMAND = new RegExp('([a-z])[' + SPACES + ',]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[' + SPACES + ']*,?[' + SPACES + ']*)+)', 'ig');
const PATH_VALUES = new RegExp('(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[' + SPACES + ']*,?[' + SPACES + ']*', 'ig');

// Parses given path string into an array of arrays of path segments
module.exports = function parsePathString(pathString) {
  if (!pathString) {
    return null;
  }

  if (typeof pathString === typeof []) {
    return pathString;
  }
  const paramCounts = {
    a: 7,
    c: 6,
    o: 2,
    h: 1,
    l: 2,
    m: 2,
    r: 4,
    q: 4,
    s: 4,
    t: 2,
    v: 1,
    u: 3,
    z: 0
  };
  const data = [];

  String(pathString).replace(PATH_COMMAND, function(a, b, c) {
    const params = [];
    let name = b.toLowerCase();
    c.replace(PATH_VALUES, function(a, b) {
      b && params.push(+b);
    });
    if (name === 'm' && params.length > 2) {
      data.push([ b ].concat(params.splice(0, 2)));
      name = 'l';
      b = b === 'm' ? 'l' : 'L';
    }
    if (name === 'o' && params.length === 1) {
      data.push([ b, params[0] ]);
    }
    if (name === 'r') {
      data.push([ b ].concat(params));
    } else {
      while (params.length >= paramCounts[name]) {
        data.push([ b ].concat(params.splice(0, paramCounts[name])));
        if (!paramCounts[name]) {
          break;
        }
      }
    }
  });

  return data;
};
