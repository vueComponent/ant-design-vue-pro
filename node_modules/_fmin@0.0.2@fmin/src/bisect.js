/** finds the zeros of a function, given two starting points (which must
 * have opposite signs */
export function bisect(f, a, b, parameters) {
    parameters = parameters || {};
    var maxIterations = parameters.maxIterations || 100,
        tolerance = parameters.tolerance || 1e-10,
        fA = f(a),
        fB = f(b),
        delta = b - a;

    if (fA * fB > 0) {
        throw "Initial bisect points must have opposite signs";
    }

    if (fA === 0) return a;
    if (fB === 0) return b;

    for (var i = 0; i < maxIterations; ++i) {
        delta /= 2;
        var mid = a + delta,
            fMid = f(mid);

        if (fMid * fA >= 0) {
            a = mid;
        }

        if ((Math.abs(delta) < tolerance) || (fMid === 0)) {
            return mid;
        }
    }
    return a + delta;
}
