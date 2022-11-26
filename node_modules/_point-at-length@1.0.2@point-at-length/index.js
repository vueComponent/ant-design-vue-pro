var parse = require('parse-svg-path');
var isarray = require('isarray');
var abs = require('abs-svg-path');

module.exports = Points;

function Points (path) {
    if (!(this instanceof Points)) return new Points(path);
    this._path = isarray(path) ? path : parse(path);
    this._path = abs(this._path);
    this._path = zToL(this._path);
}

Points.prototype.at = function (pos, opts) {
    return this._walk(pos, opts).pos;
};

Points.prototype.length = function () {
    return this._walk(null).length;
};

Points.prototype._walk = function (pos, opts) {
    var cur = [ 0, 0 ];
    var prev = [ 0, 0, 0 ];
    var len = 0;
    var fudge = 1.045;
    if (typeof pos === 'number') pos *= fudge;
    
    for (var i = 0; i < this._path.length; i++) {
        var p = this._path[i];
        if (p[0] === 'M') {
            cur[0] = p[1];
            cur[1] = p[2];
            if (pos === 0) {
                return { length: len, pos: cur };
            }
        }
        else if (p[0] === 'C') {
            prev[0] = cur[0];
            prev[1] = cur[1];
            prev[2] = len;
            
            var n = 100;
            for (var j = 0; j <= n; j++) {
                var t = j / n;
                var x = xof_C(p, t);
                var y = yof_C(p, t);
                len += dist(cur[0], cur[1], x, y);
                
                cur[0] = x;
                cur[1] = y;
                
                if (typeof pos === 'number' && len >= pos) {
                    var dv = (len - pos) / (len - prev[2]);
                    
                    var npos = [
                        cur[0] * (1 - dv) + prev[0] * dv,
                        cur[1] * (1 - dv) + prev[1] * dv
                    ];
                    return { length: len, pos: npos };
                }
                prev[0] = cur[0];
                prev[1] = cur[1];
                prev[2] = len;
            }
        }
        else if (p[0] === 'Q') {
            prev[0] = cur[0];
            prev[1] = cur[1];
            prev[2] = len;
            
            var n = 100;
            for (var j = 0; j <= n; j++) {
                var t = j / n;
                var x = xof_Q(p, t);
                var y = yof_Q(p, t);
                len += dist(cur[0], cur[1], x, y);
                
                cur[0] = x;
                cur[1] = y;
                
                if (typeof pos === 'number' && len >= pos) {
                    var dv = (len - pos) / (len - prev[2]);
                    
                    var npos = [
                        cur[0] * (1 - dv) + prev[0] * dv,
                        cur[1] * (1 - dv) + prev[1] * dv
                    ];
                    return { length: len, pos: npos };
                }
                prev[0] = cur[0];
                prev[1] = cur[1];
                prev[2] = len;
            }
        }
        else if (p[0] === 'L') {
            prev[0] = cur[0];
            prev[1] = cur[1];
            prev[2] = len;

            len   += dist(cur[0], cur[1], p[1], p[2]);
            cur[0] = p[1];
            cur[1] = p[2];

            if (typeof pos === 'number' && len >= pos) {
                var dv = (len - pos) / (len - prev[2]);
                var npos = [
                    cur[0] * (1 - dv) + prev[0] * dv,
                    cur[1] * (1 - dv) + prev[1] * dv
                ];
                return { length: len, pos: npos };
            }
            prev[0] = cur[0];
            prev[1] = cur[1];
            prev[2] = len;
        }
    }
    return { length: len / fudge, pos: cur };
    
    function xof_C (p, t) {
        return Math.pow((1-t), 3) * cur[0]
            + 3 * Math.pow((1-t), 2) * t * p[1]
            + 3 * (1-t) * Math.pow(t, 2) * p[3]
            + Math.pow(t, 3) * p[5]
        ;
    }
    function yof_C (p, t) {
        return Math.pow((1-t), 3) * cur[1]
            + 3 * Math.pow((1-t), 2) * t * p[2]
            + 3 * (1-t) * Math.pow(t, 2) * p[4]
            + Math.pow(t, 3) * p[6]
        ;
    }

    function xof_Q (p, t) {
        return Math.pow((1-t), 2) * cur[0]
            + 2 * (1-t) * t * p[1]
            + Math.pow(t, 2) * p[3]
        ;
    }
    function yof_Q (p, t) {
        return Math.pow((1-t), 2) * cur[1]
            + 2 * (1-t) * t * p[2]
            + Math.pow(t, 2) * p[4]
        ;
    }
};

function dist (ax, ay, bx, by) {
    var x = ax - bx;
    var y = ay - by;
    return Math.sqrt(x*x + y*y);
}

// Convert 'Z' segments to 'L' segments
function zToL(path){
    var ret = [];
    var startPoint = ['L',0,0];

    for(var i=0, len=path.length; i<len; i++){
        var pt = path[i];
        switch(pt[0]){
            case 'M':
                startPoint = ['L', pt[1], pt[2]];
                ret.push(pt);
                break;
            case 'Z':
                ret.push(startPoint);
                break;
            default: 
                ret.push(pt);
        }
    }
    return ret;
}
