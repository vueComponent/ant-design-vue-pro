/**
 * https://simplestatistics.org/docs/#shuffle
 */
declare function shuffle<T extends any[]>(
    x: T,
    randomSource?: (() => number)
): T

export default shuffle;
