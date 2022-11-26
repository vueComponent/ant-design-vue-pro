/* @flow */

// # simple-statistics
//
// A simple, literate statistics system.

// Linear Regression
export { default as linearRegression } from './src/linear_regression';
export { default as linearRegressionLine } from './src/linear_regression_line';
export { default as standardDeviation } from './src/standard_deviation';
export { default as rSquared } from './src/r_squared';
export { default as mode } from './src/mode';
export { default as modeFast } from './src/mode_fast';
export { default as modeSorted } from './src/mode_sorted';
export { default as min } from './src/min';
export { default as max } from './src/max';
export { default as minSorted } from './src/min_sorted';
export { default as maxSorted } from './src/max_sorted';
export { default as sum } from './src/sum';
export { default as sumSimple } from './src/sum_simple';
export { default as product } from './src/product';
export { default as quantile } from './src/quantile';
export { default as quantileSorted } from './src/quantile_sorted';
export { default as quantileRank } from './src/quantile_rank';
export { default as quantileRankSorted } from './src/quantile_rank_sorted';
export { default as interquartileRange, default as iqr } from './src/interquartile_range';
export { default as medianAbsoluteDeviation, default as mad } from './src/median_absolute_deviation';
export { default as chunk } from './src/chunk';
export { default as sampleWithReplacement } from './src/sample_with_replacement';
export { default as shuffle } from './src/shuffle';
export { default as shuffleInPlace } from './src/shuffle_in_place';
export { default as sample } from './src/sample';
export { default as ckmeans } from './src/ckmeans';
export { default as uniqueCountSorted } from './src/unique_count_sorted';
export { default as sumNthPowerDeviations } from './src/sum_nth_power_deviations';
export { default as equalIntervalBreaks } from './src/equal_interval_breaks';

// sample statistics
export { default as sampleCovariance } from './src/sample_covariance';
export { default as sampleCorrelation } from './src/sample_correlation';
export { default as sampleVariance } from './src/sample_variance';
export { default as sampleStandardDeviation } from './src/sample_standard_deviation';
export { default as sampleSkewness } from './src/sample_skewness';
export { default as sampleKurtosis } from './src/sample_kurtosis';

// combinatorics
export { default as permutationsHeap } from './src/permutations_heap';
export { default as combinations } from './src/combinations';
export { default as combinationsReplacement } from './src/combinations_replacement';

// measures of centrality
export { default as addToMean } from './src/add_to_mean';
export { default as combineMeans } from './src/combine_means';
export { default as combineVariances } from './src/combine_variances';
export { default as geometricMean } from './src/geometric_mean';
export { default as harmonicMean } from './src/harmonic_mean';
export { default as average, default as mean } from './src/mean';
export { default as median } from './src/median';
export { default as medianSorted } from './src/median_sorted';
export { default as subtractFromMean } from './src/subtract_from_mean';

export { default as rootMeanSquare, default as rms } from './src/root_mean_square';
export { default as variance } from './src/variance';
export { default as tTest } from './src/t_test';
export { default as tTestTwoSample } from './src/t_test_two_sample';
// ss.jenks = require('./src/jenks');

// Classifiers
export { default as BayesianClassifier, default as bayesian } from './src/bayesian_classifier';
export { default as PerceptronModel, default as perceptron } from './src/perceptron';

// Distribution-related methods
export { default as epsilon } from './src/epsilon'; // We make ε available to the test suite.
export { default as factorial } from './src/factorial';
export { default as bernoulliDistribution } from './src/bernoulli_distribution';
export { default as binomialDistribution } from './src/binomial_distribution';
export { default as poissonDistribution } from './src/poisson_distribution';
export { default as chiSquaredDistributionTable } from './src/chi_squared_distribution_table';
export { default as chiSquaredGoodnessOfFit } from './src/chi_squared_goodness_of_fit';
export { default as kernelDensityEstimation, default as kde } from './src/kernel_density_estimation';

// Normal distribution
export { default as zScore } from './src/z_score';
export { default as cumulativeStdNormalProbability } from './src/cumulative_std_normal_probability';
export { default as standardNormalTable } from './src/standard_normal_table';
export { default as errorFunction, default as erf } from './src/error_function';
export { default as inverseErrorFunction } from './src/inverse_error_function';
export { default as probit } from './src/probit';

// Root-finding methods
export { default as bisect } from './src/bisect';

// Utils
export { default as quickselect } from './src/quickselect';
export { default as sign } from './src/sign';
export { default as numericSort } from './src/numeric_sort';
