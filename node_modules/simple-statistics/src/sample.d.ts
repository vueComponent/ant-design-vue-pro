/**
 * https://simplestatistics.org/docs/#sample
 */
declare function sample<T extends any>(
    x: T[],
    n: number,
    randomSource: (() => number)
): T[]

export default sample;
