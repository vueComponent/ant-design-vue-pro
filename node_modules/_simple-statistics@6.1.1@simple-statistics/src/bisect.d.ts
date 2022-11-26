/**
 * https://simplestatistics.org/docs/#bisect
 */
declare function bisect(
    func: (x: any) => number,
    start: number,
    end: number,
    maxIterations: number,
    errorTolerance: number
): number

export default bisect;
