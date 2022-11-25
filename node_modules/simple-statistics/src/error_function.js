/* @flow */

/**
 * **[Gaussian error function](http://en.wikipedia.org/wiki/Error_function)**
 *
 * The `errorFunction(x/(sd * Math.sqrt(2)))` is the probability that a value in a
 * normal distribution with standard deviation sd is within x of the mean.
 *
 * This function returns a numerical approximation to the exact value.
 *
 * @param {number} x input
 * @return {number} error estimation
 * @example
 * errorFunction(1).toFixed(2); // => '0.84'
 */
function errorFunction(x /*: number */) /*: number */ {
    const t = 1 / (1 + 0.5 * Math.abs(x));
    const tau =
        t *
        Math.exp(
            -Math.pow(x, 2) -
                1.26551223 +
                1.00002368 * t +
                0.37409196 * Math.pow(t, 2) +
                0.09678418 * Math.pow(t, 3) -
                0.18628806 * Math.pow(t, 4) +
                0.27886807 * Math.pow(t, 5) -
                1.13520398 * Math.pow(t, 6) +
                1.48851587 * Math.pow(t, 7) -
                0.82215223 * Math.pow(t, 8) +
                0.17087277 * Math.pow(t, 9)
        );
    if (x >= 0) {
        return 1 - tau;
    } else {
        return tau - 1;
    }
}

export default errorFunction;
