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
        learnRate = params.learnRate || 1,
        pk = initial.slice(),
        c1 = params.c1 || 1e-3,
        c2 = params.c2 || 0.1,
        temp,
        functionCalls = [];

    if (params.history) {
        // wrap the function call to track linesearch samples
        var inner = f;
        f = function(x, fxprime) {
            functionCalls.push(x.slice());
            return inner(x, fxprime);
        };
    }

    current.fx = f(current.x, current.fxprime);
    for (var i = 0; i < maxIterations; ++i) {
        scale(pk, current.fxprime, -1);
        learnRate = wolfeLineSearch(f, pk, current, next, learnRate, c1, c2);

        if (params.history) {
            params.history.push({x: current.x.slice(),
                                 fx: current.fx,
                                 fxprime: current.fxprime.slice(),
                                 functionCalls: functionCalls,
                                 learnRate: learnRate,
                                 alpha: learnRate});
            functionCalls = [];
        }


        temp = current;
        current = next;
        next = temp;

        if ((learnRate === 0) || (norm2(current.fxprime) < 1e-5)) break;
    }

    return current;
}

