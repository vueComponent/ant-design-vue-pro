/**
 * https://simplestatistics.org/docs/#chisquaredgoodnessoffit
 */
declare function chiSquaredGoodnessOfFit(
    data: number[],
    distributionType: Function,
    significance: number
): boolean

export default chiSquaredGoodnessOfFit;
