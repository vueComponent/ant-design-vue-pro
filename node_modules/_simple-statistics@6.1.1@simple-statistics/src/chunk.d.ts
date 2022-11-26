/**
 * https://simplestatistics.org/docs/#chunk
 */
declare function chunk<T extends any>(
    x: T[],
    chunkSize: number
): T[][]

export default chunk;
