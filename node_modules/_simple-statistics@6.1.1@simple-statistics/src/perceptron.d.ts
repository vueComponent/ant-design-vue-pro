/**
 * https://simplestatistics.org/docs/#perceptronmodel
 */
declare class PerceptronModel {
    public weights: number[]
    public bias: number
    predict(features: number[]): number
    train(features: number[], label: number): PerceptronModel
}

export default PerceptronModel;
