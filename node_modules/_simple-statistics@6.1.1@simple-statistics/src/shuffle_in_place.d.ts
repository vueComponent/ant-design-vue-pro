/**
 * https://simplestatistics.org/docs/#shuffleinplace
 */
declare function shuffleInPlace<T extends any[]>(
    x: T,
    randomSource?: (() => number)
): T

export default shuffleInPlace;
