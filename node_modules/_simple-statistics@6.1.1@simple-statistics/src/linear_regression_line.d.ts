/**
 * https://simplestatistics.org/docs/#linearregressionline
 */
declare function linearRegressionLine(
    mb: {b: number, m: number}
): (x: number) => number;

export default linearRegressionLine;
