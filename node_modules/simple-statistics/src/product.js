/* @flow */

/**
 * The [product](https://en.wikipedia.org/wiki/Product_(mathematics)) of an array
 * is the result of multiplying all numbers together, starting using one as the multiplicative identity.
 *
 * This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x input
 * @return {number} product of all input numbers
 * @example
 * product([1, 2, 3, 4]); // => 24
 */
function product(x /*: Array<number> */) /*: number */ {
    let value = 1;
    for (let i = 0; i < x.length; i++) {
        value *= x[i];
    }
    return value;
}

export default product;
