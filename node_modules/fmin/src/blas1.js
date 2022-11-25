// need some basic operations on vectors, rather than adding a dependency,
// just define here
export function zeros(x) { var r = new Array(x); for (var i = 0; i < x; ++i) { r[i] = 0; } return r; }
export function zerosM(x,y) { return zeros(x).map(function() { return zeros(y); }); }

export function dot(a, b) {
    var ret = 0;
    for (var i = 0; i < a.length; ++i) {
        ret += a[i] * b[i];
    }
    return ret;
}

export function norm2(a)  {
    return Math.sqrt(dot(a, a));
}

export function scale(ret, value, c) {
    for (var i = 0; i < value.length; ++i) {
        ret[i] = value[i] * c;
    }
}

export function weightedSum(ret, w1, v1, w2, v2) {
    for (var j = 0; j < ret.length; ++j) {
        ret[j] = w1 * v1[j] + w2 * v2[j];
    }
}
