/**
 * https://simplestatistics.org/docs/#ckmeans
 */
declare function ckmeans<T extends number[]>(
    x: T,
    nClusters: number
): T[]

export default ckmeans;
