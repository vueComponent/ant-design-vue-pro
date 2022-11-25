/* @flow */

import sampleCovariance from "./sample_covariance";
import sampleStandardDeviation from "./sample_standard_deviation";

/**
 * The [correlation](http://en.wikipedia.org/wiki/Correlation_and_dependence) is
 * a measure of how correlated two datasets are, between -1 and 1
 *
 * @param {Array<number>} x first input
 * @param {Array<number>} y second input
 * @returns {number} sample correlation
 * @example
 * sampleCorrelation([1, 2, 3, 4, 5, 6], [2, 2, 3, 4, 5, 60]).toFixed(2);
 * // => '0.69'
 */
function sampleCorrelation(
    x /*: Array<number> */,
    y /*: Array<number> */
) /*:number*/ {
    const cov = sampleCovariance(x, y);
    const xstd = sampleStandardDeviation(x);
    const ystd = sampleStandardDeviation(y);

    return cov / xstd / ystd;
}

export default sampleCorrelation;
