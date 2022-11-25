import {dot, norm2, scale, zeros, weightedSum} from "./blas1";
import {wolfeLineSearch} from "./linesearch";

export function gradientDescent(f, initial, params) {
    params = params || {};
    var maxIterations = params.maxIterations || initial.length * 100,
        learnRate = params.learnRate || 0.001,
        current = {x: initial.slice(), fx: 0, fxprime: initial.slice()};

    for (var i = 0; i < maxIterations; ++i) {
        current.fx = f(current.x, current.fxprime);
        if (params.history) {
            params.history.push({x: current.x.slice(),
                                 fx: current.fx,
                                 fxprime: current.fxprime.slice()});
        }

        weightedSum(current.x, 1, current.x, -learnRate, current.fxprime);
        if (norm2(current.fxprime) <= 1e-5) {
            break;
        }
    }

    return current;
}

export function gradientDescentLineSearch(f, initial, params) {
    params = params || {};
    var current = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
        next = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
        maxIterations = params.maxIterations || initial.length * 100,
        learnRate = params.learnRate || 0.001,
        pk = initial.slice(),
        temp;

    current.fx = f(current.x, current.fxprime);
    for (var i = 0; i < maxIterations; ++i) {
        scale(pk, current.fxprime, -1);
        learnRate = wolfeLineSearch(f, pk, current, next, learnRate);

        if (params.history) {
            params.history.push({x: current.x.slice(),
                                 fx: current.fx,
                                 fxprime: current.fxprime.slice(),
                                 alpha: learnRate});
        }
        if ((learnRate === 0) || (norm2(current.fxprime) < 1e-5)) break;

        temp = current;
        current = next;
        next = temp;
    }

    return current;
}

