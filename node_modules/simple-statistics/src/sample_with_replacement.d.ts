/**
 * https://simplestatistics.org/docs/#samplewithreplacement
 */
declare function sampleWithReplacement<T extends any>(
    x: T[],
    n: number,
    randomSource?: (() => number)
): T[]

export default sampleWithReplacement;
